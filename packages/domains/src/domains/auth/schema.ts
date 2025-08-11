import { z } from "zod/v4";

export const registerSchema = z.object({
	name: z.string().min(2),
	email: z.email(),
	password: z.string(),
	locale: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
	email: z.email().min(5),
	password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
	token: z.string(),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
	email: z.email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
	token: z.string(),
	password: z.string().min(8),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
