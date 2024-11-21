import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
