import { createMiddleware } from "@tanstack/start"
import { validateUserMiddleware } from "./auth"
import { db } from "../database"
import { setCookieAndRedirect } from "@server/utils"

export const maybeArtistMiddleware = createMiddleware()
  .middleware([validateUserMiddleware])
  .server(async ({ next, context }) => {
    const { user } = context
    const maybeArtist = await db
      .selectFrom("artist")
      .where("artist.userId", "=", user.id)
      .selectAll()
      .executeTakeFirst()

    return next({
      context: {
        artist: maybeArtist,
      },
    })
  }) 

  export const validateArtistMiddleware = createMiddleware()
  .middleware([validateUserMiddleware])
  .server(async ({ next, context }) => {
    const { user } = context
    const maybeArtist = await db
      .selectFrom("artist")
      .where("artist.userId", "=", user.id)
      .selectAll()
      .executeTakeFirst()

    if (!maybeArtist) {
      throw await setCookieAndRedirect({
        data: {
          intent: "error",
          message: "Artist profile not found",
          redirectTo: "/",
        },
      });
    }

    return next({
      context: {
        artist: maybeArtist,
      },
    })
  })