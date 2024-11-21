import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks/$id",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return "Hello /_dashboard-layout-id/dashboard/artworks/$id!";
}
