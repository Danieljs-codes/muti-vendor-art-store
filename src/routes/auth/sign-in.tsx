import { signIn$ } from "@/server/auth";
import { signInSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { useForm } from "react-hook-form";
import { useSpinDelay } from "spin-delay";
import {
	Button,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	Link,
	Loader,
	Note,
	TextField,
} from "ui";
import type { z } from "zod";

export const Route = createFileRoute("/_auth-layout-id/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	const signIn = useServerFn(signIn$);
	// 1. Define your form.
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ["sign-in"],
		mutationFn: async (data: z.infer<typeof signInSchema>) => {
			const res = await signIn({
				data,
			});
			if (!res.success) {
				throw new Error(res.message);
			}

			return res;
		},
		onError: (error) => {
			form.setError("root", {
				message: error.message,
			});
		},
	});

	const isLoading = useSpinDelay(isPending, {
		minDuration: 500,
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof signInSchema>) {
		mutate(values);
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
						{form.formState.errors.root && (
							<Note intent="danger">{form.formState.errors.root.message}</Note>
						)}
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
												className="font-medium"
											>
												Remember Me
											</Checkbox>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button
							type="submit"
							size="small"
							className="w-full mt-6"
							isPending={isPending}
						>
							{isLoading ? <Loader variant="spin" /> : "Sign in"}
						</Button>
					</form>
				</Form>
			</div>
			<p className="text-sm text-muted-fg mt-6 text-center">
				Don't have an account?{" "}
				<Link intent="primary" href="/sign-up" className="font-medium">
					Sign up
				</Link>
			</p>
		</div>
	);
}
