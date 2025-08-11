import v from "zod/v4";

const schema = v.object({
	name: v.string(),
	domain: v.string(),
	version: v.string().default("0.3.2"),
	secret: v.string().default("secret"),
	resend: v.string().default(""),

	type: v.enum(["dev", "prod"]).default("dev"),

	app_url: v.url().default("http://localhost:3000"),
});

export const env = schema.parse({
	name: "Worker Party",
	domain: "workerparty.com.br",
	version:
		typeof process !== "undefined" && process.env.VITE_APP_VERSION
			? process.env.VITE_APP_VERSION
			: import.meta.env.VITE_APP_VERSION,
	app_url:
		typeof process !== "undefined" && process.env.VITE_APP_URL
			? process.env.VITE_APP_URL
			: import.meta.env.VITE_APP_URL,

	secret:
		typeof process !== "undefined" && process.env.KEY_SECRET ? process.env.KEY_SECRET : import.meta.env.KEY_SECRET,

	resend:
		typeof process !== "undefined" && process.env.RESEND_API_KEY
			? process.env.RESEND_API_KEY
			: import.meta.env.RESEND_API_KEY,
});

export const config = {
	decimalPlaces: 0,
};
