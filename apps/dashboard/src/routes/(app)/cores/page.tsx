import { useQuery } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { Link } from "react-router";

import { useSearch } from "@repo/ds/hooks/use-search";
import { buttonVariants } from "@repo/ds/ui/button";
import { Pagination } from "@repo/ds/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ds/ui/table";

import { trpc } from "@repo/domains";
import { metadata, paginationSchema } from "@repo/domains/app";
import { permissions, useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({ title: "Núcleos" });

export default function CoresListPage() {
	const [pagination] = useSearch(paginationSchema);
	const current = useCurrentParty();
	const { data: list } = useQuery(trpc.cores.index.queryOptions({ ...pagination, partyId: current?.id }));

	return (
		<main className="p-4 pt-0 w-full grow">
			<h1 className="text-3xl font-bold flex">
				Núcleos
				{permissions.can(permissions.canManage, current?.member.role) && (
					<Link to="/cores/add" className={buttonVariants({ className: "ml-auto" })}>
						Adicionar
					</Link>
				)}
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
								{permissions.can(permissions.canManage, current?.member.role) && (
									<Link to={`/cores/${core.id}/edit`} className={buttonVariants({ size: "icon" })}>
										<EditIcon />
									</Link>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Pagination {...list?.[1]} />
		</main>
	);
}
