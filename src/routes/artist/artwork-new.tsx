import {
	ARTWORK_CATEGORIES,
	ARTWORK_CONDITIONS,
	camelCaseToTitleCase,
} from "@/utils/misc";
import { createArtworkSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
	Button,
	Card,
	Checkbox,
	NumberField,
	Select,
	Textarea,
	TextField,
} from "ui";
import type { z } from "zod";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks-new",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		watch,
	} = useForm<z.infer<typeof createArtworkSchema>>({
		resolver: zodResolver(createArtworkSchema),
		defaultValues: {
			title: "",
			description: "",
			category: undefined,
			weight: undefined,
			dimensions: "",
			price: undefined,
			condition: undefined,
			stock: undefined,
			unlimitedStock: false,
		},
	});

  const onSubmit = (data: z.infer<typeof createArtworkSchema>) => {
			console.log(data);
		};

	return (
		<div>
			<Card>
				<Card.Header>
					<Card.Title>Artwork</Card.Title>
					<Card.Description>Create a new artwork</Card.Description>
				</Card.Header>
				<Card.Content>
					<form method="POST" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-4">
							<Controller
								control={control}
								name="title"
								render={({ field }) => (
									<TextField
										label="Title"
										placeholder="Enter artwork title"
										isInvalid={!!errors.title}
										errorMessage={errors.title?.message}
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
										isInvalid={!!errors.description}
										errorMessage={errors.description?.message}
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
										isInvalid={!!errors.price}
										errorMessage={errors.price?.message}
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
										description="Length x Width x Height (in inches)"
										descriptionClassName="text-muted-fg text-xs"
										isInvalid={!!errors.dimensions}
										errorMessage={errors.dimensions?.message}
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
										isInvalid={!!errors.weight}
										errorMessage={errors.weight?.message}
										{...field}
									/>
								)}
							/>
							{!watch("unlimitedStock") && (
								<Controller
									control={control}
									name="stock"
									render={({ field: { value, ...field } }) => (
										<NumberField
											label="Quantity"
											step={1}
											minValue={1}
											value={value ?? undefined}
											{...field}
										/>
									)}
								/>
							)}
							<Controller
								control={control}
								name="unlimitedStock"
								render={({ field: { value, onChange, ...rest } }) => (
									<Checkbox
										{...rest}
										isSelected={value}
										onChange={(value) => {
											onChange(value);
											if (value) {
												setValue("stock", null);
											} else {
												setValue("stock", 1);
											}
										}}
									>
										Unlimited Stock
									</Checkbox>
								)}
							/>
							<Controller
								control={control}
								name="category"
								render={({ field: { ref, ...field } }) => (
									<Select
										label="Category"
										placeholder="Select a category"
										{...field}
										selectRef={ref}
									>
										<Select.Trigger />
										<Select.List
											items={ARTWORK_CATEGORIES.map((category) => ({
												value: category,
												label: category,
											}))}
										>
											{(category) => (
												<Select.Option
													id={category.value}
													textValue={category.label}
													className="text-sm capitalize"
												>
													{camelCaseToTitleCase(category.label.toLowerCase())}
												</Select.Option>
											)}
										</Select.List>
									</Select>
								)}
							/>
							<Controller
								control={control}
								name="condition"
								render={({ field: { ref, ...field } }) => (
									<Select
										label="Condition"
										placeholder="Select artwork condition"
										{...field}
										selectRef={ref}
									>
										<Select.Trigger />
										<Select.List
											items={ARTWORK_CONDITIONS.map((condition) => ({
												value: condition,
												label: condition,
											}))}
										>
											{(condition) => (
												<Select.Option
													id={condition.value}
													textValue={condition.label}
													className="text-sm capitalize"
												>
													{camelCaseToTitleCase(condition.label.toLowerCase())}
												</Select.Option>
											)}
										</Select.List>
									</Select>
								)}
							/>
						</div>
						<div className="flex justify-end mt-6">
							<Button type="submit">Submit</Button>
						</div>
					</form>
				</Card.Content>
			</Card>
		</div>
	);
}
