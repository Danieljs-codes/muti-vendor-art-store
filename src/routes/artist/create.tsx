import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-artist")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Become an artist</div>;
}
