import { defineConfig } from "@tanstack/start/config";
import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes";
import { join } from "node:path";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = {
	appDirectory: "src",
	autoOpenBrowser: false,
} as const;

const routes = rootRoute("root.tsx", [
	index("index.tsx"),
	layout("auth-layout-id", "auth/layout.tsx", [
		route("sign-in", "auth/sign-in.tsx"),
		route("sign-up", "auth/sign-up.tsx"),
	]),
]);

export default defineConfig({
	vite: {
		plugins: [
			// this is the plugin that enables path aliases
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
		],
	},
	routers: {
		api: {
			entry: join(config.appDirectory, "entry-api.ts"),
		},
		ssr: {
			entry: join(config.appDirectory, "entry-server.ts"),
		},
		client: {
			entry: join(config.appDirectory, "entry-client.tsx"),
		},
	},
	tsr: {
		appDirectory: config.appDirectory,
		generatedRouteTree: join(config.appDirectory, "route-tree.gen.ts"),
		quoteStyle: "single",
		semicolons: false,
		customScaffolding: {
			routeTemplate: [
				"%%tsrImports%%\n\n",
				"%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
				'function RouteComponent() { return "Hello %%tsrPath%%!" }\n',
			].join(""),
			apiTemplate: [
				'import { json } from "@tanstack/start";\n',
				"%%tsrImports%%\n\n",
				"%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:'Hello \"%%tsrPath%%\"!' }) }}%%tsrExportEnd%%\n",
			].join(""),
		},
		virtualRouteConfig: routes,
	},
});