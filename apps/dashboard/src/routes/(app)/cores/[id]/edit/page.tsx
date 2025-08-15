import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Submit } from "@repo/ds/hooks/use-form";
import { Button } from "@repo/ds/ui/button";

import { trpc } from "@repo/domains";
import { DeleteDialog, metadata, queryClient } from "@repo/domains/app";
import { CoreForm } from "@repo/domains/cores";

export const meta = metadata({ title: "Editar Núcleo" });

export default function CoreEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [shouldDelete, setShouldDelete] = useState(false);

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
	const { mutateAsync: deleteCore, isPending: isDeleting } = useMutation(
		trpc.cores.delete.mutationOptions({
			onSuccess() {
				toast.success("Núcleo excluído com sucesso!");

				queryClient.invalidateQueries(trpc.cores.pathFilter());
				navigate("/cores");
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
				<div className="flex gap-2">
					<Submit>Atualizar</Submit>
					<Button disabled={isDeleting} variant="destructive" onClick={() => setShouldDelete(true)}>
						Apagar núcleo
					</Button>
				</div>
			</CoreForm>

			<DeleteDialog open={shouldDelete} onOpenChange={setShouldDelete} onDelete={() => deleteCore(id!)} />
		</main>
	);
}
