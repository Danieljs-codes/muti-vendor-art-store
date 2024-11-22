import { PAYSTACK_PERCENTAGE_CHARGE } from "@/utils/const";
import { convertNairaToKobo, omit } from "@/utils/misc";
import {
	createArtistProfileSchema,
	createArtworkFormSchema,
} from "@/utils/schema";
import { paystack } from "@server/paystack";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { sql } from "kysely";
import { z } from "zod";
import { db } from "./database";
import { ShippingStatus } from "./enums";
import {
	maybeArtistMiddleware,
	validateArtistMiddleware,
} from "./middlewares/artist";
import { utapi } from "./uploadthing";
import { generateBlurhash, setCookieAndRedirect } from "./utils";

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

export const getArtistPendingOrders$ = createServerFn()
	.middleware([maybeArtistMiddleware])
	.handler(async ({ context }) => {
		const { artist } = context;

		if (!artist) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "Artist profile not found",
					redirectTo: "/",
				},
			});
		}

		const pendingOrders = await db
			.selectFrom("order")
			.innerJoin("orderItem", "orderItem.orderId", "order.id")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.innerJoin("image", "image.artworkId", "artwork.id")
			.where("artwork.artistId", "=", artist.id)
			.select([
				"order.id",
				"order.totalPrice",
				"order.shippingStatus",
				"orderItem.quantity",
				"orderItem.price",
				"orderItem.finalPrice",
				"orderItem.platformFee",
				"artwork.title",
				"image.url",
				"image.blurhash",
			])
			.execute();

		return {
			success: true as const,
			data: pendingOrders,
		};
	});

const getArtistDashboardStatsSchema = z.object({
	startDate: z.coerce
		.date()
		.default(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
	endDate: z.coerce.date().default(new Date()),
});

export const getArtistDashboardStats$ = createServerFn()
	.middleware([maybeArtistMiddleware])
	.validator(getArtistDashboardStatsSchema)
	.handler(async ({ context, data }) => {
		const { artist } = context;
		const { startDate, endDate } = data;

		if (!artist) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "Artist profile not found",
					redirectTo: "/",
				},
			});
		}

		// Get total revenue from completed orders in the date range
		const stats = await db
			.selectFrom("order")
			.innerJoin("orderItem", "orderItem.orderId", "order.id")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.where("artwork.artistId", "=", artist.id)
			.where("order.createdAt", ">=", startDate)
			.where("order.createdAt", "<=", endDate)
			.select([
				db.fn.sum("orderItem.finalPrice").as("totalRevenue"),
				db.fn.count("order.id").distinct().as("totalOrders"),
				db.fn.avg("orderItem.finalPrice").as("averageOrderValue"),
			])
			.executeTakeFirst();

		// Get total artworks sold in the date range
		const artworksSold = await db
			.selectFrom("orderItem")
			.innerJoin("order", "order.id", "orderItem.orderId")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.where("artwork.artistId", "=", artist.id)
			.where("order.createdAt", ">=", startDate)
			.where("order.createdAt", "<=", endDate)
			.select(db.fn.sum("orderItem.quantity").as("totalArtworksSold"))
			.executeTakeFirstOrThrow()
			.then((result) => Number(result.totalArtworksSold));

		return {
			success: true as const,
			data: {
				totalRevenue: Number(stats?.totalRevenue || 0),
				totalOrders: Number(stats?.totalOrders || 0),
				averageOrderValue: Number(stats?.averageOrderValue || 0),
				totalArtworksSold: artworksSold,
			},
		};
	});

export const getArtistRecentSales$ = createServerFn()
	.middleware([validateArtistMiddleware])
	.handler(async ({ context }) => {
		const { artist } = context;

		// Get artist last 5 sales
		const sales = await db
			.selectFrom("order")
			.innerJoin("orderItem", "orderItem.orderId", "order.id")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.innerJoin("user", "user.id", "order.userId")
			.innerJoin("image", "image.artworkId", "artwork.id")
			.where("artwork.artistId", "=", artist.id)
			.select([
				"order.id",
				"order.totalPrice",
				"order.shippingStatus",
				"orderItem.quantity",
				"orderItem.price",
				"orderItem.finalPrice",
				"orderItem.platformFee",
				"artwork.title",
				"image.url",
				"image.blurhash",
				"user.name as customerName",
				"user.email as customerEmail",
			])
			.orderBy("order.createdAt", "desc")
			.limit(5)
			.execute();

		return {
			success: true as const,
			data: sales,
		};
	});

const getArtistArtworksSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
	search: z.string().optional(),
});

