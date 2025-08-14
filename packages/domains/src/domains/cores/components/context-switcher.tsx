import { useMutation, useQuery } from "@tanstack/react-query";
import { BuildingIcon, ChevronsUpDownIcon } from "lucide-react";
import { Link } from "react-router";

import { useIsMobile } from "@repo/ds/hooks/use-mobile";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@repo/ds/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ds/ui/sidebar";

import { trpc } from "../..";
import { queryClient } from "../../app";
import { useCurrentParty } from "../../parties";

export function ContextSwitcher() {
	const isMobile = useIsMobile();

	const { data: parties } = useQuery(trpc.parties.index.queryOptions());
	const current = useCurrentParty();

	const { mutateAsync: setActiveParty } = useMutation(
		trpc.parties.current.set.mutationOptions({
			onSuccess() {
				queryClient.invalidateQueries(trpc.parties.current.get.queryFilter());
			},
		}),
	);
	const { mutateAsync: setActiveCore } = useMutation(
		trpc.cores.current.set.mutationOptions({
			onSuccess() {
				Promise.all([
					queryClient.invalidateQueries(trpc.parties.current.get.queryFilter()),
					queryClient.invalidateQueries(trpc.cores.current.get.queryFilter()),
				]);
			},
		}),
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<BuildingIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{current?.name}</span>
								{(current?.cores as { selected?: boolean }[])?.at(0)?.selected && (
									<span className="truncate text-xs">{current?.cores.at(0)?.name}</span>
								)}
							</div>
							<ChevronsUpDownIcon className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs w-full flex justify-between">
							Partidos
							<Link to="/parties">Ver todos</Link>
						</DropdownMenuLabel>
						{parties?.[0].map((party) => (
							<button
								type="button"
								key={party.slug}
								onClick={(e) => {
									e.stopPropagation();
									setActiveParty(party.id);
								}}
								className="flex items-center px-2 py-1.5 text-sm relative text-start gap-2 p-2 hover:cursor-pointer"
							>
								<div className="flex size-6 items-center justify-center rounded-md border">
									<BuildingIcon className="size-3.5 shrink-0" />
								</div>
								{party.name}
							</button>
						))}
						{current && (
							<>
								<DropdownMenuLabel className="text-muted-foreground text-xs w-full flex justify-between">
									Núcleos
									{current.cores?.length !== 0 && <Link to="/cores">Ver todos</Link>}
								</DropdownMenuLabel>
								{current.cores?.map((core) => (
									<DropdownMenuItem
										key={core.id}
										onClick={(e) => {
											e.stopPropagation();
											setActiveCore(core.id);
										}}
										className="gap-2 p-2 hover:cursor-pointer"
									>
										<div className="flex size-6 items-center justify-center rounded-md border">
											<BuildingIcon className="size-3.5 shrink-0" />
										</div>
										{core.name}
									</DropdownMenuItem>
								))}
								{current.cores?.length === 0 && (
									<DropdownMenuItem disabled className="cursor-default">
										Não há núcleos disponíveis
									</DropdownMenuItem>
								)}
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
