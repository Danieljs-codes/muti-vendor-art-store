import { queryOptions } from "@tanstack/react-query";
import { getArtistDashboardStats$, getArtistPendingOrders$ } from "./artist";

export const getArtistPendingOrdersQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-pending-orders"],
		queryFn: async() => await getArtistPendingOrders$(),
	});

	export const getArtistDashboardStatsQueryOptions = ({startDate, endDate}: {startDate: Date, endDate: Date}) =>
	queryOptions({
		queryKey: ["artist-dashboard-stats", startDate.toISOString(), endDate.toISOString()],
		queryFn: async () => {
			const res = await getArtistDashboardStats$({
				data: {
					startDate,
					endDate
				}
			})

			return res
		},
		select: (data) =>  data.data
	});