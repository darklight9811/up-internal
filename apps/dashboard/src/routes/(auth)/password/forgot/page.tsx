import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import { toast } from "sonner";
import { serverLoader } from "src/utils/server-loader";

import { Submit } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "@repo/domains/app";
import { AuthForgotPassword } from "@repo/domains/auth";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("auth");

	return {
		t: {
			title: t("forgotPassword.title"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function ForgotPasswordPage() {
	const { t } = useTranslation("auth");

	const { mutate: forgotPassword, error } = useMutation(
		trpc.auth.forgotPassword.mutationOptions({
			onSuccess: () => {
				toast(t("forgotPassword.success"));
			},
		}),
	);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen p-6 gap-8">
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="text-3xl font-bold">
					{t("forgotPassword.title")}
				</h1>
				<p className="text-gray-300 max-w-md">
					{t("forgotPassword.description")}
				</p>
			</div>

			<div className="w-full max-w-sm">
				<AuthForgotPassword onSubmit={forgotPassword} errors={error}>
					<Submit variant="primary">
						{t("forgotPassword.submit")}
					</Submit>
				</AuthForgotPassword>

				<div className="mt-6 text-center">
					<Link
						to="/login"
						className="text-sm text-blue-600 hover:text-blue-800"
					>
						{t("forgotPassword.backToLogin")}
					</Link>
				</div>
			</div>
		</main>
	);
}
