import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { serverLoader } from "src/utils/server-loader";

import { Submit } from "@repo/ds/hooks/use-form";
import { Trans, useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "@repo/domains/app";
import { AuthRegister } from "@repo/domains/auth";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("auth");

	return {
		t: {
			title: t("register"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function RegisterPage() {
	const navigate = useNavigate();
	const { t } = useTranslation("auth");
	const { mutateAsync: register, error } = useMutation(
		trpc.auth.register.mutationOptions({
			onSuccess(data) {
				if (data) {
					navigate("/");
					toast(t("register-success"));
				}
			},
		}),
	);

	return (
		<AuthRegister onSubmit={register} errors={error}>
			<Submit>{t("register")}</Submit>

			<p>
				<Trans i18nKey="register-already">
					Tem uma conta? Entre <Link to="/login">aqui</Link>
				</Trans>
			</p>
		</AuthRegister>
	);
}
