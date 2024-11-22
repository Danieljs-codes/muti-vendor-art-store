import { Icons } from "@/components/icons";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistOrders$, updateOrderShippingStatus$ } from "@server/artist";
import { ShippingStatus } from "@server/enums";
import { getArtistOrdersQueryOptions } from "@server/query-options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { IconDotsVertical } from "justd-icons";
import Balancer from "react-wrap-balancer";
import { toast } from "sonner";
import { Badge, Card, Description, Heading, Menu, Table } from "ui";

// Test data with additional fields matching the API response
const mockOrders = [
	{
		id: "ORD-001",
		customerName: "John Doe",
		customerEmail: "john@example.com",
		quantity: 2,
		price: "$75.00",
		finalPrice: "$150.00",
		platformFee: "$15.00",
		title: "Abstract Sunset",
		description: "Beautiful abstract painting",
		shippingStatus: "PENDING" as const,
		createdAt: new Date().toISOString(),
		totalPrice: "$165.00",
	},
	{
		id: "ORD-002",
		customerName: "Jane Smith",
		customerEmail: "jane@example.com",
		quantity: 1,
		price: "$75.00",
		finalPrice: "$75.00",
		platformFee: "$7.50",
		title: "Ocean Waves",
		description: "Serene ocean landscape",
		shippingStatus: "SHIPPED" as const,
		createdAt: new Date().toISOString(),
		totalPrice: "$82.50",
	},
	{
		id: "ORD-003",
		customerName: "Bob Wilson",
		customerEmail: "bob@example.com",
		quantity: 3,
		price: "$75.00",
		finalPrice: "$225.00",
		platformFee: "$22.50",
		title: "Mountain Peak",
		description: "Majestic mountain view",
		shippingStatus: "DELIVERED" as const,
		createdAt: new Date().toISOString(),
		totalPrice: "$247.50",
	},
];

export const Route = createFileRoute("/_dashboard-layout-id/dashboard/orders")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(getArtistOrdersQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const getArtistOrders = useServerFn(getArtistOrders$);
	const updateShippingStatus = useServerFn(updateOrderShippingStatus$);
	const queryClient = useQueryClient();

	const { mutate: updateStatus } = useMutation({
		mutationFn: async ({
			orderId,
			status,
		}: { orderId: string; status: "SHIPPED" | "DELIVERED" }) => {
			const result = await updateShippingStatus({
				data: {
					orderId,
					status,
				},
			});

			if (!result.success) throw new Error(result.message);
			return result.data;
		},
		onSuccess: async (data) => {
			toast.success(`Order marked as ${data.status.toLowerCase()}`);
			await queryClient.invalidateQueries({
				queryKey: getArtistOrdersQueryOptions().queryKey,
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const {
		data: { orders },
	} = useSuspenseQueryDeferred({
		...getArtistOrdersQueryOptions(),
		queryFn: async () => {
			const res = await getArtistOrders();
			return res;
		},
	});

	function getStatusBadgeIntent(status: ShippingStatus) {
		switch (status.toLowerCase()) {
			case "delivered":
				return "success";
			case "pending":
				return "warning";
			default:
				return "info";
		}
	}

	function handleUpdateStatus(
		orderId: string,
		status: "SHIPPED" | "DELIVERED",
	) {
		updateStatus({ orderId, status });
	}

	function renderMenuContent(orderId: string, status: ShippingStatus) {
		if (status === ShippingStatus.DELIVERED) return null;

		return (
			<Menu.Content respectScreen={false} showArrow placement="left top">
				{status === ShippingStatus.PENDING && (
					<>
						<Menu.Item
							className="text-sm"
							onAction={() =>
								handleUpdateStatus(orderId, ShippingStatus.SHIPPED)
							}
						>
							<Icons.ShippingTruck />
							Mark as shipped
						</Menu.Item>
						<Menu.Item
							className="text-sm"
							onAction={() =>
								handleUpdateStatus(orderId, ShippingStatus.DELIVERED)
							}
						>
							<Icons.PackageDelivered />
							Mark as delivered
						</Menu.Item>
					</>
				)}
				{status === ShippingStatus.SHIPPED && (
					<Menu.Item
						className="text-sm"
						onAction={() =>
							handleUpdateStatus(orderId, ShippingStatus.DELIVERED)
						}
					>
						<Icons.PackageDelivered />
						Mark as delivered
					</Menu.Item>
				)}
			</Menu.Content>
		);
	}

	return (
		<div>
			<div>
				<Heading>Orders</Heading>
				<Description>Manage and track all your orders in one place</Description>
			</div>
			<div className="mt-6">
				<Card>
					<Table aria-label="Orders">
						<Table.Header>
							<Table.Column>Order ID</Table.Column>
							<Table.Column>Date</Table.Column>
							<Table.Column>Artwork</Table.Column>
							<Table.Column isRowHeader>Customer</Table.Column>
							<Table.Column>Quantity</Table.Column>
							<Table.Column>Unit Price</Table.Column>
							<Table.Column>Discount</Table.Column>
							<Table.Column>Platform Fee</Table.Column>
							<Table.Column>Final Price</Table.Column>
							<Table.Column>Amount Received</Table.Column>
							<Table.Column>Status</Table.Column>
							<Table.Column />
						</Table.Header>
						<Table.Body
							items={orders}
							renderEmptyState={() => (
								<div className="flex flex-col items-center justify-center p-4">
									<p className="text-fg text-base mb-1 font-semibold">
										No orders found
									</p>
									<p className="text-muted-fg text-sm text-center">
										<Balancer className="max-w-[350px]">
											You don't have any orders yet. Orders will appear here
											once customers purchase your artworks.
										</Balancer>
									</p>
								</div>
							)}
						>
							{(order) => (
								<Table.Row id={order.id}>
									<Table.Cell>{order.id}</Table.Cell>
									<Table.Cell>
										{new Date(order.createdAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<div>
											<div className="font-medium">{order.title}</div>
											<div className="text-sm text-gray-500 truncate max-w-[200px]">
												{order.description}
											</div>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div>
											<div className="font-medium">{order.customerName}</div>
											<div className="text-sm text-gray-500">
												{order.customerEmail}
											</div>
										</div>
									</Table.Cell>
									<Table.Cell>{order.quantity}</Table.Cell>
									<Table.Cell>{order.price}</Table.Cell>
									<Table.Cell>
										{order.discountAmount ? order.discountAmount : "Nil"}
									</Table.Cell>
									<Table.Cell>{order.platformFee}</Table.Cell>
									<Table.Cell>{order.finalPrice}</Table.Cell>
									<Table.Cell>
										{(
											Number(order.finalPrice) - Number(order.platformFee)
										).toFixed(2)}
									</Table.Cell>
									<Table.Cell>
										<Badge
											intent={getStatusBadgeIntent(order.shippingStatus)}
											shape="circle"
										>
											{order.shippingStatus.charAt(0).toUpperCase() +
												order.shippingStatus.slice(1).toLowerCase()}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										{order.shippingStatus !== "DELIVERED" && (
											<Menu>
												<Menu.Trigger>
													<IconDotsVertical />
												</Menu.Trigger>
												{renderMenuContent(order.id, order.shippingStatus)}
											</Menu>
										)}
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table>
				</Card>
			</div>
		</div>
	);
}
