import { createArtistProfileSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArtist$, validateBank$ } from "@server/artist";
import { validateCreateArtistAccess$ } from "@server/auth";
import { getBanksQueryOptions } from "@server/paystack";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, isRedirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Button,
	Card,
	Form,
	FormControl,
	FormField,
	FormItem,
	Note,
	Select,
	TextField,
	Textarea,
} from "ui";
import { z } from "zod";

const searchParamsSchema = z.object({
	accountNumber: fallback(
		z
			.number()
			.refine((val) => val.toString().length === 10, "Invalid account number")
			.optional(),
		undefined,
	),
	bankCode: fallback(z.string().min(1).optional(), undefined),
});

export const Route = createFileRoute("/create-artist")({
	validateSearch: zodValidator(searchParamsSchema),
	beforeLoad: async () => {
		await validateCreateArtistAccess$({
			data: {
				redirectTo: "/sign-in",
			},
		});
	},
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData(getBanksQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [isEditing, setIsEditing] = useState(false);
	const validateBank = useServerFn(validateBank$);
	const createArtist = useServerFn(createArtist$);
	const { data: banks } = useSuspenseQuery(getBanksQueryOptions());
	const uniqueBanks = banks.filter(
		(bank, index, self) =>
			index === self.findIndex((t) => t.code === bank.code),
	);
	const form = useForm<z.infer<typeof createArtistProfileSchema>>({
		resolver: zodResolver(createArtistProfileSchema),
		defaultValues: {
			name: "",
			portfolioUrl: "",
			bio: "",
			accountNumber: "",
			bankCode: "",
		},
	});

	const {
		mutate: validateBankMutate,
		isPending: validateBankIsPending,
		data: validatedBank,
	} = useMutation({
		mutationKey: ["validate-bank"],
		mutationFn: async (values: z.infer<typeof createArtistProfileSchema>) => {
			const res = await validateBank({
				data: values,
			});

			if (!res.success) throw new Error(res.message);

			return res.data;
		},

		onError: (error) => {
			form.setError("root", { message: error.message });
		},
	});

	const { mutate: createArtistMutate, isPending: createArtistIsPending } =
		useMutation({
			mutationKey: ["create-artist"],
			mutationFn: async (values: z.infer<typeof createArtistProfileSchema>) => {
				const res = await createArtist({ data: values });

				if (!res.data) throw new Error(res.message);
			},
			onError: (error) => {
				if (isRedirect(error)) {
					return;
				}

				toast.error(error.message);
			},
		});

	const onSubmit = (values: z.infer<typeof createArtistProfileSchema>) => {
		setIsEditing(false);
		validateBankMutate(values);
	};

	// Reset validation data and enable editing
	const handleEdit = () => {
		setIsEditing(true);
	};

	if (validatedBank && !isEditing) {
		return (
			<div className="p-4 sm:max-w-lg mx-auto">
				<Card>
					<Card.Header>Bank details validated</Card.Header>
					<Card.Content>
						<Note intent="success">
							Your bank details have been validated for account name:{" "}
							<span className="font-medium">{validatedBank.account_name}</span>.
							You can now create your artist profile.
						</Note>
						<div className="mt-6 flex flex-col gap-2">
							<Button
								appearance="outline"
								shape="circle"
								className="w-full"
								size="small"
								onPress={handleEdit}
							>
								Edit Details
							</Button>
							<Button
								size="small"
								shape="circle"
								className="w-full"
								onPress={() => createArtistMutate(form.getValues())}
								isPending={createArtistIsPending}
							>
								{({ isPending }) =>
									isPending ? "Creating..." : "Create profile"
								}
							</Button>
						</div>
					</Card.Content>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-4 sm:max-w-lg mx-auto">
			<Card>
				<Card.Header>
					<Card.Title>Create your artist profile</Card.Title>
					<Card.Description className="leading-tight text-sm">
						Fill out the form below to create your artist profile.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							{form.formState.errors.root?.message && (
								<Note intent="danger">
									{form.formState.errors.root.message}
								</Note>
							)}
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormControl>
												<TextField
													{...field}
													label="Name"
													isInvalid={!!error}
													errorMessage={error?.message}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="portfolioUrl"
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormControl>
												<TextField
													{...field}
													label="Portfolio URL (optional)"
													isInvalid={!!error}
													errorMessage={error?.message}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="bio"
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormControl>
												<Textarea
													{...field}
													label="Bio"
													isInvalid={!!error}
													errorMessage={error?.message}
													className="min-h-[6.25rem]"
													placeholder="Tell us about yourself"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="accountNumber"
									render={({ field, fieldState: { error } }) => (
										<FormItem>
											<FormControl>
												<TextField
													{...field}
													label="Account Number"
													isInvalid={!!error}
													errorMessage={error?.message}
													inputMode="numeric"
													maxLength={10}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<Controller
									control={form.control}
									name="bankCode"
									render={({ field, fieldState: { error } }) => (
										<Select
											label="Bank"
											placeholder="Select your bank"
											selectedKey={field.value}
											onSelectionChange={field.onChange}
											selectRef={field.ref}
											isInvalid={!!error}
											errorMessage={error?.message}
										>
											<Select.Trigger />
											<Select.List
												items={uniqueBanks}
												className="w-[--trigger-width]"
											>
												{(bank) => (
													<Select.Option
														id={bank.code}
														textValue={bank.name}
														className={"text-sm"}
													>
														<span className="text-sm truncate capitalize">
															{bank.name.toLowerCase()}
														</span>
													</Select.Option>
												)}
											</Select.List>
										</Select>
									)}
								/>
							</div>
							<Button
								size="small"
								shape="circle"
								type="submit"
								className="w-full mt-6"
								isPending={validateBankIsPending}
							>
								{({ isPending }) =>
									isPending ? "Validating..." : "Create profile"
								}
							</Button>
						</form>
					</Form>
				</Card.Content>
			</Card>
		</div>
	);
}
