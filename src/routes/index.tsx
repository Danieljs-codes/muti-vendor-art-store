import { createFileRoute } from "@tanstack/react-router";
import { Link } from "ui";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-svh flex flex-col items-center justify-center p-4">
			<Link href="/sign-in">Sign In</Link>
		</div>
	);
}
