import { convertToObject } from "@/utils/misc";
import { createServerFn } from "@tanstack/start";
import { getCookie, setCookie } from "vinxi/http";

type Toast = {
	intent: "success" | "error" | "info" | "warning";
	message: string;
};

export const getToast = createServerFn().handler(async () => {
	const toast = getCookie("toast");

	if (!toast) return null;

	return convertToObject<Toast>(toast);
});

export const setCookieToast = createServerFn({ method: "GET" })
	.validator((toast: Toast) => toast)
	.handler(async (ctx) => {
		console.log(ctx.data);
		setCookie("toast", JSON.stringify(ctx.data));
	});
