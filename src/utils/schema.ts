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

export const createArtistProfileSchema = z.object({
	name: z.string().min(3, { message: "Name must be at least 3 characters" }),
	portfolioUrl: z.string().refine(
		(val) => {
			if (!val) return true;
			if (val?.startsWith("http")) return true;
			return false;
		},
		{
			message: "Invalid URL",
		},
	),
	bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
	accountNumber: z
		.string()
		.length(10, { message: "Account number must be 10 digits" }),
	// The bank code should be from paystack
	bankCode: z.string().min(1, { message: "Bank code is required" }),
});
