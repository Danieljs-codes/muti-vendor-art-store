import { queryOptions } from "@tanstack/react-query";
import { getArtistPendingOrders$ } from "./artist";

export const getArtistPendingOrdersQueryOptions = () =>
	queryOptions({
		queryKey: ["artist-pending-orders"],
		queryFn: () => getArtistPendingOrders$(),
	});
