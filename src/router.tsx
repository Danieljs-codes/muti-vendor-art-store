import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import {
	type NavigateOptions,
	type ToOptions,
	createRouter as createTanStackRouter,
	isRedirect,
} from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { RouterProvider } from "react-aria-components";
import { routeTree } from "./route-tree.gen";

declare module "react-aria-components" {
	interface RouterConfig {
		href: ToOptions["to"];
		routerOptions: Omit<NavigateOptions, keyof ToOptions>;
	}
}

export function createRouter() {
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				if (isRedirect(error)) {
					return;
				}
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				if (isRedirect(error)) {
					return;
				}
			},
		}),
	});
	return routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient },
			defaultPreload: "intent",
		}),
		queryClient,
	);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
