import { convertToObject } from "@/utils/misc";
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
	});
