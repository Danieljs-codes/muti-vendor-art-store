import { createArtworkSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { Card, NumberField, Textarea, TextField } from "ui";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks-new",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { control } = useForm({
		resolver: zodResolver(createArtworkSchema),
	});

	return (
		<div>
			<Card>
				<Card.Header>
					<Card.Title>Artwork</Card.Title>
					<Card.Description>Create a new artwork</Card.Description>
				</Card.Header>
				<Card.Content>
					<form method="POST">
						<div className="space-y-4">
							<Controller
								control={control}
								name="title"
								render={({ field }) => (
									<TextField
										label="Title"
										placeholder="Enter artwork title"
										{...field}
									/>
								)}
							/>
							<Controller
								control={control}
								name="description"
								render={({ field }) => (
									<Textarea
										label="Description"
										placeholder="Enter artwork description"
										className="min-h-[5rem]"
										{...field}
									/>
								)}
							/>
							<Controller
								control={control}
								name="price"
								render={({ field }) => (
									<NumberField
										label="Price"
										step={100}
										minValue={100}
										formatOptions={{
											style: "currency",
											currency: "NGN",
											currencyDisplay: "narrowSymbol",
										}}
										{...field}
									/>
								)}
							/>
							<Controller
								control={control}
								name="dimensions"
								render={({ field }) => (
									<TextField
										label="Dimensions"
										description="Length x Width x Height"
										descriptionClassName="text-muted-fg text-xs"
										{...field}
									/>
								)}
							/>
							<Controller
								control={control}
								name="weight"
								render={({ field }) => (
									<NumberField
										label="Weight"
										step={0.1}
										minValue={0.1}
										formatOptions={{
											style: "unit",
											unit: "kilogram",
											unitDisplay: "narrow",
										}}
										{...field}
									/>
								)}
							/>
							<Controller
								control={control}
								name="stock"
								render={({ field }) => (
									<NumberField label="Quantity" step={1} {...field} />
								)}
							/>
						</div>
					</form>
				</Card.Content>
			</Card>
		</div>
	);
}
