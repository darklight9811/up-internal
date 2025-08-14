import { useQuery } from "@tanstack/react-query";

import { trpc } from "@repo/domains";
import { metadata } from "@repo/domains/app";
import { useSession } from "@repo/domains/auth";

export const meta = metadata({});

export default function HomePage() {
	const user = useSession();
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());

	if (!current) {
		return (
			<div className="grow flex flex-col justify-center items-center">
				<h1>No Active Party</h1>
				<p>Please select a party to continue.</p>
			</div>
		);
	}

	return (
		<div className="p-4 pt-0">
			<h1 className="text-3xl font-bold">{current?.name}</h1>
			<h2>Bem-vindo de volta, {user?.name}</h2>
		</div>
	);
}
