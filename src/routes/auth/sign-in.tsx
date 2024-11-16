import { signInSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import {
	Button,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	TextField,
} from "ui";
import type { z } from "zod";

export const Route = createFileRoute("/_auth-layout-id/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof signInSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<div>
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold">Sign in to your account</h1>
				<p className="text-sm text-muted-fg mt-2">
					Sign in to start renting cars, list your vehicles for rent, and manage
					your rental bookings.
				</p>
			</div>
			<div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field, fieldState: { error } }) => (
									<FormItem>
										<FormControl>
											<TextField
												{...field}
												label="Email"
												isInvalid={!!error}
												errorMessage={error?.message}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field, fieldState: { error } }) => (
									<FormItem>
										<FormControl>
											<TextField
												{...field}
												label="Password"
												type="password"
												isInvalid={!!error}
												errorMessage={error?.message}
												isRevealable
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rememberMe"
								render={({ field: { value, onChange, ...rest } }) => (
									<FormItem>
										<FormControl>
											<Checkbox
												isSelected={value}
												onChange={onChange}
												{...rest}
											>
												Remember Me
											</Checkbox>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" size="small" className="w-full mt-6">
							Sign in
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
