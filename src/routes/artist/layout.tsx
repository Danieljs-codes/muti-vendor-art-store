import { AppSidebar } from "@/components/app-sidebar";
import { validateArtistDashboardAccess$ } from "@server/auth";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
	IconChevronLgDown,
	IconCirclePerson,
	IconLogout,
	IconMoon,
	IconSearch,
	IconSettings,
	IconShield,
	IconSun,
} from "justd-icons";
import { useTheme } from "next-themes";
import { Avatar, Button, Menu, SearchField, Separator, Sidebar } from "ui";

export const Route = createFileRoute("/_dashboard-layout-id")({
	beforeLoad: async () => {
		const { artist, user } = await validateArtistDashboardAccess$();

		return { artist, user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { artist, user } = Route.useRouteContext();
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<Sidebar.Provider>
			<AppSidebar props={{ user: user }} />
			<Sidebar.Inset>
				<Sidebar.Nav isSticky>
					<span className="flex items-center gap-x-3">
						<Sidebar.Trigger className="-mx-2" />
						<Separator className="h-6 sm:block hidden" orientation="vertical" />
					</span>
					<SearchField className="sm:inline hidden sm:ml-1.5" />
					<div className="flex sm:hidden items-center gap-x-2">
						<Button
							appearance="plain"
							aria-label="Search..."
							size="square-petite"
						>
							<IconSearch />
						</Button>
						<Menu>
							<Menu.Trigger
								aria-label="Profile"
								className="flex items-center gap-x-2 group"
							>
								<Avatar
									size="small"
									shape="circle"
									src="/images/sidebar/profile-slash.jpg"
								/>
								<IconChevronLgDown className="size-4 group-pressed:rotate-180 transition-transform" />
							</Menu.Trigger>
							<Menu.Content className="min-w-[--trigger-width]">
								<Menu.Item href="/">
									<IconCirclePerson />
									Profile
								</Menu.Item>
								<Menu.Item href="/">
									<IconSettings />
									Settings
								</Menu.Item>
								<Menu.Item href="/">
									<IconShield />
									Security
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item onAction={toggleTheme}>
									{theme === "dark" ? <IconSun /> : <IconMoon />}
									Toggle Theme
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item href="/">
									<IconLogout />
									Log out
								</Menu.Item>
							</Menu.Content>
						</Menu>
					</div>
				</Sidebar.Nav>
				<div className="p-4 lg:p-6">
					<Outlet />
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	);
}
