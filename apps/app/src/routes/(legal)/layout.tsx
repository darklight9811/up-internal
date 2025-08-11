import { Outlet } from "react-router";

import { env } from "@repo/domains/app";

export default function LegalLayout() {
	return (
		<div className="grow flex flex-col gap-2 justify-center items-center">
			<img
				className="w-full max-w-[150px]"
				src={
					env.type === "dev"
						? "/icon-dev.png"
						: env.app_url.includes("localhost")
							? "/icon-local.png"
							: "/icon.png"
				}
				alt="logo"
			/>

			<div className="text-justify px-4 mb-8">
				<Outlet />
			</div>
		</div>
	);
}
