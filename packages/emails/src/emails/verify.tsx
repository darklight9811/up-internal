import { Text } from "@react-email/components";

import { useMessages } from "../lib/localization";
import { Structure } from "../lib/structure";

export function Verify({
	url,
	locale = "pt-br",
}: {
	url: string;
	locale?: "pt-br" | "en-us";
}) {
	const t = useMessages(locale, "verify");

	return (
		<Structure
			title={t("title")}
			locale={locale}
			actions={[
				{
					text: t("action"),
					url,
				},
			]}
		>
			<Text className="text-center">{t("description")}</Text>
		</Structure>
	);
}

export function sendVerifyEmail({
	email,
	url,
	locale = "pt-br",
}: {
	email: string;
	url: string;
	locale?: "pt-br" | "en-us";
}) {
	const t = useMessages(locale, "email");

	return {
		from: "Suporte <noreply@up.com.br>",
		to: email,
		subject: t("title"),
		react: <Verify url={url} locale={locale} />,
	};
}

export default Verify;
