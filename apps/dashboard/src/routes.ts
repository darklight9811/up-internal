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
	]),

	// General
	route("/manifest.webmanifest", "./routes/manifest.ts"),
	route("/offline", "./routes/offline.tsx"),
	route("/*", "./routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
