import { z } from "zod/v4";

import { t } from "../../../utils/trpc";
import { paginationSchema } from "../../app";
import { coreFormSchema, coreMemberFormSchema, corePaginationSchema } from "../schema";
import { coresService } from "./service.server";

export const coresRouter = t.router({
	/**
	 * Get a list of cores
	 */
	index: t.protected
		.input(corePaginationSchema)
		.query(({ ctx, input }) => coresService.index(input.partyId, input, ctx.user)),

	/**
	 * Create a new core
	 */
	store: t.protected.input(coreFormSchema).mutation(({ ctx, input }) => coresService.store(input, ctx.user)),

	/**
	 * Get a specific core
	 */
	show: t.route.input(z.string()).query(({ input }) => coresService.show(input)),

	/**
	 * Update a specific core
	 */
	update: t.protected
		.input(z.object({ id: z.string(), data: coreFormSchema }))
		.mutation(({ ctx, input }) => coresService.update(input.id, input.data, ctx.user)),

	/**
	 * Delete a specific core
	 */
	delete: t.protected.input(z.string()).mutation(({ ctx, input }) => coresService.delete(input, ctx.user)),

	members: t.router({
		/**
		 * Get a list of core members
		 */
		index: t.protected
			.input(paginationSchema.and(z.object({ core: z.string() })))
			.query(({ ctx, input }) => coresService.members.index(input.core, input, ctx.user)),

		/**
		 * Request to join a core
		 */
		request: t.protected
			.input(z.string())
			.mutation(({ ctx, input }) => coresService.members.request(input, ctx.user)),

		/**
		 * Add a new core member
		 */
		add: t.protected
			.input(coreMemberFormSchema)
			.mutation(({ ctx, input }) => coresService.members.add(input.coreId, input, ctx.user)),

		/**
		 * Remove a core member
		 */
		remove: t.protected
			.input(z.object({ coreId: z.string(), memberId: z.string() }))
			.mutation(({ ctx, input }) => coresService.members.remove(input.coreId, input.memberId, ctx.user)),
	}),

	current: t.router({
		get: t.protected.query(({ ctx }) => {
			const id = ctx.cookie.get("coreId");

			if (!id) return null;

			return coresService.show(id);
		}),

		set: t.protected.input(z.string()).mutation(({ ctx, input }) => {
			ctx.cookie.set("coreId", input);

			return coresService.show(input);
		}),
	}),
});
