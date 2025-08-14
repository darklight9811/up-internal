import { CogIcon, HouseIcon } from "lucide-react";
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
	return (
		<div>
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>
						<ContextSwitcher />
					</SidebarHeader>

					<SidebarContent>
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
											<Link to="/settings">
												<CogIcon /> Configurações
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>

				<nav>
					<SidebarTrigger>hi</SidebarTrigger>
				</nav>

				<Outlet />
			</SidebarProvider>
		</div>
	);
}
