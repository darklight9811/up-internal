import { layout, prefix, type RouteConfig, route } from "@react-router/dev/routes";

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
	]),

	// Invite
	route("/invite/:slug", "./routes/invite/[slug]/page.tsx"),

	// App
	layout("./routes/(app)/layout.tsx", [
		route("/", "./routes/(app)/page.tsx"),
		route("/cores", "./routes/(app)/cores/page.tsx"),
		route("/cores/add", "./routes/(app)/cores/add/page.tsx"),
		route("/cores/:id/edit", "./routes/(app)/cores/[id]/edit/page.tsx"),
		route("/members", "./routes/(app)/members/page.tsx"),
		route("/settings", "./routes/(app)/settings/page.tsx"),
	]),

	// General
	route("/manifest.webmanifest", "./routes/manifest.ts"),
	route("/offline", "./routes/offline.tsx"),
	route("/*", "./routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
