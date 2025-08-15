import { z } from "zod/v4";

import { t } from "../../../utils/trpc";
import { paginationSchema } from "../../app";
import { partyFormSchema, partyMemberFormSchema } from "../schema";
import { partiesService } from "./service.server";

export const partiesRouter = t.router({
	/**
	 * Get a list of parties
	 */
	index: t.protected.input(paginationSchema).query(({ ctx, input }) => partiesService.index(input, ctx.user)),

	/**
	 * Create a new party
	 */
	store: t.protected.input(partyFormSchema).mutation(({ ctx, input }) => partiesService.store(input, ctx.user)),

	/**
	 * Get a specific party
	 */
	show: t.route.input(z.string()).query(({ input }) => partiesService.show(input)),

	/**
	 * Update a specific party
	 */
	update: t.protected
		.input(z.object({ id: z.string(), data: partyFormSchema }))
		.mutation(({ ctx, input }) => partiesService.update(input.id, input.data, ctx.user)),

	/**
	 * Delete a specific party
	 */
	delete: t.protected.input(z.string()).mutation(({ ctx, input }) => partiesService.delete(input, ctx.user)),

	members: t.router({
		/**
		 * Get a list of party members
		 */
		index: t.protected
			.input(paginationSchema.and(z.object({ partyId: z.string() })))
			.query(({ ctx, input }) => partiesService.members.index(input.partyId, input, ctx.user)),

		/**
		 * Request to join a party
		 */
		request: t.protected
			.input(z.string())
			.mutation(({ ctx, input }) => partiesService.members.request(input, ctx.user)),

		/**
		 * Add a new party member
		 */
		add: t.protected
			.input(partyMemberFormSchema)
			.mutation(({ ctx, input }) => partiesService.members.add(input.partyId, input, ctx.user)),

		/**
		 * Update a party member
		 */
		update: t.protected
			.input(partyMemberFormSchema.and(z.object({ id: z.string(), data: partyMemberFormSchema })))
			.mutation(({ ctx, input }) =>
				partiesService.members.update(input.data.partyId, input.id, input.data, ctx.user),
			),

		/**
		 * Remove a party member
		 */
		remove: t.protected
			.input(z.object({ partyId: z.string(), memberId: z.string() }))
			.mutation(({ ctx, input }) => partiesService.members.remove(input.partyId, input.memberId, ctx.user)),
	}),

	current: t.router({
		get: t.protected.query(async ({ ctx }) => {
			const partyId = ctx.cookie.get("partyId");
			const coreId = ctx.cookie.get("coreId");

			if (!partyId) return null;

			const [party] = await Promise.all([partiesService.show(partyId, ctx.user)]);

			if (!party) return null;

			return {
				...party,
				cores: party.cores.map((core) => ({ ...core, selected: core.id === coreId })),
			};
		}),

		set: t.protected.input(z.string()).mutation(({ ctx, input }) => {
			ctx.cookie.set("partyId", input);
			ctx.cookie.remove("coreId");

			return partiesService.show(input);
		}),
	}),
});
