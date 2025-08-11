import { Outlet, redirect } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { authService } from "@repo/domains/auth/server";

export const loader = serverLoader(async ({ cookies, pathname }) => {
	const user = await authService.session(cookies.get("token"));

	if (user && !user.isAnonymous && ["/register", "/login"].includes(pathname))
		return redirect("/");
});

export default function AuthLayout() {
	return (
		<div className="grow flex justify-center items-center w-full max-w-sm mx-auto">
			<Outlet />
		</div>
	);
}
