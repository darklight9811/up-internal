import { RemixI18Next } from "remix-i18next/server";

import i18n from "@repo/ds/lib/i18n";

export function starti18n() {
	return new RemixI18Next({
		detection: {
			supportedLanguages: i18n.supportedLngs,
			fallbackLanguage: i18n.fallbackLng,
		},
		i18next: {
			...i18n,
		},
	});
}
