"use client";

import type * as React from "react";

import type { authClient } from "@/utils/auth-client";
import { useLocation } from "@tanstack/react-router";
import {
	IconChevronLgDown,
	IconCirclePerson,
	IconDashboard,
	IconLogout,
	IconMoon,
	IconPlus,
	IconSettings,
	IconSun,
} from "justd-icons";
import { useTheme } from "next-themes";
import { Avatar, Button, Link, Menu, Sidebar } from "ui";
import { Icons } from "./icons";
import { Logo } from "./logo";

type User = Omit<
	(typeof authClient.$Infer.Session)["user"],
	"createdAt" | "updatedAt"
>;
export function AppSidebar({
	user,
	pendingOrders,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user: User;
	pendingOrders: number;
}) {
	const { pathname } = useLocation();
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<Sidebar {...props} collapsible="offcanvas" intent="floating">
			<Sidebar.Header>
				<Link
					className="flex items-center group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center gap-x-2"
					href="/"
				>
					<Logo
						classNames={{
							icon: "size-7",
							text: "text-base",
						}}
					/>
				</Link>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Section>
					<Sidebar.Item
						icon={IconDashboard}
						href="/dashboard/overview"
						isCurrent={pathname.includes("overview")}
					>
						Overview
					</Sidebar.Item>
					<Sidebar.Item
						icon={Icons.Artwork}
						href="/dashboard/artworks"
						isCurrent={pathname.includes("artworks")}
					>
						Artworks
					</Sidebar.Item>
					<Sidebar.Item
						icon={Icons.Orders}
						href="/dashboard/orders"
						isCurrent={pathname.includes("orders")}
						badge={String(pendingOrders)}
					>
						Orders
					</Sidebar.Item>
					<Sidebar.Item
						icon={Icons.Discount}
						href="/dashboard/discounts"
						isCurrent={pathname.includes("discounts")}
					>
						Discounts
					</Sidebar.Item>
					<Sidebar.Item
						icon={Icons.Analytics}
						href="/"
						isCurrent={pathname.includes("analytics")}
					>
						Analytics
					</Sidebar.Item>
				</Sidebar.Section>
				<Sidebar.Section collapsible title="Shortcuts">
					<Sidebar.Item icon={IconPlus} href="/dashboard/artworks-new">
						Upload Artwork
					</Sidebar.Item>
					<Sidebar.Item icon={Icons.TimeSchedule} href="/">
						Schedule Artwork
					</Sidebar.Item>
				</Sidebar.Section>
			</Sidebar.Content>
			<Sidebar.Footer className="lg:flex lg:flex-row hidden items-center">
				<Menu>
					<Button
						appearance="plain"
						aria-label="Profile"
						slot="menu-trigger"
						className="group"
					>
						<Avatar
							size="small"
							shape="square"
							src={user.image}
							initials={user.name[0]}
						/>
						<span className="group-data-[collapsible=dock]:hidden flex items-center justify-center">
							{user.name}
							<IconChevronLgDown className="right-3 size-4 absolute group-pressed:rotate-180 transition-transform" />
						</span>
					</Button>
					<Menu.Content className="min-w-[--trigger-width]">
						<Menu.Item href="/">
							<IconCirclePerson />
							Profile
						</Menu.Item>
						<Menu.Item href="/">
							<IconSettings />
							Settings
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
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar>
	);
}
