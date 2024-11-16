import { Logo } from "@/components/logo";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth-layout-id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div className="h-full flex flex-col items-center pt-12 md:pt-24 px-4">
				<Link to="/">
					<Logo classNames={{ container: "mb-6", icon: "h-10 w-10" }} />
				</Link>
				<div className="w-full max-w-[400px]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
