import { Icons } from "@/components/icons";
import { Table } from "@/components/ui/table";
import { mockDiscounts } from "@/mocks/discount-data";
import { formatDate } from "@/utils/misc";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistDiscounts$ } from "@server/artist";
import { getArtistDiscountsQueryOptions } from "@server/query-options";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { IconPencilBox, IconTrash } from "justd-icons";
import { Badge, Description, Heading, buttonStyles } from "ui";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/discounts",
)({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getArtistDiscountsQueryOptions()),
});

function RouteComponent() {
	const getArtistDiscount = useServerFn(getArtistDiscounts$);
	const { data } = useSuspenseQueryDeferred({
		...getArtistDiscountsQueryOptions(),
		queryFn: async () => await getArtistDiscount(),
	});

	const discounts = mockDiscounts;

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<Heading>Discounts</Heading>
					<Description>
						Create and manage discount codes for your artworks
					</Description>
				</div>
				<Link
					className={buttonStyles({ shape: "circle", size: "small" })}
					// to="/dashboard/discounts/new"
				>
					<Icons.Discount />
					Create Discount
				</Link>
			</div>

			<div className="rounded-md border">
				<Table>
					<Table.Header>
						<Table.Column isRowHeader>Code</Table.Column>
						<Table.Column>Description</Table.Column>
						<Table.Column>Discount</Table.Column>
						<Table.Column>Valid Period</Table.Column>
						<Table.Column>Usage</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Actions</Table.Column>
					</Table.Header>
					<Table.Body items={discounts}>
						{(discount) => (
							<Table.Row key={discount.id}>
								<Table.Cell>
									<code className="rounded bg-muted px-2 py-1">
										{discount.code}
									</code>
								</Table.Cell>
								<Table.Cell>{discount.description}</Table.Cell>
								<Table.Cell>{discount.percentage}% off</Table.Cell>
								<Table.Cell>
									<div className="flex flex-col">
										<span>From: {formatDate(discount.startDate)}</span>
										<span>To: {formatDate(discount.endDate)}</span>
									</div>
								</Table.Cell>
								<Table.Cell>
									{discount.usedCount}
									{discount.maxUses ? ` / ${discount.maxUses}` : " / ∞"} uses
								</Table.Cell>
								<Table.Cell>
									<Badge
										intent={discount.isValid ? "success" : "danger"}
										shape="circle"
									>
										{discount.isValid ? "Active" : "Inactive"}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									<div className="flex items-center gap-2">
										<button
											type="button"
											className={buttonStyles({
												appearance: "plain",
												size: "square-petite",
											})}
											title="Edit discount"
										>
											<IconPencilBox />
										</button>
										<button
											type="button"
											className={buttonStyles({
												appearance: "plain",
												size: "square-petite",
											})}
											title="Delete discount"
										>
											<IconTrash />
										</button>
									</div>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</div>
		</div>
	);
}
