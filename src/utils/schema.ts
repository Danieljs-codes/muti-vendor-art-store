import type { DateValue } from "react-aria";
import { z } from "zod";
import { ARTWORK_CATEGORIES, ARTWORK_CONDITIONS } from "./misc";

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

// https://github.com/colinhacks/zod/issues/479
const stockSchema = z
	.object({
		isUnlimitedStock: z.boolean().default(false),
		stock: z
			.number({
				invalid_type_error: "A number is required",
			})
			.nullable()
			.default(null),
	})
	.refine(
		(data) => {
			if (data.isUnlimitedStock) return true;
			return typeof data.stock === "number" && data.stock > 0;
		},
		{
			message: "Enable unlimited stock or specify a valid quantity",
			path: ["stock"],
		},
	);

const artworkBaseSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" }),
	price: z
		.number({
			required_error: "Price is required",
		})
		.positive({ message: "Price must be greater than 0" }),
	dimensions: z
		.string()
		.regex(/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/, {
			message: "Dimensions must be in format: length x width x height",
		}),
	weight: z.number().positive({ message: "Weight must be greater than 0" }),
	condition: z.enum(ARTWORK_CONDITIONS),
	category: z.enum(ARTWORK_CATEGORIES),
	images: z
		.array(z.instanceof(File), {
			required_error: "At least 2 images are required",
		})
		.min(2, { message: "At least 2 images are required" })
		.max(4, { message: "Maximum of 4 images allowed" }),
});

export const createArtworkSchema = z.intersection(
	artworkBaseSchema,
	stockSchema,
);

export const createArtworkFormSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" }),
	price: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: "Price must be a valid number greater than 0",
		}),
	dimensions: z
		.string()
		.regex(/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/, {
			message: "Dimensions must be in format: length x width x height",
		}),
	weight: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
			message: "Weight must be a valid number greater than 0",
		}),
	condition: z.enum(ARTWORK_CONDITIONS),
	category: z.enum(ARTWORK_CATEGORIES),
	isUnlimitedStock: z.string().transform((val) => val === "true"),
	stock: z
		.string()
		.nullable()
		.refine(
			(val) => val === null || (!Number.isNaN(Number(val)) && Number(val) > 0),
			{
				message: "Stock must be a valid number greater than 0",
			},
		)
		.transform((val) => (val ? Number(val) : null))
		.default(null),
	images: z
		.array(z.instanceof(File))
		.min(2, { message: "At least 2 images are required" })
		.max(4, { message: "Maximum of 4 images allowed" }),
});

// TODO: This has to be @internationlized/date
export const createDiscountSchema = z.object({
	code: z
		.string()
		.min(3, "Code must be at least 3 characters")
		.max(50, "Code must be less than 50 characters")
		.regex(
			/^[A-Z0-9_-]+$/,
			"Code must contain only uppercase letters, numbers, underscores and dashes",
		),
	description: z
		.string()
		.min(3, "Description must be at least 3 characters")
		.max(255, "Description must be less than 255 characters"),
	discountPercent: z
		.number()
		.min(1, "Discount must be at least 1%")
		.max(100, "Discount cannot exceed 100%"),
	maxUses: z.number().optional(),
	validityPeriod: z
		.object({
			startDate: z.custom<DateValue>(),
			endDate: z.custom<DateValue>(),
		})
		.refine(
			(data) => {
				if (!data.startDate || !data.endDate) return false;

				return true;
			},
			{
				message: "Validity period is required",
			},
		)
		.refine(
			(data) => {
				if (!data.startDate || !data.endDate) return false;
				return data.endDate.compare(data.startDate) > 0;
			},
			{
				message: "End date must be after start date",
			},
		),
});
