import { useQuery } from "@tanstack/react-query";

import { trpc } from "@repo/domains";

export default function HomePage() {
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());

	if (!current) {
		return (
			<div className="grow flex flex-col justify-center items-center">
				<h1>No Active Party</h1>
				<p>Please select a party to continue.</p>
			</div>
		);
	}

	return "hi";
}