export const getArtistArtworks$ = createServerFn()
	.middleware([validateArtistMiddleware])
	.validator(getArtistArtworksSchema)
	// @ts-expect-error - Don't know why this is happening
	.handler(async ({ context, data }) => {
		const { artist } = context;
		const { page, limit, search } = data;

		const offset = (page - 1) * limit;

		const [artworks, totalCount] = await Promise.all([
			db
				.selectFrom("artwork")
				.leftJoin("image", "image.artworkId", "artwork.id")
				.where("artwork.artistId", "=", artist.id)
				.where((eb) =>
					search
						? eb.or([
								eb("artwork.title", "ilike", `%${search}%`),
								eb("artwork.description", "ilike", `%${search}%`),
							])
						: eb.val(true),
				)
				.select((eb) => [
					"artwork.id",
					"artwork.title",
					"artwork.description",
					"artwork.price",
					"artwork.dimensions",
					"artwork.weight",
					"artwork.condition",
					"artwork.category",
					"artwork.stock",
					"artwork.createdAt",
					eb.fn.jsonAgg(sql.raw("image.url")).as("imageUrls"),
					eb.fn.jsonAgg(sql.raw("image.blurhash")).as("imageBlurhashes"),
				])
				.groupBy([
					"artwork.id",
					"artwork.title",
					"artwork.description",
					"artwork.price",
					"artwork.dimensions",
					"artwork.weight",
					"artwork.condition",
					"artwork.category",
					"artwork.stock",
					"artwork.createdAt",
				])
				.limit(limit)
				.offset(offset)
				.orderBy("artwork.createdAt", "desc")
				.execute(),
			db
				.selectFrom("artwork")
				.where("artwork.artistId", "=", artist.id)
				.select(db.fn.count("id").as("count"))
				.executeTakeFirstOrThrow()
				.then((result) => Number(result.count)),
		]);

		return {
			success: true as const,
			data: {
				artworks: artworks.map((artwork) => ({
					...artwork,
					createdAt: new Date(artwork.createdAt).toISOString(),
				})),
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(totalCount / limit),
					totalItems: totalCount,
				},
			},
		};
	});

