import {
	ARTWORK_CATEGORIES,
	ARTWORK_CONDITIONS,
	camelCaseToTitleCase,
} from "@/utils/misc";
import { createArtworkSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
	const [previousStock, setPreviousStock] = useState<number | null>(null);
	const {
		control,
		formState: { errors },
		handleSubmit,
		getValues,
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
			isUnlimitedStock: false,
			stock: null,
		},
	});

	const onSubmit = (data: z.infer<typeof createArtworkSchema>) => {
		console.log(data);
	};

	const unlimitedStock = watch("isUnlimitedStock");
	const stock = watch("stock");

	useEffect(() => {
		console.log(errors);
		console.log(unlimitedStock, stock);
	}, [errors, unlimitedStock, stock]);

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
							{!watch("isUnlimitedStock") && (
								<Controller
									control={control}
									name="stock"
									render={({ field: { value, ...field } }) => (
										<NumberField
											label="Quantity"
											step={1}
											value={value || undefined}
											isInvalid={!!errors.stock}
											errorMessage={errors.stock?.message}
											{...field}
										/>
									)}
								/>
							)}
							<div>
								<Controller
									control={control}
									name="isUnlimitedStock"
									render={({ field: { value, onChange, ...rest } }) => (
										<Checkbox
											{...rest}
											isSelected={value}
											onChange={(value) => {
												onChange(value);
												if (value) {
													// Store current stock value before setting it to null so if the user disable it so we can set the value back to the previous value they set before enabling unlimited stock
													setPreviousStock(getValues("stock"));
													setValue("stock", null);
												} else {
													// Restore previous stock value, or keep it null if there wasn't one
													setValue("stock", previousStock);
												}
											}}
											isInvalid={!!errors.isUnlimitedStock}
										>
											Unlimited Stock
										</Checkbox>
									)}
								/>
								{errors.isUnlimitedStock && (
									<p className="text-danger-fg text-xs mt-1">
										{errors.isUnlimitedStock?.message}
									</p>
								)}
							</div>
							<Controller
								control={control}
								name="category"
								render={({ field: { ref, value, onChange, ...field } }) => (
									<Select
										label="Category"
										placeholder="Select a category"
										selectedKey={value}
										onSelectionChange={onChange}
										{...field}
										selectRef={ref}
										isInvalid={!!errors.category}
										errorMessage={errors.category?.message}
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
								render={({ field: { ref, value, onChange, ...field } }) => (
									<Select
										label="Condition"
										placeholder="Select artwork condition"
										selectedKey={value}
										onSelectionChange={onChange}
										{...field}
										selectRef={ref}
										isInvalid={!!errors.condition}
										errorMessage={errors.condition?.message}
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
