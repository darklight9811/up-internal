import { useMutation } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Submit } from "@repo/ds/hooks/use-form";

import { trpc } from "@repo/domains";
import { metadata } from "@repo/domains/app";
import { CoreForm } from "@repo/domains/cores";
import { useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({ title: "Adicionar Núcleo" });

export default function CoreAddPage() {
	const current = useCurrentParty();
	const { mutateAsync: createCore } = useMutation(
		trpc.cores.store.mutationOptions({
			onSuccess(data) {
				if (data) {
					toast.success("Núcleo adicionado com sucesso!");
				}
			},
		}),
	);

	return (
		<main className="p-4 pt-0">
			<h1 className="text-3xl font-bold flex gap-2 items-center mb-4">
				<Link to="/cores">
					<ChevronLeftIcon />
				</Link>
				Adicionar núcleo
			</h1>

			<CoreForm onSubmit={createCore} data={{ partyId: current?.id }}>
				<Submit>Adicionar</Submit>
			</CoreForm>
		</main>
	);
}
