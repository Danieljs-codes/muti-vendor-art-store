import { createDiscountSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { Button, DateRangePicker, Modal, NumberField, TextField } from "ui";
import type { z } from "zod";

type FormData = z.infer<typeof createDiscountSchema>;

export const NewDiscountModal = ({
	isOpen,
	onOpenChange,
	onSubmit,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onSubmit?: (data: FormData) => Promise<void> | void;
}) => {
	const now = today(getLocalTimeZone());
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		clearErrors,
	} = useForm<FormData>({
		resolver: zodResolver(createDiscountSchema),
		defaultValues: {
			code: "",
			description: "",
			discountPercent: undefined,
			maxUses: undefined,
			validityPeriod: {
				startDate: undefined,
				endDate: undefined,
			},
		},
	});

	const onFormSubmit = async (data: FormData) => {
		try {
			await onSubmit?.(data);
			onOpenChange?.(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Modal>
			<Modal.Content
				isOpen={isOpen}
				onOpenChange={(val) => {
					clearErrors();
					onOpenChange(val);
				}}
			>
				<form onSubmit={handleSubmit(onFormSubmit)}>
					<Modal.Header>
						<Modal.Title>New Discount</Modal.Title>
						<Modal.Description>
							Create a new discount to apply to your artworks.
						</Modal.Description>
					</Modal.Header>

					<Modal.Body>
						<div className="flex flex-col gap-4">
							<Controller
								control={control}
								name="code"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Code"
										placeholder="Enter discount code"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
										description="This code will be used to apply the discount"
									/>
								)}
							/>

							<Controller
								control={control}
								name="description"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Description"
										placeholder="Enter description"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
										description="Internal description for this discount"
									/>
								)}
							/>

							<Controller
								control={control}
								name="discountPercent"
								render={({ field, fieldState }) => (
									<NumberField
										{...field}
										label="Discount Percentage"
										placeholder="Enter discount percentage"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
										description="Percentage off the original price"
										minValue={1}
										maxValue={100}
										formatOptions={{
											signDisplay: "never",
											minimumFractionDigits: 0,
											maximumFractionDigits: 0,
										}}
									/>
								)}
							/>

							<Controller
								control={control}
								name="maxUses"
								render={({ field, fieldState }) => (
									<NumberField
										{...field}
										label="Maximum Uses"
										placeholder="Enter maximum uses"
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
										description="Leave empty for unlimited uses"
										minValue={1}
									/>
								)}
							/>
							<Controller
								control={control}
								name="validityPeriod"
								render={({
									field: { onChange, ref, value, ...field },
									fieldState,
								}) => (
									<DateRangePicker
										label="Validity Period"
										isDateUnavailable={(date) => date.compare(now) < 0}
										value={
											value
												? {
														start: value.startDate,
														end: value.endDate,
													}
												: null
										}
										onChange={(val) => {
											onChange({
												startDate: val?.start,
												endDate: val?.end,
											});
										}}
										dateRef={ref}
										{...field}
										isInvalid={!!fieldState.error}
										errorMessage={fieldState.error?.message}
									/>
								)}
							/>
						</div>
					</Modal.Body>

					<Modal.Footer>
						<Modal.Close size="small">Cancel</Modal.Close>
						<Button
							type="submit"
							intent="primary"
							isPending={isSubmitting}
							size="small"
						>
							Create Discount
						</Button>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal>
	);
};
