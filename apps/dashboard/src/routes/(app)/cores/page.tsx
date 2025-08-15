import { useMutation, useQuery } from "@tanstack/react-query";
import { EditIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { useSearch } from "@repo/ds/hooks/use-search";
import { Button, buttonVariants } from "@repo/ds/ui/button";
import { Pagination } from "@repo/ds/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ds/ui/table";

import { trpc } from "@repo/domains";
import { DeleteDialog, metadata, paginationSchema, queryClient } from "@repo/domains/app";
import { permissions, useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({ title: "Núcleos" });

export default function CoresListPage() {
	const [pagination] = useSearch(paginationSchema);
	const current = useCurrentParty();
	const { data: list, refetch } = useQuery(trpc.cores.index.queryOptions({ ...pagination, partyId: current?.id }));

	const [coreToDelete, setCoreToDelete] = useState<string | null>(null);
	const { mutateAsync: deleteCore } = useMutation(
		trpc.cores.delete.mutationOptions({
			onSuccess() {
				toast.success("Núcleo excluído com sucesso!");
				queryClient.invalidateQueries(trpc.cores.index.queryFilter({ ...pagination, partyId: current?.id }));
				setCoreToDelete(null);
			},
		}),
	);

	return (
		<main className="p-4 pt-0 w-full grow">
			<h1 className="text-3xl font-bold flex">
				Núcleos
				<div className="ml-auto flex gap-2">
					<Button size="icon" onClick={() => refetch()}>
						<RefreshCwIcon />
					</Button>
					{permissions.can(permissions.canManage, current?.member?.role) && (
						<Link to="/cores/add" className={buttonVariants()}>
							Adicionar
						</Link>
					)}
				</div>
			</h1>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Núcleo</TableHead>
						<TableHead className="w-0 text-center">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{list?.[0].map((core) => (
						<TableRow key={core.id}>
							<TableCell>{core.name}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									{permissions.can(permissions.canManage, current?.member?.role) && (
										<>
											<Link
												to={`/cores/${core.id}/edit`}
												className={buttonVariants({ size: "icon" })}
											>
												<EditIcon />
											</Link>
											<Button
												variant="destructive"
												size="icon"
												onClick={() => setCoreToDelete(core.id)}
											>
												<TrashIcon />
											</Button>
										</>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Pagination {...list?.[1]} />

			<DeleteDialog
				open={!!coreToDelete}
				onOpenChange={() => setCoreToDelete(null)}
				onDelete={() => {
					deleteCore(coreToDelete!);
				}}
			/>
		</main>
	);
}
