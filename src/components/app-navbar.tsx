import type { authClient } from "@/utils/auth-client";
import type { artist } from "@server/types";
import { Link } from "@tanstack/react-router";
import {
	IconBag2,
	IconChevronLgDown,
	IconCommandRegular,
	IconDashboard,
	IconHeadphones,
	IconLogout,
	IconMoon,
	IconSearch,
	IconSettings,
	IconSun,
} from "justd-icons";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { Avatar, Button, Menu, Navbar, Separator, buttonStyles } from "ui";
import { Logo } from "./logo";

type User = Omit<
	(typeof authClient.$Infer.Session)["user"],
	"createdAt" | "updatedAt"
>;

type Artist = Omit<artist, "createdAt" | "updatedAt">;

// TODO: Fix links
export const AppNavbar = ({
	children,
	user,
	artist,
}: {
	children: ReactNode;
	user: User | undefined;
	artist: Artist | undefined | null;
}) => {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme((theme) => (theme === "dark" ? "light" : "dark"));
	};

	return (
		<Navbar>
			<Navbar.Nav>
				<Navbar.Logo href="/">
					<Logo
						classNames={{
							icon: "size-7",
							text: "text-base",
						}}
					/>
				</Navbar.Logo>
				<Navbar.Section>
					<Navbar.Item href="/">Home</Navbar.Item>
					<Navbar.Item href="/">Artworks</Navbar.Item>
					<Navbar.Item href="/">Orders</Navbar.Item>
					<Navbar.Item href="/">Wishlists</Navbar.Item>
				</Navbar.Section>
				<Navbar.Section className="ml-auto hidden lg:flex">
					<div className="flex items-center gap-x-2">
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Search for products"
						>
							<IconSearch />
						</Button>
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Your Bag"
						>
							<IconBag2 />
						</Button>
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Toggle Theme"
							onPress={toggleTheme}
						>
							{theme === "dark" ? <IconSun /> : <IconMoon />}
						</Button>
					</div>
					<Separator orientation="vertical" className="h-6 ml-1 mr-3" />
					{user && artist ? (
						<Menu>
							<Menu.Trigger
								aria-label="Open Menu"
								className="group gap-x-2 flex items-center"
							>
								<Avatar alt="slash" size="small" shape="square" initials="IP" />
								<IconChevronLgDown className="size-4 group-pressed:rotate-180 transition-transform" />
							</Menu.Trigger>
							<Menu.Content
								placement="bottom"
								showArrow
								className="sm:min-w-56"
							>
								<Menu.Section>
									<Menu.Header separator>
										<span className="block">{user.name}</span>
										<span className="font-normal text-muted-fg">
											{user.email}
										</span>
									</Menu.Header>
								</Menu.Section>
								<Menu.Item href="/dashboard/overview">
									<IconDashboard />
									Dashboard
								</Menu.Item>
								<Menu.Item href="/">
									<IconSettings />
									Settings
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item>
									<IconCommandRegular />
									Command Menu
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item href="/">
									<IconHeadphones />
									Contact Support
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item href="/">
									<IconLogout />
									Log out
								</Menu.Item>
							</Menu.Content>
						</Menu>
					) : null}
					{user && !artist ? (
						<Link
							className={buttonStyles({
								size: "small",
								intent: "secondary",
								shape: "circle",
							})}
							to="/create-artist"
						>
							Become an artist
						</Link>
					) : null}
					{!user ? (
						<Link
							className={buttonStyles({
								size: "extra-small",
								intent: "secondary",
								shape: "circle",
							})}
							to="/sign-in"
						>
							Sign in
						</Link>
					) : null}
				</Navbar.Section>
			</Navbar.Nav>
			<Navbar.Compact>
				<Navbar.Flex>
					<Navbar.Trigger className="-ml-2" />
				</Navbar.Flex>
				<Navbar.Flex>
					<Navbar.Flex>
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Search for products"
						>
							<IconSearch />
						</Button>
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Your Bag"
						>
							<IconBag2 />
						</Button>
						<Button
							appearance="plain"
							size="square-petite"
							aria-label="Toggle Theme"
							onPress={toggleTheme}
						>
							{theme === "dark" ? <IconSun /> : <IconMoon />}
						</Button>
					</Navbar.Flex>
					<Separator orientation="vertical" className="h-6 ml-1 mr-3" />
					{user && artist ? (
						<Menu>
							<Menu.Trigger
								aria-label="Open Menu"
								className="group gap-x-2 flex items-center"
							>
								<Avatar alt="slash" size="small" shape="square" initials="IP" />
								<IconChevronLgDown className="size-4 group-pressed:rotate-180 transition-transform" />
							</Menu.Trigger>
							<Menu.Content
								placement="bottom"
								showArrow
								className="sm:min-w-56"
							>
								<Menu.Section>
									<Menu.Header separator>
										<span className="block">{user.name}</span>
										<span className="font-normal text-muted-fg">
											{user.email}
										</span>
									</Menu.Header>
								</Menu.Section>

								<Menu.Item href="/dashboard/overview">
									<IconDashboard />
									Dashboard
								</Menu.Item>
								<Menu.Item href="/">
									<IconSettings />
									Settings
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item>
									<IconCommandRegular />
									Command Menu
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item href="/">
									<IconHeadphones />
									Contact Support
								</Menu.Item>
								<Menu.Separator />
								<Menu.Item href="/">
									<IconLogout />
									Log out
								</Menu.Item>
							</Menu.Content>
						</Menu>
					) : null}
					{!user ? (
						<Link
							className={buttonStyles({
								size: "extra-small",
								intent: "secondary",
								shape: "circle",
							})}
							to="/sign-in"
						>
							Sign in
						</Link>
					) : null}
					{user && !artist ? (
						<Link
							className={buttonStyles({
								size: "extra-small",
								intent: "secondary",
								shape: "circle",
							})}
							to="/create-artist"
						>
							Become an artist
						</Link>
					) : null}
				</Navbar.Flex>
			</Navbar.Compact>

			<Navbar.Inset>{children}</Navbar.Inset>
		</Navbar>
	);
};
