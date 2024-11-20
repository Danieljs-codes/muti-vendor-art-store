import type { routeTree } from "@/route-tree.gen";
import { convertToObject } from "@/utils/misc";
import { type ParseRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";
import Sharp from "sharp";
import { encode } from "blurhash";

type Toast = {
	intent: "success" | "error" | "info" | "warning";
	message: string;
};

export const getToast = createServerFn().handler(async () => {
	const toast = getCookie("toast");

	if (!toast) return null;

	deleteCookie("toast");

	return convertToObject<Toast>(toast);
});

export const setCookieToast = createServerFn({ method: "GET" })
	.validator((toast: Toast) => toast)
	.handler(async (ctx) => {
		setCookie("toast", JSON.stringify(ctx.data));

		return ctx.data;
	});

export type ValidRoutes = ParseRoute<typeof routeTree>["fullPath"];

type SetCookieAndRedirect = {
	intent: Toast["intent"];
	message: Toast["message"];
	redirectTo: ValidRoutes;
};

export const setCookieAndRedirect = createServerFn({ method: "GET" })
	.validator((toast: SetCookieAndRedirect) => toast)
	.handler(async (ctx) => {
		setCookie("toast", JSON.stringify(ctx.data));

		throw redirect({ to: ctx.data.redirectTo });
	});

export const generateBlurhash = createServerFn()
	.validator((input: { imageBufferOrUrl: string | Buffer }) => input)
	.handler(async (ctx) => {
		try {
			const { imageBufferOrUrl } = ctx.data;
			const imageBuffer = Buffer.isBuffer(imageBufferOrUrl)
				? imageBufferOrUrl
				: await fetch(imageBufferOrUrl)
						.then((res) => res.arrayBuffer())
						.then(Buffer.from);

			// Using 64x64 for higher quality, balancing detail and performance
			// ComponentX: 6, ComponentY: 5 for increased detail in both dimensions
			const { data: pixels, info: metadata } = await Sharp(imageBuffer)
				.raw()
				.ensureAlpha()
				.resize(64, 64, { fit: "inside" })
				.toBuffer({ resolveWithObject: true });

			const blurhash = encode(
				new Uint8ClampedArray(pixels),
				metadata.width,
				metadata.height,
				6, // componentX: increased horizontal detail
				5, // componentY: increased vertical detail for better quality
			);

			return blurhash;
		} catch (error) {
			console.error("Error generating blurhash:", error);
			throw new Error("Failed to generate blurhash");
		}
	});
