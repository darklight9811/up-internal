import { z } from "zod/v4";

import { paginationSchema } from "../app";

export const coreMemberFormSchema = z.object({
	userId: z.cuid2(),
	coreId: z.cuid2(),
});

export type CoreMemberFormSchema = z.infer<typeof coreMemberFormSchema>;

export const coreFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().max(500).nullable(),
	location: z.tuple([z.number(), z.number()]),
	partyId: z.cuid2(),
});

export type CoreFormSchema = z.infer<typeof coreFormSchema>;

export const corePaginationSchema = paginationSchema.and(
	z.object({
		partyId: z.cuid2().optional(),
	}),
);

export type CorePaginationSchema = z.infer<typeof corePaginationSchema>;
