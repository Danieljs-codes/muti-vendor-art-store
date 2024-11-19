import { Card, Table } from "ui";
import { Skeleton } from "./ui/skeleton";

export function RecentSalesTableSkeleton() {
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
				<Table.Body>
					{Array.from({ length: 5 }).map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Just a static data
						<Table.Row id={index} key={index}>
							<Table.Cell>
								<Skeleton className="h-4 w-16" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-32" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-8" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-24" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-40" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-8" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-20" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-20" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-20" />
							</Table.Cell>
							<Table.Cell>
								<Skeleton className="h-4 w-24" />
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</Card>
	);
}