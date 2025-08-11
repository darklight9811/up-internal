import { z } from "zod/v4";

import { t } from "../../../utils/trpc";
import { paginationSchema } from "../../app";
import { partyFormSchema, partyMemberFormSchema } from "../schema";
import { partyService } from "./service.server";

export const partyRouter = t.router({
	index: t.protected.input(paginationSchema).query(({ ctx, input }) => partyService.index(input, ctx.user)),

	store: t.protected.input(partyFormSchema).mutation(({ ctx, input }) => partyService.store(input, ctx.user)),

	show: t.protected.input(z.string()).query(({ ctx, input }) => partyService.show(input, ctx.user)),

	update: t.protected
		.input(z.object({ id: z.string(), data: partyFormSchema }))
		.mutation(({ ctx, input }) => partyService.update(input.id, input.data, ctx.user)),

	delete: t.protected.input(z.string()).mutation(({ ctx, input }) => partyService.delete(input, ctx.user)),

	members: t.router({
		index: t.protected
			.input(paginationSchema.and(z.object({ party: z.string() })))
			.query(({ ctx, input }) => partyService.members.index(input.party, input, ctx.user)),

		add: t.protected
			.input(partyMemberFormSchema)
			.mutation(({ ctx, input }) => partyService.members.add(input.partyId, input, ctx.user)),

		update: t.protected
			.input(partyMemberFormSchema.and(z.object({ id: z.string(), data: partyMemberFormSchema })))
			.mutation(({ ctx, input }) =>
				partyService.members.update(input.data.partyId, input.id, input.data, ctx.user),
			),

		remove: t.protected
			.input(z.object({ partyId: z.string(), memberId: z.string() }))
			.mutation(({ ctx, input }) => partyService.members.remove(input.partyId, input.memberId, ctx.user)),
	}),
});