export const createArtistArtwork$ = createServerFn({
	method: "POST",
})
	.middleware([validateArtistMiddleware])
	.validator((data) => {
		if (!(data instanceof FormData)) {
			throw new Error("Invalid form data");
		}
		const formData = Object.fromEntries(data.entries());
		const validatedFormData = createArtworkFormSchema.parse({
			...formData,
			images: data.getAll("images"),
		});

		// Transform to match createArtworkSchema
		return {
			title: validatedFormData.title,
			description: validatedFormData.description,
			price: Number(validatedFormData.price),
			dimensions: validatedFormData.dimensions,
			weight: Number(validatedFormData.weight),
			condition: validatedFormData.condition,
			category: validatedFormData.category,
			isUnlimitedStock: validatedFormData.isUnlimitedStock,
			stock: validatedFormData.stock,
			images: validatedFormData.images,
		};
	})
	.handler(async ({ data, context }) => {
		const { artist } = context;

		// Upload the images to uploadthing
		const response = await utapi.uploadFiles(data.images);

		// Process each uploaded image
		const start = performance.now();
		const processedImages = await Promise.all(
			response.map(async (file) => {
				if (file.error) {
					throw new Error("Failed to upload image");
				}
				const blurhash = await generateBlurhash({
					data: { imageBufferOrUrl: file.data.url },
				});

				return {
					blurhash,
					...file.data,
				};
			}),
		);
		const end = performance.now();
		console.log(`Time taken to process images: ${end - start}ms`);

		// Create the artwork
		const artwork = await db
			.insertInto("artwork")
			.values({
				id: crypto.randomUUID(),
				title: data.title,
				description: data.description,
				price: convertNairaToKobo(data.price),
				dimensions: data.dimensions,
				weight: data.weight,
				condition: data.condition,
				stock: data.isUnlimitedStock ? null : data.stock,
				artistId: artist.id,
				category: data.category,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		// Create the artwork images
		await db
			.insertInto("image")
			.values(
				processedImages.map((image) => ({
					id: crypto.randomUUID(),
					url: image.url,
					blurhash: image.blurhash,
					artworkId: artwork.id,
				})),
			)
			.execute();

		return {
			success: true as const,
			data: {
				artwork: omit(artwork, ["createdAt", "updatedAt"]),
			},
		};
	});

export const getArtworkById$ = createServerFn()
	.validator(z.object({ id: z.string() }))
	.middleware([validateArtistMiddleware])
	.handler(async ({ context, data }) => {
		const { artist } = context;

		// Get artwork by id
		const artwork = await db
			.selectFrom("artwork")
			.leftJoin("image", "image.artworkId", "artwork.id")
			.where("artwork.artistId", "=", artist.id)
			.where("artwork.id", "=", data.id)
			.select(({ fn }) => [
				"artwork.id",
				"artwork.title",
				"artwork.description",
				"artwork.price",
				"artwork.views",
				"artwork.dimensions",
				"artwork.weight",
				"artwork.condition",
				"artwork.category",
				"artwork.createdAt",
				"artwork.stock",
				"artwork.createdAt",
				fn.agg<string[]>("array_agg", ["image.url"]).as("images"),
				fn.agg<string[]>("array_agg", ["image.blurhash"]).as("blurhashes"),
			])
			.groupBy([
				"artwork.id",
				"artwork.title",
				"artwork.description",
				"artwork.price",
				"artwork.dimensions",
				"artwork.weight",
				"artwork.condition",
				"artwork.category",
				"artwork.createdAt",
				"artwork.stock",
			])
			.executeTakeFirst();

		if (!artwork) {
			throw notFound();
		}

		return {
			success: true as const,
			data: {
				artwork: {
					...artwork,
					createdAt: new Date(artwork.createdAt).toISOString(),
				},
			},
		};
	});

// TODO: Add filter for searching by Order ID
export const getArtistOrders$ = createServerFn()
	.middleware([validateArtistMiddleware])
	.handler(async ({ context }) => {
		const { artist } = context;

		// Get all artist orders
		const orders = await db
			.selectFrom("order")
			.innerJoin("orderItem", "orderItem.orderId", "order.id")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.innerJoin("user", "user.id", "order.userId")
			.leftJoin("discount", "discount.id", "orderItem.discountId")
			.where("artwork.artistId", "=", artist.id)
			.select([
				"order.id",
				"order.shippingStatus",
				"orderItem.quantity",
				"orderItem.price",
				"orderItem.finalPrice",
				"orderItem.platformFee",
				"orderItem.discountAmount",
				"orderItem.createdAt",
				"artwork.title",
				"artwork.description",
				"user.name as customerName",
				"user.email as customerEmail",
				"discount.code as discountCode",
			])
			.orderBy("orderItem.createdAt", "desc")
			.execute();

		return {
			success: true as const,
			data: {
				orders: orders.map((order) => ({
					...order,
					createdAt: new Date(order.createdAt).toISOString(),
				})),
			},
		};
	});

const updateOrderShippingStatusSchema = z.object({
	orderId: z.string(),
	status: z.enum([ShippingStatus.SHIPPED, ShippingStatus.DELIVERED]),
});

export const updateOrderShippingStatus$ = createServerFn()
	.middleware([validateArtistMiddleware])
	.validator(updateOrderShippingStatusSchema)
	.handler(async ({ context, data }) => {
		const { artist } = context;
		const { orderId, status } = data;

		// Verify the order belongs to the artist
		const order = await db
			.selectFrom("order")
			.innerJoin("orderItem", "orderItem.orderId", "order.id")
			.innerJoin("artwork", "artwork.id", "orderItem.artworkId")
			.where("artwork.artistId", "=", artist.id)
			.where("order.id", "=", orderId)
			.select("order.shippingStatus")
			.executeTakeFirst();

		if (!order) {
			return {
				success: false as const,
				message: "Order not found",
			};
		}

		// Validate status transition
		if (
			order.shippingStatus === ShippingStatus.DELIVERED ||
			(status === ShippingStatus.DELIVERED &&
				order.shippingStatus !== ShippingStatus.SHIPPED)
		) {
			return {
				success: false as const,
				message: "Invalid status transition",
			};
		}

		// Update order shipping status
		await db
			.updateTable("order")
			.set({
				shippingStatus: status,
				updatedAt: new Date(),
			})
			.where("id", "=", orderId)
			.execute();

		return {
			success: true as const,
			message: `Order marked as ${status.toLowerCase()}`,
			data: {
				orderId,
				status,
			},
		};
	});

export const getArtistDiscounts$ = createServerFn()
	.middleware([validateArtistMiddleware])
	.handler(async ({ context }) => {
		const { artist } = context;

		// Get all discounts associated with the artist's artworks
		const discounts = await db
			.selectFrom("discount")
			.leftJoin("artwork", (join) =>
				join.on("artwork.artistId", "=", artist.id),
			)
			.select([
				"discount.id",
				"discount.code",
				"discount.description",
				"discount.percentage",
				"discount.startDate",
				"discount.endDate",
				"discount.minAmount",
				"discount.maxUses",
				"discount.usedCount",
				"discount.isActive",
				"discount.createdAt",
				db.fn.count("artwork.id").as("appliedToArtworks"),
			])
			.groupBy([
				"discount.id",
				"discount.code",
				"discount.description",
				"discount.percentage",
				"discount.startDate",
				"discount.endDate",
				"discount.minAmount",
				"discount.maxUses",
				"discount.usedCount",
				"discount.isActive",
				"discount.createdAt",
			])
			.orderBy("discount.createdAt", "desc")
			.execute();

		return {
			success: true as const,
			data: {
				discounts: discounts.map((discount) => ({
					id: discount.id,
					code: discount.code,
					description: discount.description,
					percentage: discount.percentage,
					startDate: new Date(discount.startDate).toISOString(),
					endDate: new Date(discount.endDate).toISOString(),
					createdAt: new Date(discount.createdAt).toISOString(),
					minAmount: discount.minAmount,
					maxUses: discount.maxUses,
					usedCount: discount.usedCount,
					isActive: discount.isActive,
					appliedToArtworks: Number(discount.appliedToArtworks),
					isValid:
						discount.isActive &&
						new Date() >= new Date(discount.startDate) &&
						new Date() <= new Date(discount.endDate) &&
						(!discount.maxUses || discount.usedCount < discount.maxUses),
				})),
			},
		};
	});
