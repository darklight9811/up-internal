import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { redirect, useNavigate } from "react-router";
import { serverLoader } from "src/utils/server-loader";
import { z } from "zod/v4";

import { Submit } from "@repo/ds/hooks/use-form";
import { useSearch } from "@repo/ds/hooks/use-search";
import { useTranslation } from "@repo/ds/lib/localization";
import { toast } from "@repo/ds/ui/sonner";

import { metadata } from "@repo/domains/app";
import { AuthVerify } from "@repo/domains/auth";
import { authService } from "@repo/domains/auth/server";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations, cookies }) => {
	const [t, session] = await Promise.all([getTranslations("auth"), authService.session(cookies.get("token"))]);

	if (!session || session.emailVerified) return redirect("/");

	return {
		t: {
			title: t("verify.title"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function VerifyPage() {
	const navigate = useNavigate();
	const [{ token }] = useSearch(z.object({ token: z.string().optional() }));
	const { t } = useTranslation("auth");

	const {
		mutateAsync: verifyEmail,
		error,
		isPending: isVerifying,
	} = useMutation(
		trpc.auth.verifyEmail.mutationOptions({
			onSuccess() {
				toast.success(t("verify.success"));
				navigate("/");
			},
		}),
	);

	const { mutateAsync: resendVerification, isPending: isResending } = useMutation(
		trpc.auth.sendVerificationEmail.mutationOptions({
			onSuccess() {
				toast.success(t("verify.resent"));
			},
		}),
	);

	useEffect(() => {
		if (token) verifyEmail({ token });
	}, [token, verifyEmail]);

	return (
		<main className="flex flex-col items-center gap-4 text-center">
			<h2 className="text-xl font-semibold">{t("verify.title")}</h2>
			<p className="text-sm text-muted-foreground mb-4">{t("verify.description")}</p>

			<AuthVerify
				token={token}
				onSubmit={verifyEmail}
				onResend={resendVerification}
				errors={error}
				isResending={isResending}
			>
				<Submit variant="primary" disabled={isVerifying}>
					{t("verify.submit")}
				</Submit>
			</AuthVerify>
		</main>
	);
}
