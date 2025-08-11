import { t } from "../../../utils/trpc";
import { userFormSchema } from "../schema";
import { userService } from "./service.server";

export const userRouter = t.router({
	update: t.protected
		.input(userFormSchema)
		.mutation(({ ctx, input }) =>
			userService.update(ctx.user.id, input, ctx.user),
		),
});
