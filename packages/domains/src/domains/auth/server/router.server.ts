import { t } from "../../../utils/trpc";
import { auth } from "../helpers/auth.server";
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from "../schema";
import { authService } from "./service.server";

export const authRouter = t.router({
	anonymous: t.route.mutation(async ({ ctx }) => {
		const response = await auth.api.signInAnonymous({
			request: ctx.req,
		});

		if (response?.token) ctx.cookie.set("token", response.token);

		return response?.user;
	}),

	register: t.route.input(registerSchema).mutation(async ({ input, ctx }) => {
		const response = await auth.api.signUpEmail({
			body: input,
			request: ctx.req,
		});

		if (response.token) ctx.cookie.set("token", response.token);

		return response.user;
	}),

	login: t.route.input(loginSchema).mutation(async ({ input, ctx }) => {
		const response = await auth.api.signInEmail({
			body: input,
			request: ctx.req,
		});

		if (response.token) ctx.cookie.set("token", response.token);

		return response.user;
	}),

	session: t.route.query(({ ctx }) => {
		const token = ctx.cookie.get("token");

		return authService.session(token);
	}),

	logout: t.protected.mutation(async ({ ctx }) => {
		const token = ctx.cookie.get("token");

		await authService.logout(token);

		ctx.cookie.remove("token");
	}),

	verifyEmail: t.protected
		.input(verifyEmailSchema)
		.mutation(async ({ input, ctx }) => {
			return auth.api.verifyEmail({
				request: ctx.req,
				query: { token: input.token },
			});
		}),

	sendVerificationEmail: t.protected.mutation(async ({ ctx }) => {
		const token = ctx.cookie.get("token");
		const user = await authService.session(token);

		return auth.api.sendVerificationEmail({
			request: ctx.req,
			body: {
				email: user!.email,
			},
		});
	}),

	forgotPassword: t.route
		.input(forgotPasswordSchema)
		.mutation(async ({ input, ctx }) => {
			return auth.api.forgetPassword({ body: input, request: ctx.req });
		}),

	resetPassword: t.route
		.input(resetPasswordSchema)
		.mutation(async ({ input, ctx }) => {
			return auth.api.resetPassword({
				body: {
					token: input.token,
					newPassword: input.password,
				},
				request: ctx.req,
			});
		}),
});
