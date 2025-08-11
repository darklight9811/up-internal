import { serverLoader } from "src/utils/server-loader";

import { useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "@repo/domains/app";
import { HighscoreList } from "@repo/domains/highscore";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations();

	return { t: { title: t("highscore") } };
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function HighscorePage() {
	const { t } = useTranslation();

	return (
		<div className="p-4 bg-pattern grow z-1">
			<h1 className="text-2xl font-bold mb-4 mt-10">{t("highscore")}</h1>

			<HighscoreList />
		</div>
	);
}
