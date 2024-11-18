import type { routeTree } from "@/route-tree.gen";
import { convertToObject } from "@/utils/misc";
import { type ParseRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";

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
