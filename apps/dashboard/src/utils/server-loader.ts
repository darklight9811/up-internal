import { CookieMap } from "bun";

import type { LoaderFunction } from "react-router";

import { getTranslations } from "./i19next.server";

export function serverLoader<
	Callback extends (
		ctx: {
			pathname: string;
			cookies: { get(name: string): null | string };
			getTranslations(ns?: string): Promise<(key: string) => string>;
		} & Parameters<LoaderFunction>[0],
	) => unknown,
>(cb: Callback) {
	return ((...args: Parameters<LoaderFunction>) =>
		cb({
			...args[0],
			pathname: new URL(args[0].request.url).pathname,
			async getTranslations(ns) {
				const instance = await getTranslations(
					args[0].request,
					args[0].context,
					ns ? [ns] : ["general"],
				);

				return (key: string) => instance.t(key, { ns });
			},
			cookies: {
				get(name: string) {
					const cookieString = args[0].request.headers.get("cookie");
					if (!cookieString) return null;

					const cookies = new CookieMap(cookieString);
					return cookies.get(name) || null;
				},
			},
		})) as unknown as () => ReturnType<Callback>;
}
