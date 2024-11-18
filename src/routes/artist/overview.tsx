import { Icons } from "@/components/icons";
import { formatCurrency } from "@/utils/misc";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { getArtistDashboardStats$ } from "@server/artist";
import { getArtistDashboardStatsQueryOptions } from "@server/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Card, DateRangePicker, Heading } from "ui";
import { z } from "zod";


const overviewSearchParam = z.object({
	startDate: fallback(
		z.coerce.date(),
		new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
	),
	endDate: z.coerce.date().default(new Date()),
});

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/overview",
)({
	validateSearch: zodValidator(overviewSearchParam),
  loaderDeps: ({search: {startDate, endDate}}) => ({startDate, endDate}),
  loader: async ({context: {queryClient}, deps: {startDate, endDate}}) => {
    queryClient.ensureQueryData(getArtistDashboardStatsQueryOptions({startDate, endDate}));
  },
	component: RouteComponent,
});

function RouteComponent() {
	const { startDate, endDate } = Route.useSearch();
	const navigate = Route.useNavigate();
	const now = today(getLocalTimeZone());
	const getArtistDashboardStats = useServerFn(getArtistDashboardStats$)

  const { data: stats } = useSuspenseQuery({
    ...getArtistDashboardStatsQueryOptions({
      startDate,
      endDate
    }),
    queryFn: async () => {
      const res = await getArtistDashboardStats({
        data: {
          startDate,
          endDate
        }
      })
      return res
    }
  })
 
 	return (
		<div>
			<div className="mb-4 flex flex-col md:flex-row justify-between gap-4 md:items-center">
				<Heading>Overview</Heading>
				<DateRangePicker
					label="Date range"
					defaultValue={{
						start: new CalendarDate(
							startDate.getFullYear(),
							startDate.getMonth() + 1,
							startDate.getDate(),
						),
						end: new CalendarDate(
							endDate.getFullYear(),
							endDate.getMonth() + 1,
							endDate.getDate(),
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
								startDate: value.start.toDate(getLocalTimeZone()),
								endDate: value.end.toDate(getLocalTimeZone()),
							},
						});
					}}
				/>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title className="text-sm font-medium">
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
						<Card.Title className="text-sm font-medium">
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
						<Card.Title className="text-sm font-medium">
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
						<Card.Title className="text-sm font-medium">
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
		</div>
	);
}
