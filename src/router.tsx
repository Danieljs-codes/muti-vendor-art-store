import { QueryClient } from "@tanstack/react-query";
import {
	type NavigateOptions,
	type ToOptions,
	createRouter as createTanStackRouter,
	useRouter,
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
	const queryClient = new QueryClient();
	return routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			context: { queryClient },
			defaultPreload: "intent",
			InnerWrap: ({ children }) => {
				const router = useRouter();
				return (
					<RouterProvider
						navigate={(to, options) => router.navigate({ to, ...options })}
						useHref={(to) => router.buildLocation({ to }).href}
					>
						{children}
					</RouterProvider>
				);
			},
		}),
		queryClient,
	);
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
