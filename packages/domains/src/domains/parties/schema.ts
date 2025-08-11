import { z } from "zod/v4";

export const partyMemberFormSchema = z.object({
	userId: z.cuid2(),
	role: z.int(),
	partyId: z.cuid2(),
});

export type PartyMemberFormSchema = z.infer<typeof partyMemberFormSchema>;

export const partyFormSchema = z.object({
	slug: z.string().min(2).max(100),
	name: z.string().min(2).max(100),
	description: z.string().max(500).optional(),
	location: z.tuple([z.number(), z.number()]),
});

export type PartyFormSchema = z.infer<typeof partyFormSchema>;

export const permissions = {
	canView: 0b1,
	canInteract: 0b10,
	canManage: 0b100,
	canDelete: 0b1000,
} as const;

export type Permissions = typeof permissions;
