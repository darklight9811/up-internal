import { useQuery } from "@tanstack/react-query";
import { serverLoader } from "src/utils/server-loader";

import { useTranslation } from "@repo/ds/lib/localization";
import { parseMarkdown } from "@repo/ds/lib/markdown";

import { metadata } from "@repo/domains/app";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations();

	return {
		t: {
			title: t("legal.privacy"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function PrivacyPolicyPage() {
	const [, locale] = useTranslation();
	const { data: text } = useQuery({
		queryKey: ["privacy", locale.language],
		async queryFn({ queryKey: [_, lang] }) {
			const response = await fetch(`/legal/${lang}/privacy.md`);

			if (!response.ok)
				throw new Error("Failed to fetch privacy policy text");

			const raw = await response.text();

			return parseMarkdown(raw);
		},
	});

	return text;
}
