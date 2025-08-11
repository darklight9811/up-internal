import { reactRouter } from "@react-router/dev/vite";
import tw from "@tailwindcss/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => ({
	resolve: {
		...(config.command === "build"
			? {
					alias: {
						"react-dom/server": "react-dom/server.node",
					},
				}
			: undefined),
	},
	plugins: [
		tsconfigPaths(),
		tw(),
		reactRouterHonoServer({
			runtime: "bun",
		}),
		reactRouter(),
	],
}));
