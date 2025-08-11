import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins/anonymous";
import { bearer } from "better-auth/plugins/bearer";
import { eq } from "drizzle-orm";

import { db } from "../../../utils/db";
import { email } from "../../../utils/email";
import { env } from "../../app/env";
import { feedbacks } from "../../feedbacks/server/table.server";
import { highscoreService } from "../../highscore/server/service.server";
import { highscores } from "../../highscore/server/table.server";
import { resources } from "../../resources/server/table.server";
import { runs } from "../../runs/server/table.server";
import { purchases } from "../../store/server/table.server";
import { users } from "../../users/server/table.server";
import { accounts, sessions, verifications } from "../server/table.server";
import { starti18n } from "./localization";
import { sendPasswordResetEmail } from "@repo/emails/password-reset";
import { sendVerifyEmail } from "@repo/emails/verify";

export const auth = betterAuth({
	baseURL: `${env.app_url}/auth`,
	trustedOrigins: [`${process.env.APP_URL!}`, "http://localhost:3000"],

	plugins: [
		bearer(),
		anonymous({
			async onLinkAccount(data) {
				db.transaction(async (tx) =>
					Promise.all([
						tx
							.update(resources)
							.set({ userId: data.newUser.user.id })
							.where(
								eq(
									resources.userId,
									data.anonymousUser.user.id,
								),
							),

						// get existing highscore from existing user to
						// make sure we don't lose it
						tx
							.select()
							.from(highscores)
							.where(
								eq(
									highscores.userId,
									data.anonymousUser.user.id,
								),
							)
							.limit(1)
							.then(
								async ([existingHighscore]) =>
									existingHighscore &&
									highscoreService.post(
										existingHighscore.value,
										data.newUser.user,
									),
							)
							// migrate highscores from anonymous user to new user
							.then(() =>
								tx
									.update(highscores)
									.set({
										userId: data.newUser.user.id,
									})
									.where(
										eq(
											highscores.userId,
											data.anonymousUser.user.id,
										),
									),
							),

						tx
							.update(purchases)
							.set({
								userId: data.newUser.user.id,
							})
							.where(
								eq(
									purchases.userId,
									data.anonymousUser.user.id,
								),
							),

						tx
							.update(runs)
							.set({
								userId: data.newUser.user.id,
							})
							.where(eq(runs.userId, data.anonymousUser.user.id)),

						tx
							.update(feedbacks)
							.set({
								userId: data.newUser.user.id,
							})
							.where(
								eq(
									feedbacks.userId,
									data.anonymousUser.user.id,
								),
							),
					]),
				);
			},
			generateName: () =>
				`Anonymous-${Math.random().toString(36).substring(2, 8)}`,
		}),
	],

	secret: env.secret,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			users,
			sessions,
			accounts,
			verifications,
		},
		usePlural: true,
	}),
	advanced: {
		cookieOptions: {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		},
		useSecureCookies: process.env.NODE_ENV === "production",
	},
	emailVerification: {
		sendOnSignUp: true,
		async sendVerificationEmail(data, request) {
			const locale = await starti18n();

			await email.emails.send(
				sendVerifyEmail({
					email: data.user.email,
					url: `${data.url.split("auth/verify-email")[0]}verify?${data.url.split("?")[1]}`,
					locale: (await locale.getLocale(request!)) as
						| "pt-br"
						| "en-us",
				}),
			);
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		async sendResetPassword(data, request) {
			const locale = await starti18n();

			await email.emails.send(
				sendPasswordResetEmail({
					email: data.user.email,
					url: `${data.url.split("auth/reset-password")[0]}password/reset?token=${data.token}`,
					locale: (await locale.getLocale(request!)) as
						| "pt-br"
						| "en-us",
				}),
			);
		},
	},
});
