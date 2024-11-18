import { Icons } from "@/components/icons";
import { formatCurrency } from "@/utils/misc";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card } from "ui";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/overview",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title className="text-sm font-medium">Total Revenue</Card.Title>
					<Icons.MoneyReceived className="size-4 text-muted-fg" />
				</Card.Header>
				<Card.Content>
					<div className="text-2xl font-bold">
						{formatCurrency({ amount: 4523189, isKobo: true })}
					</div>
					<div className="text-xs text-muted-fg mt-1 flex items-center gap-x-1">
						<Badge intent="success" shape="circle">
							<Icons.Increase />
							20.1%
						</Badge>{" "}
						<span>from last month</span>
					</div>
				</Card.Content>
			</Card>
		</div>
	);
}
