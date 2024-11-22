import { queryOptions } from "@tanstack/react-query";
import {
	getArtistArtworks$,
	getArtistDashboardStats$,
	getArtistDiscounts$,
	getArtistOrders$,
	getArtistPendingOrders$,
	getArtistRecentSales$,
	getArtworkById$,
} from "./artist";

export const getArtistPendingOrdersQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-pending-orders"],
		queryFn: async () => await getArtistPendingOrders$(),
	});

export const getArtistDashboardStatsQueryOptions = ({
	startDate,
	endDate,
}: { startDate: Date; endDate: Date }) =>
	queryOptions({
		queryKey: [
			"artist-dashboard-stats",
			startDate.toISOString(),
			endDate.toISOString(),
		],
		queryFn: async () => {
			const res = await getArtistDashboardStats$({
				data: {
					startDate,
					endDate,
				},
			});

			return res;
		},
		select: (data) => data.data,
	});

export const getArtistRecentSalesQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-recent-sales"],
		queryFn: async () => await getArtistRecentSales$(),
		select: (data) => data.data,
	});

export const getArtistArtworkQueryOptions = ({
	page,
	limit,
	search,
}: {
	page: number;
	limit: number;
	search?: string;
}) =>
	queryOptions({
		queryKey: ["artist-artwork", page, limit, search],
		queryFn: async () => {
			const res = await getArtistArtworks$({
				data: {
					page,
					limit,
					search,
				},
			});
			return res;
		},
		select: (data) => data.data,
	});

export const getArtworkByIdQueryOptions = ({ id }: { id: string }) =>
	queryOptions({
		queryKey: ["artwork", id],
		queryFn: async () => {
			const res = await getArtworkById$({
				data: {
					id,
				},
			});
			return res;
		},
		select: (data) => data.data,
	});

export const getArtistOrdersQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-orders"],
		queryFn: async () => {
			const res = await getArtistOrders$();
			return res;
		},
		select: (data) => data.data,
	});

export const getArtistDiscountsQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-discounts"],
		queryFn: async () => await getArtistDiscounts$(),
		select: (data) => data.data,
	});
