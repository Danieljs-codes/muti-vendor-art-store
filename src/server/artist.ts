import { PAYSTACK_PERCENTAGE_CHARGE } from "@/utils/const";
import { createArtistProfileSchema } from "@/utils/schema";
import { paystack } from "@server/paystack";
import { createServerFn } from "@tanstack/start";
import { db } from "./database";
import { maybeArtistMiddleware } from "./middlewares/artist";
import { setCookieAndRedirect } from "./utils";
import { z } from "zod";

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
      .where("artwork.artistId", "=", artist.id)
      .where("order.status", "=", "PENDING")
      .select([
        "order.id",
        "order.totalPrice",
        "order.status",
        "order.shippingStatus",
        "orderItem.quantity",
        "orderItem.price",
        "orderItem.finalPrice",
        "orderItem.platformFee",
        "artwork.title",
        "artwork.imageUrls",
      ])
      .execute();

    return {
      success: true as const,
      data: pendingOrders,
    };
  });

const getArtistDashboardStatsSchema = z.object({
  startDate: z.coerce.date().default(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
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
      .where("order.status", "=", "PAID")
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
      .where("order.status", "=", "PAID")
      .where("order.createdAt", ">=", startDate)
      .where("order.createdAt", "<=", endDate)
      .select(db.fn.sum("orderItem.quantity").as("totalArtworksSold"))
      .executeTakeFirst();

    return {
      success: true as const,
      data: {
        totalRevenue: Number(stats?.totalRevenue || 0),
        totalOrders: Number(stats?.totalOrders || 0),
        averageOrderValue: Number(stats?.averageOrderValue || 0),
        totalArtworksSold: Number(artworksSold?.totalArtworksSold || 0),
      },
    };
  });