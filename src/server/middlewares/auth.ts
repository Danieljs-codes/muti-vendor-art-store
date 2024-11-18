import { createMiddleware } from "@tanstack/start"
import { getUser$ } from "../auth"
import { setCookieAndRedirect } from "../utils"
import { omit } from "@/utils/misc"

export const validateUserMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await getUser$()

    if (!user) {
      throw await setCookieAndRedirect({
        data: {
          intent: "error",
          message: "You must be signed in to access this resource",
          redirectTo: "/",
        },
      })
    }

    return next({
      context: {
        session: omit(user.session, ["expiresAt"]),
        user: omit(user.user, ["createdAt", "updatedAt"]),
      },
    })
  }
) 