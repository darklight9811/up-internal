import i18next from "src/utils/i19next.server";
import { serverLoader } from "src/utils/server-loader";

import { env } from "@repo/domains/app";

export const loader = serverLoader(async ({ getTranslations, request }) => {
	const [t, locale] = await Promise.all([
		getTranslations("metadata"),
		i18next.getLocale(request),
	]);

	return new Response(
		JSON.stringify({
			version: env.version,
			id: "/up-interno",
			lang: locale,
			name: "UP interno",
			short_name: "UP interno",
			description: t("description"),
			keywords: t("keywords")
				.split(",")
				.map((keyword) => keyword.trim()),
			categories: ["games", "entertainment"],
			orientation: "natural",
			start_url: "/",
			scope: "/",
			display: "fullscreen",
			background_color: "#FFF2CE",
			theme_color: "#613C38",
			dir: "ltr",
			edge_side_panel: {
				preferred_width: 442,
			},
			launch_handler: {
				client_mode: "navigate-existing",
			},
			developer: {
				name: "Yamiassu Softworks",
				url: "https://yamiassu.com.br",
			},
			icons: [
				{
					src:
						env.type === "prod"
							? "/icon.png"
							: env.app_url.includes("localhost")
								? "/icon-local.png"
								: "/icon-dev.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			screenshots: [
				{
					src: "/textures/screenshots/landscape.png",
					type: "image/png",
					sizes: "1397x945",
					form_factor: "wide",
				},
				{
					src: "/textures/screenshots/portrait.png",
					type: "image/png",
					sizes: "469x945",
					form_factor: "narrow",
				},
			],
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
});
