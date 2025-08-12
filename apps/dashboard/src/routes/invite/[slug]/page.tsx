import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { trpc } from "@repo/domains";
import { metadata } from "@repo/domains/app";
import { InviteForm } from "@repo/domains/parties";

export const meta = metadata();

export default function InvitePage() {
	const { slug } = useParams<{ slug: string }>();

	const { data: party } = useQuery(trpc.parties.show.queryOptions(slug!));

	if (!party) return null;

	return (
		<div className="grow flex flex-col justify-center items-center gap-4">
			{party.logo && <img src={party.logo} alt={party.name} className="max-w-sm w-full" />}

			<h1>Deseja solicitar entrada para o partido {party.name}?</h1>

			<InviteForm id={party.id} />
		</div>
	);
}
