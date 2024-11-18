import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/overview",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /dashboard/overview!";
}
