import { formatCurrency, sleep } from "@/utils/misc";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistRecentSales$ } from "@server/artist";
import type { ShippingStatus } from "@server/enums";
import { getArtistRecentSalesQueryOptions } from "@server/query-options";
import { useServerFn } from "@tanstack/start";
import { Badge, Card, Menu, Table } from "ui";

function getShippingStatusIntent(status: ShippingStatus) {
	switch (status) {
		case "PENDING":
			return "info";
		case "SHIPPED":
			return "primary";
		case "DELIVERED":
			return "success";
	}
}

export function RecentSalesTable() {
	const getArtistRecentSales = useServerFn(getArtistRecentSales$);
	const { data: recentSales } = useSuspenseQueryDeferred({
		...getArtistRecentSalesQueryOptions(),
		queryFn: async () => {
			const res = await getArtistRecentSales();
			return res;
		},
	});

	return (
		<Card>
			<Table aria-label="Recent Sales">
				<Table.Header>
					<Table.Column>Order ID</Table.Column>
					<Table.Column>Product</Table.Column>
					<Table.Column>Images</Table.Column>
					<Table.Column isRowHeader>Customer Name</Table.Column>
					<Table.Column>Customer Email</Table.Column>
					<Table.Column>Quantity</Table.Column>
					<Table.Column>Price</Table.Column>
					<Table.Column>Final Price</Table.Column>
					<Table.Column>Platform Fee</Table.Column>
					<Table.Column>Shipping Status</Table.Column>
				</Table.Header>
				<Table.Body
					items={recentSales}
					renderEmptyState={() => (
						<div className="flex flex-col items-center justify-center p-4">
							<p className="text-fg text-base mb-1 font-semibold">
								No recent sales
							</p>
							<p className="text-muted-fg text-sm">
								You don't have any recent sales yet start selling
							</p>
						</div>
					)}
				>
					{({
						id,
						title,
						imageUrls,
						customerName,
						customerEmail,
						shippingStatus,
						quantity,
						price,
						finalPrice,
						platformFee,
					}) => (
						<Table.Row id={id}>
							<Table.Cell>{id}</Table.Cell>
							<Table.Cell>{title}</Table.Cell>
							<Table.Cell>{imageUrls.length}</Table.Cell>
							<Table.Cell>{customerName}</Table.Cell>
							<Table.Cell>{customerEmail}</Table.Cell>
							<Table.Cell>{quantity}</Table.Cell>
							<Table.Cell>
								{formatCurrency({ amount: Number.parseFloat(price) })}
							</Table.Cell>
							<Table.Cell>
								{formatCurrency({ amount: Number.parseFloat(finalPrice) })}
							</Table.Cell>
							<Table.Cell>
								{formatCurrency({ amount: Number.parseFloat(platformFee) })}
							</Table.Cell>
							<Table.Cell>
								<Badge
									className="capitalize"
									intent={getShippingStatusIntent(
										shippingStatus as ShippingStatus,
									)}
								>
									{shippingStatus.toLowerCase()}
								</Badge>
							</Table.Cell>
						</Table.Row>
					)}
				</Table.Body>
			</Table>
		</Card>
	);
}
