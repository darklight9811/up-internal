import { useQuery } from "@tanstack/react-query";
import { useRouteLoaderData } from "react-router";

import { type RouterOutputs, trpc } from "../..";

export function useCurrentParty() {
	const data = useRouteLoaderData<{ party: RouterOutputs["parties"]["current"]["get"] }>("root");
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());

	return ((current || data?.party) as RouterOutputs["parties"]["current"]["get"]) || null;
}
