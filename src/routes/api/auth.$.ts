// routes/api/hello.ts
import { auth } from "@/utils/auth";
import { createAPIFileRoute } from "@tanstack/start/api";

export const Route = createAPIFileRoute("/hello")({
	GET: async ({ request }) => {
		return auth.handler(request);
	},
	POST: async ({ request }) => {
		return auth.handler(request);
	},
});
