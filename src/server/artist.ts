import { PAYSTACK_PERCENTAGE_CHARGE } from "@/utils/const";
import { createArtistProfileSchema } from "@/utils/schema";
import { paystack } from "@server/paystack";
import { createMiddleware, createServerFn } from "@tanstack/start";
import { validateUserMiddleware } from "./middlewares/auth";
import { db } from "./database";
import { setCookieAndRedirect } from "./utils";
import { maybeArtistMiddleware } from "./middlewares/artist";

const validateBankSchema = createArtistProfileSchema.pick({
	bankCode: true,
	accountNumber: true,
});

export const validateBank$ = createServerFn()
	.validator(validateBankSchema)
	.handler(async ({ data }) => {
		const res = await paystack.verification.resolveAccount({
			account_number: data.accountNumber,
			bank_code: data.bankCode,
		});

		if (!res.data)
			return {
				success: false as const,
				message: "Invalid bank details",
				data: null,
			};

		return {
			success: true as const,
			message: "Bank details validated successfully",
			data: res.data,
		};
	});

export const createArtist$ = createServerFn()
	.middleware([maybeArtistMiddleware])
	.validator(createArtistProfileSchema)
	.handler(async ({ data, context }) => {
		const { artist, user } = context;

		if (artist) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "Artist profile already exists",
					redirectTo: "/",
				},
			});
		}

		// Create subaccount for artist
		const res = await paystack.subAccount.create({
			account_number: data.accountNumber,
			business_name: data.name,
			percentage_charge: PAYSTACK_PERCENTAGE_CHARGE,
			settlement_bank: data.bankCode,
			description: `Subaccount for ${data.name}`,
		});

		if (!res.data) {
			return {
				success: false as const,
				message: "Failed to create subaccount",
				data: null,
			};
		}

		// Create artist profile
		await db
			.insertInto("artist")
			.values({
				bio: data.bio,
				paystackSubAccountCode: res.data.subaccount_code,
				userId: user.id,
				name: data.name,
				portfolioUrl: data.portfolioUrl,
				id: crypto.randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.execute();

		// TODO: Redirect to their dashboard
		throw await setCookieAndRedirect({
			data: {
				intent: "success",
				message: "Artist profile created successfully",
				redirectTo: "/",
			},
		});
	});
