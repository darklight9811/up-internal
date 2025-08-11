import { Computed, Memo, use$ } from "@legendapp/state/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { OilIcon } from "@repo/ds/icons/oil-icon";
import { ScrapIcon } from "@repo/ds/icons/scrap-icon";
import { useTranslation } from "@repo/ds/lib/localization";
import { Button, buttonVariants } from "@repo/ds/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@repo/ds/ui/drawer";
import { ScrollArea } from "@repo/ds/ui/scroll-area";

import { metadata } from "@repo/domains/app";
import { RunCanvas, runGamemode$ } from "@repo/domains/runs";
import { UpgradeOptionsList, upgrades$ } from "@repo/domains/upgrades";

import { trpc } from "@repo/domains";

export const meta = metadata({});

export default function Home() {
	const { t } = useTranslation(["general", "upgrades"]);
	const gameState = use$(runGamemode$.state.gameState);
	const { data: lastScore } = useQuery(trpc.highscore.current.queryOptions());

	if (gameState === "over") {
		return (
			<>
				<div className="fixed top-0 left-0 w-full h-full">
					<RunCanvas />
				</div>
				<div className="fixed w-full h-full top-0 left-0">
					<div className="fixed w-full h-full top-0 left-0 flex flex-col gap-2 items-center justify-center p-8 bg-black/50">
						<img alt="" src="/textures/icons/no_fuel.svg" />
						<h1 className="text-white text-center text-3xl w-full">
							{t("gameover")}
						</h1>

						<h3 className="text-white text-center text-2xl flex gap-2 justify-center items-center">
							<ScrapIcon />
							<span>x</span>
							<Memo children={() => runGamemode$.state.gold} />
						</h3>
						<Computed
							children={() =>
								(lastScore?.value || 0) <
									runGamemode$.state.gold.get() && (
									<h4 className="text-white animate-pulse">
										Novo recorde!!
									</h4>
								)
							}
						/>
						<Button
							size="lg"
							className="w-full max-w-sm mx-auto"
							onClick={() => runGamemode$.start()}
						>
							{t("restart")}
						</Button>
						<Link
							to="highscore"
							className={buttonVariants({
								className: "w-full max-w-sm mx-auto",
							})}
						>
							{t("highscore")}
						</Link>
						<Button
							size="lg"
							className="w-full max-w-sm mx-auto"
							onClick={() =>
								runGamemode$.state.gameState.set("idle")
							}
						>
							{t("back")}
						</Button>
					</div>
				</div>
			</>
		);
	}

	if (gameState === "playing") {
		return (
			<>
				<div className="fixed top-0 left-0 w-full h-full">
					<RunCanvas />
				</div>
				<Computed
					children={() => {
						const oilPercentage =
							(runGamemode$.state.oil.get() /
								(upgrades$.options.get()["fuel-tank"]?.value ||
									100)) *
							100;

						return (
							<>
								<div className="z-10 p-2 pointer-events-none absolute w-full bottom-2 flex flex-col justify-center items-center gap-4">
									{runGamemode$.state.previousPickups.get()
										.length > 0 &&
										runGamemode$.state.previousPickups
											.get()
											.slice(-3)
											.reverse()
											.map(([date, pickup]) => (
												<div
													className="flex text-white font-bold items-center gap-2 animate-ghost-out -mt-12"
													key={date}
												>
													+ {pickup}
												</div>
											))}

									<div className="flex text-white font-bold items-center gap-2">
										<ScrapIcon className="text-transparent size-4" />{" "}
										x {runGamemode$.state.gold.get() || 0}
									</div>

									<div className="size-16 bg-radial from-white to-gray-400 rounded-full overflow-hidden relative flex flex-col justify-end">
										{oilPercentage < 20 && (
											<OilIcon className="size-8 absolute -translate-1/2 top-1/2 left-1/2 **:fill-red-500 **:stroke-0 animate-ping" />
										)}

										<div
											className="bg-radial from-[#121212] to-black transition-[height] duration-500 ease-in-out"
											style={{
												height: `${oilPercentage}%`,
											}}
										/>
									</div>
								</div>
								<div>
									<div
										className="fixed bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-[rgba(255,0,0,0.5)] to-[rgba(255,0,0,0)] transition-opacity pointer-events-none"
										style={{
											opacity: oilPercentage < 20 ? 1 : 0,
										}}
									/>
								</div>
							</>
						);
					}}
				/>
			</>
		);
	}

	return (
		<div className="fixed top-0 left-0 w-full h-full">
			<RunCanvas />

			<Drawer modal={false} shouldScaleBackground={false}>
				<DrawerTrigger asChild>
					<Button className="fixed bottom-[50px] left-2 rounded-b-none">
						{t("upgrades:title")}
					</Button>
				</DrawerTrigger>

				<DrawerContent className="z-1">
					<DrawerHeader>
						<DrawerTitle>{t("upgrades:title")}</DrawerTitle>
						<DrawerDescription>
							{t("upgrades:description")}
						</DrawerDescription>
					</DrawerHeader>

					<ScrollArea className="h-[60vh]">
						<UpgradeOptionsList />

						<div className="w-full h-[10vh]" />
					</ScrollArea>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
