import { QueryClientProvider } from "@tanstack/react-query";
import {
	isRouteErrorResponse,
	Links,
	type LinksFunction,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "react-router";

import { env, queryClient } from "@repo/domains/app";

import "@repo/ds/style";

import { useEffect } from "react";

import { useTranslation } from "@repo/ds/lib/localization";
import { Button } from "@repo/ds/ui/button";
import { Toaster } from "@repo/ds/ui/sonner";

import { authService } from "@repo/domains/auth/server";

import { partiesService } from "../../../packages/domains/src/domains/parties/server/service.server";
import i18next, { i18nextMiddleware } from "./utils/i19next.server";
import { serverLoader } from "./utils/server-loader";

/**
 * ### MARK: Links
 */
export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{
		rel: "icon",
		type: "image/png",
		href:
			env.type === "prod" ? "/icon.png" : env.app_url.includes("localhost") ? "/icon-local.png" : "/icon-dev.png",
	},
];

export const unstable_middleware = [i18nextMiddleware];

/**
 * ### MARK: Loader
 */
export const loader = serverLoader(async ({ request, cookies }) => {
	const partyId = cookies.get("partyId");
	const coreId = cookies.get("coreId");

	const [locale, user] = await Promise.all([i18next.getLocale(request), authService.session(cookies.get("token"))]);
	const party = partyId
		? await partiesService
				.show(partyId, user || undefined)
				.then((r) => (r ? { ...r, cores: r.cores.map((c) => ({ ...c, selected: c.id === coreId })) } : null))
		: null;

	return { locale, user, party };
});

export const handle = {
	i18n: "general",
};

/**
 * ### MARK: Layout
 */
export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData = useLoaderData<typeof loader>();

	const { i18n } = useTranslation();

	return (
		<html lang={loaderData?.locale} dir={i18n.dir()} className="h-full scroll-smooth">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1, viewport-fit=cover"
				/>
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<link rel="manifest" href="/manifest.webmanifest" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col h-full bg-[url(/textures/pattern.png)] bg-[size:150px]">
				<div className="grow w-full flex h-screen">
					<div id="content" className="flex flex-col w-full grow relative">
						{children}
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

/**
 * ### MARK: App
 */
export default function App() {
	useEffect(() => {
		if (typeof window !== "undefined" && typeof navigator.serviceWorker !== "undefined") {
			navigator.serviceWorker.register("/sw.js");
		}
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<Outlet />
		</QueryClientProvider>
	);
}

/**
 * ### MARK: Error boundary
 */
export function ErrorBoundary({ error }: { error: Error }) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto grow flex flex-col items-center justify-center gap-4">
			<img alt="logo" src="/logo.png" className="w-full max-w-sm mx-auto" />

			<h1 className="text-3xl font-bold">{message}</h1>
			<p className="">{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto bg-gray-700 shadow-depth rounded-lg text-white overflow-hidden">
					<code>{stack}</code>
				</pre>
			)}

			<Button onClick={() => window.location.reload()}>Try Again</Button>
		</main>
	);
}
