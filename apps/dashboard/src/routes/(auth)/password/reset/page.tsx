import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { serverLoader } from "src/utils/server-loader";

import { Submit } from "@repo/ds/hooks/use-form";
import { useSearch } from "@repo/ds/hooks/use-search";
import { useTranslation } from "@repo/ds/lib/localization";
import v from "@repo/ds/lib/v/index";

import { metadata } from "@repo/domains/app";
import { AuthResetPassword } from "@repo/domains/auth";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("auth");

	return {
		t: {
			title: t("resetPassword.title"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function ResetPasswordPage() {
	const { t } = useTranslation("auth");
	const navigate = useNavigate();
	const [{ token }] = useSearch(v.object({ token: v.string().optional() }));

	const { mutate: resetPassword, error } = useMutation(
		trpc.auth.resetPassword.mutationOptions({
			onSuccess: () => {
				toast(t("resetPassword.success"));
				navigate("/login");
			},
		}),
	);

	return (
		<main className="flex flex-col items-center justify-center min-h-screen p-6 gap-8">
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className="text-3xl font-bold">
					{t("resetPassword.title")}
				</h1>
				<p className="text-gray-300 max-w-md">
					{t("resetPassword.description")}
				</p>
			</div>

			<div className="w-full max-w-sm">
				<AuthResetPassword
					token={token}
					onSubmit={resetPassword}
					errors={error}
				>
					<Submit variant="primary">
						{t("resetPassword.submit")}
					</Submit>
				</AuthResetPassword>

				<div className="mt-6 text-center">
					<Link
						to="/login"
						className="text-sm text-blue-600 hover:text-blue-800"
					>
						{t("resetPassword.backToLogin")}
					</Link>
				</div>
			</div>
		</main>
	);
}
