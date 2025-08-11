import { Text } from "@react-email/components";

import { useMessages } from "../lib/localization";
import { Structure } from "../lib/structure";

export function EmailRegister({
	email,
	locale = "pt-br",
}: {
	email?: string;
	locale?: "pt-br" | "en-us";
}) {
	const t = useMessages(locale, "email");

	return (
		<Structure
			title={t("title")}
			locale={locale}
			actions={[
				{
					text: t("action"),
					url: `${email ? `mailto:${email}` : "#"}`,
				},
			]}
		>
			<Text className="text-center">{t("description")}</Text>
		</Structure>
	);
}

export default EmailRegister;
