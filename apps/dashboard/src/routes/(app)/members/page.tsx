import { useQuery } from "@tanstack/react-query";
import { EditIcon, EyeIcon } from "lucide-react";
import { Link } from "react-router";

import { useSearch } from "@repo/ds/hooks/use-search";
import { buttonVariants } from "@repo/ds/ui/button";
import { Pagination } from "@repo/ds/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ds/ui/table";

import { trpc } from "@repo/domains";
import { metadata, paginationSchema } from "@repo/domains/app";
import { permissions, useCurrentParty } from "@repo/domains/parties";

export const meta = metadata({ title: "Membros" });

export default function MembersListPage() {
	const [pagination] = useSearch(paginationSchema);
	const current = useCurrentParty();
	const { data: list } = useQuery(trpc.parties.members.index.queryOptions({ ...pagination, partyId: current?.id }));

	return (
		<main className="p-4 pt-0 w-full grow">
			<h1 className="text-3xl font-bold flex">
				Membros
				{permissions.can(permissions.canManage, current?.member?.role) && (
					<Link to="/members/add" className={buttonVariants({ className: "ml-auto" })}>
						Adicionar
					</Link>
				)}
			</h1>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Membro</TableHead>
						<TableHead>Email</TableHead>
						<TableHead className="text-center">Permissões</TableHead>
						<TableHead className="w-0 text-center">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{list?.[0].map((member) => (
						<TableRow key={member.id}>
							<TableCell>{member.user.name}</TableCell>
							<TableCell>{member.user.email}</TableCell>
							<TableCell>
								<div className="flex gap-2 justify-center items-center">
									<EyeIcon
										className={
											!permissions.can(permissions.canView, member.role)
												? "opacity-50"
												: undefined
										}
									/>
									<EditIcon
										className={
											!permissions.can(permissions.canManage, member.role)
												? "opacity-50"
												: undefined
										}
									/>
								</div>
							</TableCell>
							<TableCell>
								{permissions.can(permissions.canManage, current?.member.role) && (
									<Link
										to={`/members/${member.id}/edit`}
										className={buttonVariants({ size: "icon" })}
									>
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
