import { t } from "./utils/trpc";

export { createTRPCContext } from "./utils/trpc";

import { authRouter } from "./domains/auth/server/router.server";
import { userRouter } from "./domains/users/server/router.server";

export const appRouter = t.router({
	auth: authRouter,
	users: userRouter,
});

export type AppRouter = typeof appRouter;
