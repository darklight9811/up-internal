import { Outlet, redirect } from "react-router";

import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@repo/ds/ui/sidebar";

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

					<SidebarContent></SidebarContent>
				</Sidebar>
				<Outlet />
			</SidebarProvider>
		</div>
	);
}
