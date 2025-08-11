import { useEffect } from "react";
import { useNavigate } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "../../../../packages/domains/src/domains/app/helpers/metadata";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("offline");

	return {
		t: {
			title: t("title"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function OfflinePage() {
	const { t } = useTranslation("offline");

	const navigate = useNavigate();

	useEffect(() => {
		if (navigator.onLine) {
			navigate("/", { replace: true });
		}
	}, [navigate]);

	return (
		<main className="grow flex flex-col items-center justify-center p-4">
			<img
				src="/logo.png"
				alt="Logo"
				className="max-w-sm w-full mx-auto"
			/>

			<h1 className="text-center font-bold text-3xl mb-8">
				{t("title")}
			</h1>

			<p className="text-center">{t("description")}</p>
		</main>
	);
}
