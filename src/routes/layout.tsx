import { AppNavbar } from "@/components/app-navbar";
import { getUserArtist$ } from "@/server/auth";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main-layout-id")({
	beforeLoad: async () => {
		const userArtist = await getUserArtist$();

		return userArtist
			? {
					user: userArtist.user,
					session: userArtist.session,
					artist: userArtist.artist,
				}
			: {};
	},

	component: RouteComponent,
});

function RouteComponent() {
	const { user, artist } = Route.useRouteContext();
	return (
		<AppNavbar user={user} artist={artist}>
			<Outlet />
		</AppNavbar>
	);
}
