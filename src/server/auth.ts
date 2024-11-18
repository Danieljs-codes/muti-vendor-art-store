import {
	type ValidRoutes,
	setCookieAndRedirect,
	setCookieToast,
} from "@/server/utils";
import { auth } from "@/utils/auth";
import { omit } from "@/utils/misc";
import { signInSchema, signUpSchema } from "@/utils/schema";
import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/start";
import { APIError } from "better-auth/api";
import { getWebRequest, setResponseHeader } from "vinxi/http";
import { z } from "zod";
import { validateUserMiddleware } from "./middlewares/auth"
import { maybeArtistMiddleware } from "./middlewares/artist"
import { db } from "./database";

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
					message: (error.body.message as string) || (error.message as string),
				};
			}

			return {
				success: false as const,
				message: "Something went wrong",
			};
		}

		for (const [key, value] of response.headers.entries()) {
			setResponseHeader(key, value);
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

export const signUp$ = createServerFn({
	method: "POST",
})
	.validator(signUpSchema)
	.handler(async ({ data }) => {
		const { name, email, password } = data;

		let response: Response;
		try {
			response = await auth.api.signUpEmail({
				body: {
					name,
					email,
					password,
				},
				asResponse: true,
			});
		} catch (error) {
			if (error instanceof APIError) {
				return {
					success: false as const,
					message: error.body.message || error.message,
				};
			}

			return {
				success: false as const,
				message: "Something went wrong",
			};
		}

		for (const [key, value] of response.headers.entries()) {
			setResponseHeader(key, value);
		}

		setCookieToast({
			data: {
				intent: "success",
				message:
					"Account created successfully. Please check your email to verify your account.",
			},
		});

		throw redirect({
			to: "/",
		});
	});

export const getUser$ = createServerFn({
	method: "GET",
}).handler(async () => {
	const currentRequest = getWebRequest();
	const userSession = await auth.api.getSession({
		headers: currentRequest.headers,
	});

	return userSession
		? { user: userSession.user, session: userSession.session }
		: null;
});

export const getUserArtist$ = createServerFn({
	method: "GET",
}).handler(async () => {
	const userSession = await getUser$();

	if (!userSession) return null;

	const artists = await db
		.selectFrom("artist")
		.where("artist.userId", "=", userSession.user.id)
		.selectAll()
		.executeTakeFirst();

	if (!artists)
		return {
			artist: null,
			session: omit(userSession.session, ["expiresAt"]),
			user: omit(userSession.user, ["createdAt", "updatedAt"]),
		};

	return {
		artist: omit(artists, ["createdAt", "updatedAt"]),
		session: omit(userSession.session, ["expiresAt"]),
		user: omit(userSession.user, ["createdAt", "updatedAt"]),
	};
});

const getArtistSchema = z.object({
	userId: z.string(),
});

export const getArtist$ = createServerFn({
	method: "GET",
})
	.validator(getArtistSchema)
	.handler(async ({ data }) => {
		const artist = await db
			.selectFrom("artist")
			.where("artist.userId", "=", data.userId)
			.selectAll()
			.executeTakeFirst();

		return artist ? omit(artist, ["createdAt", "updatedAt"]) : null;
	});

const validateCreateArtistAccessSchema = z.object({
	redirectTo: z
		.string()
		.optional()
		.default("/sign-in") as z.ZodType<ValidRoutes>,
});

export const validateCreateArtistAccess$ = createServerFn({
	method: "GET",
})
	.validator(validateCreateArtistAccessSchema)
	.handler(async ({ data }) => {
		const user = await getUser$();

		if (!user) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "You must be signed in to create an artist profile",
					redirectTo: data.redirectTo,
				},
			});
		}

		const artist = await getArtist$({
			data: {
				userId: user.user.id,
			},
		});

		if (artist) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "You already have an artist profile",
					redirectTo: "/",
				},
			});
		}

		return { user };
	});

export const validateArtistDashboardAccess$ = createServerFn({
	method: "GET",
})
	.middleware([maybeArtistMiddleware])
	.handler(async ({ context }) => {
		const { artist, user } = context;

		if (!artist) {
			throw await setCookieAndRedirect({
				data: {
					intent: "error",
					message: "Artist profile not found",
					redirectTo: "/",
				},
			});
		}

		return {
			artist: omit(artist, ["createdAt", "updatedAt"]),
			user,
		};
	});
