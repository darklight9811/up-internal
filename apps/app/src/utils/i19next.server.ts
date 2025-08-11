import { resolve } from "node:path";

import Backend from "i18next-fs-backend/cjs";
import { initReactI18next } from "react-i18next";
import {
	createCookie,
	type unstable_RouterContextProvider,
} from "react-router";
import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import { RemixI18Next } from "remix-i18next/server";

import i18n from "@repo/ds/lib/i18n";

export const localeCookie = createCookie("lng", {
	path: "/",
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
});

const i18next = new RemixI18Next({
	detection: {
		supportedLanguages: i18n.supportedLngs,
		fallbackLanguage: i18n.fallbackLng,
		cookie: localeCookie,
	},
	i18next: {
		...i18n,
		backend: {
			loadPath: resolve("../../public/locales/{{lng}}/{{ns}}.json"),
		},
	},
});

export default i18next;

export const [i18nextMiddleware, getLocale, getInstance] =
	unstable_createI18nextMiddleware({
		detection: {
			supportedLanguages: i18n.supportedLngs,
			fallbackLanguage: i18n.fallbackLng,
			cookie: localeCookie,
		},
		i18next: {
			...i18n,
			backend: {
				loadPath: resolve("../../public/locales/{{lng}}/{{ns}}.json"),
			},
		},
	});

export async function getTranslations(
	request: Request,
	context: unstable_RouterContextProvider,
	ns: string[] = [],
) {
	const instance = getInstance(context);
	const lng = await i18next.getLocale(request);

	await instance
		.use(initReactI18next)
		.use(Backend)
		.init({
			...i18n,
			ns,
			lng,
			backend: {
				loadPath: resolve("../../public/locales/{{lng}}/{{ns}}.json"),
			},
		});

	return instance;
}
