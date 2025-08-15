import { metadata } from "@repo/domains/app";
import { useSession } from "@repo/domains/auth";
import { useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({});

export default function HomePage() {
	const user = useSession();
	const current = useCurrentParty();

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
