import { Outlet, redirect } from "react-router";

import { authService } from "@repo/domains/auth/server";

import { serverLoader } from "src/utils/server-loader";

export const loader = serverLoader(async ({ cookies, pathname }) => {
	const user = await authService.session(cookies.get("token"));

	if (user && ["/register", "/login"].includes(pathname)) return redirect("/");
});

export default function AuthLayout() {
	return (
		<div className="grow flex flex-col justify-center items-center w-full max-w-sm mx-auto">
			<Outlet />
		</div>
	);
}
