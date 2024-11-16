import { setCookieToast } from "@/server/utils";
import { auth } from "@/utils/auth";
import { signInSchema } from "@/utils/schema";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { APIError } from "better-auth/api";
import { setCookie } from "vinxi/http";

export const signIn$ = createServerFn({
	method: "POST",
})
	.validator(signInSchema)
	.handler(async ({ data }) => {
		const { email, password, rememberMe } = data;

		let response: Response;
		try {
			response = await auth.api.signInEmail({
				body: {
					email,
					password,
					rememberMe,
				},
				asResponse: true,
			});
		} catch (error) {
			if (error instanceof APIError) {
				return {
					success: false as const,
					message: error.message,
				};
			}

			return {
				success: false as const,
				message: "Something went wrong",
			};
		}

		// Loop through the response headers and set the cookies
		for (const [key, value] of response.headers.entries()) {
			setCookie(key, value);
		}

		setCookieToast({
			data: {
				intent: "success",
				message: "Signed in successfully",
			},
		});

		throw redirect({
			to: "/",
		});
	});
