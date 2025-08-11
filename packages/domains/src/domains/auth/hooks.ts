import { useQuery } from "@tanstack/react-query";
import { useRouteLoaderData } from "react-router";

import { trpc } from "..";
import type { UserSchema } from "../users/schema";

export function useSession() {
	const loaderData = useRouteLoaderData<{ user: UserSchema }>("root");
	const { data: user } = useQuery(trpc.auth.session.queryOptions());

	return loaderData?.user || user!;
}
