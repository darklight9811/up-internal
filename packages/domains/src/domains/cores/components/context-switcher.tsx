import { useMutation, useQuery } from "@tanstack/react-query";
import { BuildingIcon, ChevronsUpDownIcon } from "lucide-react";

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

export function ContextSwitcher() {
	const isMobile = useIsMobile();

	const { data: parties } = useQuery(trpc.parties.index.queryOptions());
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());

	const { mutateAsync: setActiveParty } = useMutation(
		trpc.parties.current.set.mutationOptions({
			onSuccess() {
				queryClient.invalidateQueries(trpc.parties.current.get.queryFilter());
			},
		}),
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<BuildingIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{current?.name}</span>
								<span className="truncate text-xs">{current?.description}</span>
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
						<DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
						{parties?.[0].map((party) => (
							<DropdownMenuItem
								key={party.slug}
								onClick={() => setActiveParty(party.id)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-md border">
									<BuildingIcon className="size-3.5 shrink-0" />
								</div>
								{party.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
