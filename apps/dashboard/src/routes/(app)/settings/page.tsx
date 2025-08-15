import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Submit } from "@repo/ds/hooks/use-form";

import { trpc } from "@repo/domains";
import { metadata, queryClient } from "@repo/domains/app";
import { PartyForm, useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({ title: "Configurações" });

export default function SettingsPage() {
	const current = useCurrentParty();

	const { mutateAsync: update } = useMutation(
		trpc.parties.update.mutationOptions({
			onSuccess(data) {
				if (data) {
					toast.success("Configurações atualizadas com sucesso!");

					queryClient.invalidateQueries(trpc.parties.current.get.queryFilter());
				}
			},
		}),
	);

	if (!current) return null;

	return (
		<main className="p-4 pt-0">
			<h1 className="text-3xl font-bold mb-4">Configurações</h1>

			<PartyForm data={current} onSubmit={(data) => update({ id: current.id, data })}>
				<Submit>Atualizar</Submit>
			</PartyForm>
		</main>
	);
}
