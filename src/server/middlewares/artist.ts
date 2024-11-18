import { createMiddleware } from "@tanstack/start"
import { validateUserMiddleware } from "./auth"
import { db } from "../database"

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