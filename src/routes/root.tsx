import { ThemeProvider } from "@/components/theme-provider";
import globalStyle from "@/index.css?url";
import { getToast } from "@/server/utils";
import type { QueryClient } from "@tanstack/react-query";
// app/routes/__root.tsx
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { type ReactNode, useEffect } from "react";
import { toast as showToast } from "sonner";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	meta: () => [
		{
			charSet: "utf-8",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1",
		},
		{
			title: "TanStack Start Starter",
		},
	],
	links: () => [{ rel: "stylesheet", href: globalStyle }],
	// https://github.com/TanStack/router/issues/1992#issuecomment-2397896356
	scripts: () =>
		import.meta.env.PROD
			? []
			: [
					{
						type: "module",
						children: `
						import RefreshRuntime from "/_build/@react-refresh"
						RefreshRuntime.injectIntoGlobalHook(window)
						window.$RefreshReg$ = () => {}
						window.$RefreshSig$ = () => (type) => type
	  				`,
					},
				],
	loader: async () => {
		return {
			toast: await getToast(),
		};
	},
	component: RootComponent,
});

function RootComponent() {
	const { toast } = Route.useLoaderData();

	useEffect(() => {
		if (!toast) return;
		showToast[toast.intent](toast.message);
	}, [toast]);

	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://rsms.me/" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
				<Meta />
			</head>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
