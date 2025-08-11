import { type ZodType, z } from "zod/v4";

export const paginationSchema = z
	.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(25),
		q: z.coerce.string().optional(),
		sort: z.enum(["asc", "desc"]).default("asc"),
		order: z.string().optional(),
	})
	.default({ limit: 25, page: 1, sort: "asc" });

export type PaginationSchema = z.infer<typeof paginationSchema>;

export function paginatedSchema<Response extends ZodType>(schema: Response) {
	return z
		.object({
			data: z.array(schema),
			pages: z.number(),
			items: z.number(),
		})
		.and(paginationSchema);
}
