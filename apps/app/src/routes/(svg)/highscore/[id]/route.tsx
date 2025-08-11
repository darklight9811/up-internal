import { renderToString } from "react-dom/server";
import { serverLoader } from "src/utils/server-loader";

import { highscoreService } from "@repo/domains/highscore/server";

export const loader = serverLoader(async ({ getTranslations, params }) => {
	const [t, highscore] = await Promise.all([
		getTranslations("metadata"),
		highscoreService.show(params.id!),
	]);

	return new Response(
		renderToString(
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
				<title>{t("highscore.title")}</title>
				<defs>
					<pattern
						id="pattern-bg"
						patternUnits="userSpaceOnUse"
						width="128"
						height="128"
					>
						<image
							href="/textures/pattern.png"
							x="0"
							y="0"
							width="128"
							height="128"
							preserveAspectRatio="xMidYMid slice"
						/>
					</pattern>
				</defs>
				<rect width="1200" height="630" fill="url(#pattern-bg)" />

				<defs>
					<linearGradient
						id="highscore-gradient"
						x1="0%"
						y1="100%"
						x2="0%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#331D1A" />
						<stop offset="100%" stopColor="#823030" />
					</linearGradient>
				</defs>

				<text
					x="600"
					y="180"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="36"
					fontWeight="bold"
					fill="#422622"
					fontFamily="sans-serif"
				>
					{t("highscore.upper")}
				</text>

				<text
					x="600"
					y="300"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="180"
					fontWeight="bold"
					fill="url(#highscore-gradient)"
					stroke="#121212"
					strokeWidth="8"
					paintOrder="stroke"
					fontFamily="sans-serif"
				>
					{highscore?.value || 0}
				</text>

				<text
					x="600"
					y="400"
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="36"
					fontWeight="bold"
					fill="#422622"
					fontFamily="sans-serif"
				>
					{t("highscore.lower")}
				</text>

				<g>
					<image
						href="/logo.png"
						x="408"
						y="450"
						width="384"
						height="163"
						preserveAspectRatio="xMidYMid meet"
					/>
				</g>
			</svg>,
		),
		{
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
			},
		},
	);
});
