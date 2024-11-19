import { queryOptions } from "@tanstack/react-query";
import {
	getArtistArtworks$,
	getArtistDashboardStats$,
	getArtistPendingOrders$,
	getArtistRecentSales$,
} from "./artist";

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

	export const getArtistRecentSalesQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-recent-sales"],
		queryFn: async() => await getArtistRecentSales$(),
		select: (data) =>  data.data
	});

	export const getArtistArtworkQueryOptions = ({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}) =>
		queryOptions({
			queryKey: ["artist-artwork"],
			queryFn: async () => {
				const res = await getArtistArtworks$({
					data: {
						page,
						limit,
					},
				});
				return res;
			},
			select: (data) => data.data,
		});