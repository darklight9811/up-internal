import { env } from "@repo/domains/app";

import { useMessages } from "../lib/localization";
import { Structure } from "../lib/structure";

export function PasswordResetEmail({
	url,
	locale,
}: {
	url: string;
	locale: "pt-br" | "en-us";
}) {
	const t = useMessages(locale, "reset");

	return (
		<Structure
			title={t("title")}
			locale={locale}
			actions={[{ text: t("button"), url }]}
		>
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					{t("title")}
				</h1>
				<p className="text-gray-700 mb-6">{t("message")}</p>

				<div className="text-sm text-gray-600 space-y-2">
					<p>{t("expire")}</p>
				</div>
			</div>
		</Structure>
	);
}

export function sendPasswordResetEmail(props: {
	email: string;
	url: string;
	locale: "pt-br" | "en-us";
}) {
	const t = useMessages(props.locale, "reset");

	return {
		from: `Suporte <noreply@${env.domain}`,
		to: props.email,
		subject: t("title"),
		react: <PasswordResetEmail url={props.url} locale={props.locale} />,
	};
}
