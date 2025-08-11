import { z } from "zod/v4";

export const userFormSchema = z.object({
	name: z.string(),
	image: z.string().optional().nullable(),
	email: z.email(),
	password: z.string().min(8).optional(),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;

export const userSchema = z
	.object({
		id: z.cuid2(),
		type: z.enum(["user", "admin", "dev"]).default("user"),
		isAnonymous: z.boolean().default(false),
		emailVerified: z.boolean().default(false),
	})
	.and(userFormSchema);

export type UserSchema = z.infer<typeof userSchema>;

export type UserSystemSchema = Pick<UserSchema, "id">;
