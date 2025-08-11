import {
	layout,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	// auth
	layout("./routes/(auth)/layout.tsx", { id: "auth" }, [
		route("/register", "./routes/(auth)/register/page.tsx"),
		route("/login", "./routes/(auth)/login/page.tsx"),
		route("/verify", "./routes/(auth)/verify/page.tsx"),

		...prefix("/password", [
			route("/forgot", "./routes/(auth)/password/forgot/page.tsx"),
			route("/reset", "./routes/(auth)/password/reset/page.tsx"),
		]),

		route("/anonymous", "./routes/(auth)/anonymous/page.tsx"),
	]),

	// legal
	layout("./routes/(legal)/layout.tsx", { id: "legal" }, [
		route(
			"/terms-of-service",
			"./routes/(legal)/terms-of-service/page.tsx",
		),
		route("/privacy-policy", "./routes/(legal)/privacy-policy/page.tsx"),
	]),

	// game
	layout("./routes/(game)/layout.tsx", { id: "base" }, [
		route("/", "./routes/(game)/page.tsx"),

		route("/store", "./routes/(game)/store/page.tsx"),
		route("/store/:slug", "./routes/(game)/store/[slug]/page.tsx"),
		route("/inventory", "./routes/(game)/inventory/page.tsx"),
		route("/highscore", "./routes/(game)/highscore/page.tsx"),
		route("/feedback", "./routes/(game)/feedback/page.tsx"),
	]),

	// og
	route("/og/highscore/:id", "./routes/(svg)/highscore/[id]/route.tsx"),

	// General
	route("/manifest.webmanifest", "./routes/manifest.ts"),
	route("/.well-known/assetlinks.json", "./routes/asset-links.ts"),
	route("/offline", "./routes/offline.tsx"),
	route("/*", "./routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
