import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import { Submit } from "@repo/ds/hooks/use-form";

import { trpc } from "@repo/domains";
import { metadata, queryClient } from "@repo/domains/app";
import { CoreForm } from "@repo/domains/cores";

export const meta = metadata({ title: "Editar Núcleo" });

export default function CoreEditPage() {
	const { id } = useParams<{ id: string }>();
	const { data: core } = useQuery(trpc.cores.show.queryOptions(id!));
	const { mutateAsync: updateCore } = useMutation(
		trpc.cores.update.mutationOptions({
			onSuccess(data) {
				if (data) {
					toast.success("Núcleo editado com sucesso!");

					queryClient.invalidateQueries(trpc.cores.pathFilter());
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
				Editar núcleo
			</h1>

			<CoreForm onSubmit={(data) => updateCore({ id: id!, data })} data={core}>
				<Submit>Atualizar</Submit>
			</CoreForm>
		</main>
	);
}
