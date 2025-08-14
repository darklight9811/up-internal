import { useQuery } from "@tanstack/react-query";
import { Building2Icon, CogIcon, HouseIcon } from "lucide-react";
import { Link, Outlet, redirect } from "react-router";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ds/ui/sidebar";

import { trpc } from "@repo/domains";
import { metadata } from "@repo/domains/app";
import { authService } from "@repo/domains/auth/server";
import { ContextSwitcher } from "@repo/domains/cores";

import { serverLoader } from "src/utils/server-loader";

export const loader = serverLoader(async ({ cookies }) => {
	const user = await authService.session(cookies.get("token"));

	if (!user) return redirect("/login");
});

export const meta = metadata({});

export default function AppLayout() {
	const { data: current } = useQuery(trpc.parties.current.get.queryOptions());

	return (
		<div>
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>
						<ContextSwitcher />
					</SidebarHeader>

					<SidebarContent>
						{current && (
							<SidebarGroup>
								<SidebarGroupLabel>Partido</SidebarGroupLabel>

								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem className="group/collapsible">
											<SidebarMenuButton asChild>
												<Link to="/">
													<HouseIcon /> Home
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem className="group/collapsible">
											<SidebarMenuButton asChild>
												<Link to="/cores">
													<Building2Icon /> Núcleos
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem className="group/collapsible">
											<SidebarMenuButton asChild>
												<Link to="/settings">
													<CogIcon /> Configurações
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						)}
					</SidebarContent>
				</Sidebar>

				<div className="flex flex-col w-full grow">
					<nav className="p-3 w-full">
						<SidebarTrigger />
					</nav>

					<Outlet />
				</div>
			</SidebarProvider>
		</div>
	);
}
