import { v } from "@repo/ds/v";

export const userFormSchema = v.object({
	name: v.string(),
	image: v.string().optional().nullable(),
	email: v.email(),
	password: v.string().min(8).optional(),
});

export type UserFormSchema = v.infer<typeof userFormSchema>;

export const userSchema = v
	.object({
		id: v.id(),
		type: v.enum(["user", "admin", "dev"]).default("user"),
		isAnonymous: v.boolean().default(false),
		emailVerified: v.boolean().default(false),
	})
	.and(userFormSchema);

export type UserSchema = v.infer<typeof userSchema>;

export type UserSystemSchema = Pick<UserSchema, "id">;
