import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { useSearch } from "@repo/ds/hooks/use-search";
import { buttonVariants } from "@repo/ds/ui/button";
import { Pagination } from "@repo/ds/ui/pagination";
import { Table, TableHead, TableHeader, TableRow } from "@repo/ds/ui/table";

import { trpc } from "@repo/domains";
import { paginationSchema } from "@repo/domains/app";

export default function CoresListPage() {
	const [pagination] = useSearch(paginationSchema);
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());
	const { data: list } = useQuery(trpc.cores.index.queryOptions({ ...pagination, partyId: current?.id }));

	console.log(list);

	return (
		<main className="p-4 pt-0 w-full grow">
			<h1 className="text-3xl font-bold flex">
				Núcleos
				<Link to="/cores/add" className={buttonVariants({ className: "ml-auto" })}>
					Adicionar
				</Link>
			</h1>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Núcleo</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
			</Table>

			<Pagination {...list?.[1]} />
		</main>
	);
}
