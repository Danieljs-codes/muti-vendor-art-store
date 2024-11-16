import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
	rememberMe: z.boolean().optional(),
});

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(3, { message: "Name must be at least 3 characters" })
			.refine(
				(value) => {
					const parts = value.trim().split(/\s+/);
					return parts.length >= 2 && parts.every((part) => part.length >= 1);
				},
				{
					message: "Please enter both first and last name separated by a space",
				},
			),
		email: z.string().email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
