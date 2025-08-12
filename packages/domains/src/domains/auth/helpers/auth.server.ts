import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins/bearer";

import { db } from "../../../utils/db";
import { email } from "../../../utils/email";
import { masks } from "../../../utils/masks";
import { env } from "../../app/env";
import { users } from "../../users/server/table.server";
import { accounts, sessions, verifications } from "../server/table.server";
import { starti18n } from "./localization";
import { sendPasswordResetEmail } from "@repo/emails/password-reset";
import { sendVerifyEmail } from "@repo/emails/verify";

export const auth = betterAuth({
	baseURL: `${env.app_url}/auth`,
	trustedOrigins: [`${process.env.APP_URL!}`, "http://localhost:3000"],

	plugins: [bearer()],

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
					locale: (await locale.getLocale(request!)) as "pt-br" | "en-us",
				}),
			);
		},
	},
	user: {
		additionalFields: {
			socialNumber: {
				type: "string",
				required: true,
				returned: false,
				sortable: true,
				unique: true,
				transform: {
					input: (e) => masks.cpf(e as string),
					output: (e) => masks.cpf(e as string),
				},
			},
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
					locale: (await locale.getLocale(request!)) as "pt-br" | "en-us",
				}),
			);
		},
	},
});
