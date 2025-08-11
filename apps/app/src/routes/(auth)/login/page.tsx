import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { Submit } from "@repo/ds/hooks/use-form";
import { Trans, useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "@repo/domains/app";
import { AuthLogin } from "@repo/domains/auth";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("auth");

	return {
		t: {
			title: t("login"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function LoginPage() {
	const navigate = useNavigate();
	const { t } = useTranslation("auth");
	const { mutateAsync: login } = useMutation(
		trpc.auth.login.mutationOptions({
			onSuccess(data) {
				if (data) navigate("/");
			},
		}),
	);

	return (
		<AuthLogin onSubmit={login}>
			<p>
				<Trans i18nKey="forgot-password">
					<Link to="/password/forgot">
						Não lembra qual é sua senha? aqui
					</Link>
				</Trans>
			</p>

			<Submit>{t("login")}</Submit>

			<p>
				<Trans i18nKey="register-already">
					Não tem uma conta? Crie <Link to="/register">aqui</Link>
				</Trans>
			</p>
		</AuthLogin>
	);
}
