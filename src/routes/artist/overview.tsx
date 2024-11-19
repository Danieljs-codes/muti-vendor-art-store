import { Icons } from "@/components/icons";
import { RecentSalesTable } from "@/components/recent-sales-table";
import { RecentSalesTableSkeleton } from "@/components/recent-sales-table-skeleton";
import { formatCurrency } from "@/utils/misc";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { getArtistDashboardStats$ } from "@server/artist";
import {
	getArtistDashboardStatsQueryOptions,
	getArtistRecentSalesQueryOptions,
} from "@server/query-options";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Suspense } from "react";
import { Card, DateRangePicker, Heading, Loader } from "ui";
import { z } from "zod";


const overviewSearchParam = z.object({
	startDate: fallback(
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
	).default(
		() =>
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
	),
	endDate: fallback(
		z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
		new Date().toISOString().split("T")[0],
	).default(() => new Date().toISOString().split("T")[0]),
});

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/overview",
)({
	validateSearch: zodValidator(overviewSearchParam),
	loaderDeps: ({ search: { startDate, endDate } }) => {
		return {
			startDate,
			endDate,
		};
	},
	loader: async ({ context, deps }) => {
		context.queryClient.ensureQueryData(
			getArtistDashboardStatsQueryOptions({
				startDate: new Date(deps.startDate),
				endDate: new Date(deps.endDate),
			}),
		);
		context.queryClient.ensureQueryData(getArtistRecentSalesQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { startDate, endDate } = Route.useSearch();
	const navigate = Route.useNavigate();
	const now = today(getLocalTimeZone());
	const getArtistDashboardStats = useServerFn(getArtistDashboardStats$);

	const { data: stats, isSuspending } = useSuspenseQueryDeferred({
		...getArtistDashboardStatsQueryOptions({
			startDate: new Date(startDate),
			endDate: new Date(endDate),
		}),
		queryFn: async () => {
			const res = await getArtistDashboardStats({
				data: {
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				},
			});
			return res;
		},
	});

	return (
		<div>
			<div className="mb-4 flex flex-col md:flex-row justify-between gap-4 md:items-center">
				<Heading>Overview</Heading>
				<div className="flex items-center gap-4">
					<DateRangePicker
						// label="Date range"
						aria-label="Date range"
						defaultValue={{
							start: new CalendarDate(
								new Date(startDate).getFullYear(),
								new Date(startDate).getMonth() + 1,
								new Date(startDate).getDate(),
							),
							end: new CalendarDate(
								new Date(endDate).getFullYear(),
								new Date(endDate).getMonth() + 1,
								new Date(endDate).getDate(),
							),
						}}
						isDateUnavailable={(date) => {
							if (date.compare(now) > 0) {
								return true;
							}
							return false;
						}}
						onChange={(value) => {
							if (!value.start || !value.end) return;
							navigate({
								search: {
									startDate: value.start
										.toDate(getLocalTimeZone())
										.toISOString()
										.split("T")[0],
									endDate: value.end
										.toDate(getLocalTimeZone())
										.toISOString()
										.split("T")[0],
								},
							});
						}}
					/>
					{isSuspending ? <Loader variant="ring" /> : null}
				</div>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm md:text-sm font-medium">
							Total Revenue
						</Card.Title>
						<Icons.MoneyReceived className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{formatCurrency({
								amount: stats?.totalRevenue || 0,
								isKobo: true,
							})}
						</div>
						<p className="text-xs text-muted-fg">
							Total earnings from all artworks
						</p>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm md:text-sm font-medium">
							Total Orders
						</Card.Title>
						<Icons.Orders className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
						<p className="text-xs text-muted-fg">
							Total number of completed orders
						</p>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm md:text-sm font-medium">
							Average Order Value
						</Card.Title>
						<Icons.Analytics className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{formatCurrency({
								amount: stats?.averageOrderValue || 0,
								isKobo: true,
							})}
						</div>
						<p className="text-xs text-muted-fg">Average value per order</p>
					</Card.Content>
				</Card>

				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm md:text-sm font-medium">
							Total Artworks Sold
						</Card.Title>
						<Icons.Artwork className="size-4 text-muted-fg" />
					</Card.Header>
					<Card.Content>
						<div className="text-2xl font-bold">
							{stats?.totalArtworksSold || 0}
						</div>
						<p className="text-xs text-muted-fg">
							Total number of artworks sold
						</p>
					</Card.Content>
				</Card>
			</div>
			<div className="mt-6">
				<Card.Header
					title="Total Artworks Sold"
					description="Total number of artworks sold"
					withoutPadding
					classNames={{
						title: "text-base",
						description: "text-sm text-muted-fg",
					}}
				/>
				<div>
					<Suspense fallback={<RecentSalesTableSkeleton />}>
						<RecentSalesTable />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
