import { Outlet, redirect } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { authService } from "@repo/domains/auth/server";

export const loader = serverLoader(async ({ cookies, pathname }) => {
	const user = await authService.session(cookies.get("token"));

	if (
		user &&
		(["/anonymous"].includes(pathname) ||
			(!user.isAnonymous && ["/register", "/login"].includes(pathname)))
	)
		return redirect("/");
});

export default function AuthLayout() {
	return (
		<div className="grow flex flex-col justify-end items-center w-full mx-auto overflow-hidden relative">
			<div className="mx-[20%] w-full mb-[12%] max-w-sm">
				<img src="/logo.png" alt="logo" className="w-full" />
			</div>

			<div className="bg-secondary shadow-top text-white w-full p-8 border-t-2 border-white rounded-t-xl">
				<Outlet />
			</div>
		</div>
	);
}
