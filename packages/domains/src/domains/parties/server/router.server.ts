import { z } from "zod/v4";

import { t } from "../../../utils/trpc";
import { paginationSchema } from "../../app";
import { partyFormSchema, partyMemberFormSchema } from "../schema";
import { partyService } from "./service.server";

export const partiesRouter = t.router({
	/**
	 * Get a list of parties
	 */
	index: t.protected.input(paginationSchema).query(({ ctx, input }) => partyService.index(input, ctx.user)),

	/**
	 * Create a new party
	 */
	store: t.protected.input(partyFormSchema).mutation(({ ctx, input }) => partyService.store(input, ctx.user)),

	/**
	 * Get a specific party
	 */
	show: t.protected.input(z.string()).query(({ ctx, input }) => partyService.show(input, ctx.user)),

	/**
	 * Update a specific party
	 */
	update: t.protected
		.input(z.object({ id: z.string(), data: partyFormSchema }))
		.mutation(({ ctx, input }) => partyService.update(input.id, input.data, ctx.user)),

	/**
	 * Delete a specific party
	 */
	delete: t.protected.input(z.string()).mutation(({ ctx, input }) => partyService.delete(input, ctx.user)),

	members: t.router({
		/**
		 * Get a list of party members
		 */
		index: t.protected
			.input(paginationSchema.and(z.object({ party: z.string() })))
			.query(({ ctx, input }) => partyService.members.index(input.party, input, ctx.user)),

		/**
		 * Add a new party member
		 */
		add: t.protected
			.input(partyMemberFormSchema)
			.mutation(({ ctx, input }) => partyService.members.add(input.partyId, input, ctx.user)),

		/**
		 * Update a party member
		 */
		update: t.protected
			.input(partyMemberFormSchema.and(z.object({ id: z.string(), data: partyMemberFormSchema })))
			.mutation(({ ctx, input }) =>
				partyService.members.update(input.data.partyId, input.id, input.data, ctx.user),
			),

		/**
		 * Remove a party member
		 */
		remove: t.protected
			.input(z.object({ partyId: z.string(), memberId: z.string() }))
			.mutation(({ ctx, input }) => partyService.members.remove(input.partyId, input.memberId, ctx.user)),
	}),

	current: t.router({
		get: t.protected.query(({ ctx }) => {
			const id = ctx.cookie.get("partyId");

			if (!id) return null;

			return partyService.show(id, ctx.user);
		}),

		set: t.protected.input(z.string()).mutation(({ ctx, input }) => {
			ctx.cookie.set("partyId", input);

			return partyService.show(input, ctx.user);
		}),
	}),
});
