import { useMutation } from "@tanstack/react-query";
import { PauseIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Submit } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { Button, buttonVariants } from "@repo/ds/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ds/ui/dialog";

import { trpc } from "../..";
import { useSession } from "../../auth";
import { runGamemode$ } from "../../runs/client";
import { UserForm } from "../../users";
import { env } from "../env";
import { queryClient } from "../helpers/query";
import { AudioController } from "./audio-controller";

export function PauseDialog() {
	const user = useSession();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [modalId, setModalId] = useState<string | null>(null);

	const { mutateAsync: updateUser } = useMutation(
		trpc.users.update.mutationOptions({
			onSuccess(data) {
				if (data) {
					toast(t("userUpdate.success"));
					queryClient.refetchQueries(trpc.auth.session.queryFilter());
					setModalId(null);
				}
			},
		}),
	);
	const { mutateAsync: logout } = useMutation(
		trpc.auth.logout.mutationOptions({
			onSuccess() {
				navigate("/register");
			},
		}),
	);

	return (
		<>
			<Dialog
				onOpenChange={(value) => {
					if (
						["playing", "paused"].includes(
							runGamemode$.state.gameState.peek(),
						)
					)
						runGamemode$[value ? "pause" : "resume"]();

					setModalId(value ? "pause" : null);
				}}
				open={modalId === "pause"}
			>
				<DialogTrigger asChild>
					<Button size="icon" className="relative">
						<PauseIcon />

						{env.app_url.includes("localhost") ? (
							<span className="absolute top-2/3 right-0 text-xs bg-gradient-to-l from-blue-400 to-blue-600 text-white px-1 rounded">
								LOCAL
							</span>
						) : env.type === "dev" ? (
							<span className="absolute top-2/3 right-1/3 text-xs bg-gradient-to-l from-orange-400 to-yellow-600 text-white px-1 rounded">
								DEV
							</span>
						) : null}
					</Button>
				</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							<img
								alt=""
								src="/horizontal.png"
								className="w-full mx-auto max-w-[150px]"
							/>
						</DialogTitle>
						<DialogDescription>
							{t("logged")} {user.name}{" "}
							{env.app_url.includes("localhost") ? (
								<span className="text-xs bg-gradient-to-l from-blue-400 to-blue-600 text-white px-1 rounded">
									LOCAL
								</span>
							) : env.type === "dev" ? (
								<span className="text-xs bg-gradient-to-l from-orange-400 to-yellow-600 text-white px-1 rounded">
									DEV
								</span>
							) : null}
						</DialogDescription>
					</DialogHeader>

					<Link to="/feedback" className={buttonVariants()}>
						{t("feedback.title")}
					</Link>

					<AudioController />

					{user.isAnonymous ? (
						<>
							<Link to="/register" className={buttonVariants()}>
								{t("register")}
							</Link>
							<Link to="/login" className={buttonVariants()}>
								{t("login")}
							</Link>
						</>
					) : (
						<>
							<Button onClick={() => setModalId("update")}>
								{t("config")}
							</Button>
							<Button className="w-full" onClick={() => logout()}>
								{t("logout")}
							</Button>
						</>
					)}

					<p className="text-xs text-center">
						{t("version", { version: env.version })}
					</p>

					<a
						href="https://yamiassu.com.br"
						className="flex items-center gap-2 text-xs text-center mx-auto mt-8"
					>
						{t("createdBy")}
						<img
							alt="Yamiassu"
							src="https://yamiassu.com.br/logo.svg"
							className="w-32"
						/>
					</a>
				</DialogContent>
			</Dialog>

			<Dialog
				open={modalId === "update"}
				onOpenChange={(value) => setModalId(value ? "update" : null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("userUpdate.title")}</DialogTitle>
						<DialogDescription>
							{t("userUpdate.description")}
						</DialogDescription>
					</DialogHeader>

					<UserForm onSubmit={updateUser} data={user}>
						<DialogFooter>
							<Button onClick={() => setModalId("pause")}>
								{t("back")}
							</Button>
							<Submit variant="primary">{t("update")}</Submit>
						</DialogFooter>
					</UserForm>
				</DialogContent>
			</Dialog>
		</>
	);
}
