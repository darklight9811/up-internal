import { Computed, use$ } from "@legendapp/state/react";
import { useQuery } from "@tanstack/react-query";
import {
	PackageIcon,
	PlayIcon,
	StoreIcon,
	TrainIcon,
	TrophyIcon,
	UsersIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, redirect, useLocation, useNavigate } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { ScrapIcon } from "@repo/ds/icons/scrap-icon";
import { TicketIcon } from "@repo/ds/icons/ticket-icon";
import { formatNumber } from "@repo/ds/lib/math";
import { Button, buttonVariants } from "@repo/ds/ui/button";

import { app$, PauseDialog } from "@repo/domains/app";
import { authService } from "@repo/domains/auth/server";
import { runGamemode$ } from "@repo/domains/runs";
import { CollectTutorial } from "@repo/domains/tutorial";
import { upgrades$ } from "@repo/domains/upgrades";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ cookies, pathname }) => {
	const user = await authService.session(cookies.get("token"));

	if (!user && !["/login", "/register", "/anonymous"].includes(pathname))
		return redirect("/anonymous");

	return { user };
});

export default function Layout() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { data: resources } = useQuery(trpc.resources.index.queryOptions());
	use$(upgrades$.options);

	useEffect(() => {
		// make sure the game only runs when in the actual game playable screen
		if (
			pathname !== "/" &&
			runGamemode$.state.gameState.peek() !== "idle"
		) {
			runGamemode$.idle();
		}
	}, [pathname]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				app$.audio.pause("ambience");
			} else {
				app$.audio.loop("ambience");
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		app$.audio.loop("ambience");

		document?.addEventListener(
			"click",
			() => {
				// Defer the execution of app$.audio.loop("ambience") to the next microtask
				// to ensure it does not conflict with other synchronous operations.
				queueMicrotask(() => app$.audio.loop("ambience"));
			},
			{
				once: true,
			},
		);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
			app$.audio.stop("ambience");
		};
	}, []);

	return (
		<>
			<Computed
				children={() =>
					!["playing"].includes(
						runGamemode$.state.gameState.get(),
					) && (
						<div className="fixed top-2 left-2 z-10">
							<div className="shadow-depth border-2 bg-g-2 h-9 px-2 rounded-lg text-white flex items-center gap-4">
								<div className="flex gap-2">
									<ScrapIcon />{" "}
									{formatNumber(
										resources?.find(
											(t) => t.type === "gold",
										)?.storage.currentQuantity || 0,
									)}
								</div>
								<div className="flex gap-2">
									<TicketIcon className="text-red-500" />{" "}
									{formatNumber(
										resources?.find(
											(t) => t.type === "ticket",
										)?.storage.currentQuantity || 0,
									)}
								</div>
							</div>
						</div>
					)
				}
			/>

			<div className="fixed top-2 right-2 z-10">
				<PauseDialog />
			</div>

			<Outlet />

			<Computed
				children={() =>
					!["playing", "paused", "over"].includes(
						runGamemode$.state.gameState.get(),
					) && (
						<nav className="fixed bottom-0 left-0 right-0 z-20 w-full bg-[#301e1c] border-2 shadow-depth">
							<Button
								size="play"
								variant="primary"
								className="absolute left-1/2 -translate-1/2 z-21"
								onClick={() =>
									pathname === "/"
										? runGamemode$.start()
										: navigate("/")
								}
							>
								{pathname === "/" ? (
									<PlayIcon />
								) : (
									<TrainIcon />
								)}
							</Button>

							<div className="mx-auto w-full max-w-sm flex justify-center *:grow *:border-y-0">
								<Link
									to="/"
									className={buttonVariants({
										size: "nav",
										disabled: true,
									})}
								>
									<UsersIcon />
								</Link>
								<Link
									to="/store"
									className={buttonVariants({
										size: "nav",
										className: "pr-6",
									})}
								>
									<StoreIcon />
								</Link>
								<Link
									to="/highscore"
									className={buttonVariants({
										size: "nav",
										className: "pl-6",
									})}
								>
									<TrophyIcon />
								</Link>
								<Link
									to="/inventory"
									className={buttonVariants({
										size: "nav",
										className: "border-r-2",
									})}
								>
									<PackageIcon />
								</Link>
							</div>
						</nav>
					)
				}
			/>

			<CollectTutorial />
		</>
	);
}
