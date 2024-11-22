import { Icons } from "@/components/icons";
import { NewDiscountModal } from "@/components/new-discount-modal";
import { Table } from "@/components/ui/table";
import { formatDate } from "@/utils/misc";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistDiscounts$ } from "@server/artist";
import { getArtistDiscountsQueryOptions } from "@server/query-options";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { IconPencilBox, IconTrash } from "justd-icons";
import { useState } from "react";
import { Badge, Button, Card, Description, Heading, buttonStyles } from "ui";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/discounts",
)({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getArtistDiscountsQueryOptions()),
});

function RouteComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const getArtistDiscount = useServerFn(getArtistDiscounts$);
	const {
		data: { discounts },
	} = useSuspenseQueryDeferred({
		...getArtistDiscountsQueryOptions(),
		queryFn: async () => await getArtistDiscount(),
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<Heading>Discounts</Heading>
					<Description>
						Create and manage discount codes for your artworks
					</Description>
				</div>
				<Button
					size="small"
					shape="circle"
					onPress={() => setIsModalOpen(true)}
				>
					<Icons.Discount />
					Create Discount
				</Button>
			</div>

			<Card>
				<Table aria-label="Discounts">
					<Table.Header>
						<Table.Column isRowHeader>Code</Table.Column>
						<Table.Column>Description</Table.Column>
						<Table.Column>Discount</Table.Column>
						<Table.Column>Valid Period</Table.Column>
						<Table.Column>Usage</Table.Column>
						<Table.Column>Status</Table.Column>
						<Table.Column>Actions</Table.Column>
					</Table.Header>
					<Table.Body
						items={discounts}
						renderEmptyState={() => (
							<div className="flex flex-col items-center justify-center p-4">
								<p className="text-fg text-base mb-1 font-semibold">
									No discounts found
								</p>
								<p className="text-muted-fg text-sm text-center max-w-[350px] text-pretty">
									You haven't created any discounts yet. Start by creating your
									first discount code.
								</p>
							</div>
						)}
					>
						{(discount) => (
							<Table.Row id={discount.id}>
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
			</Card>
			<NewDiscountModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
		</div>
	);
}
