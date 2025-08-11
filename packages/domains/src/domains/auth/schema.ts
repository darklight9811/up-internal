import { v } from "@repo/ds/v";

export const registerSchema = v.object({
	name: v.string().min(2),
	email: v.email(),
	password: v.string(),
	locale: v.string().optional(),
});

export type RegisterSchema = v.infer<typeof registerSchema>;

export const loginSchema = v.object({
	email: v.email().min(5),
	password: v.string().min(8),
});

export type LoginSchema = v.infer<typeof loginSchema>;

export const verifyEmailSchema = v.object({
	token: v.string(),
});

export type VerifyEmailSchema = v.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = v.object({
	email: v.email(),
});

export type ForgotPasswordSchema = v.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = v.object({
	token: v.string(),
	password: v.string().min(8),
});

export type ResetPasswordSchema = v.infer<typeof resetPasswordSchema>;
