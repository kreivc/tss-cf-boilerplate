import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@test-tss/auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const headers = getRequestHeaders();

    const session = await auth.api.getSession({
      headers,
    });

    return next({
      context: { session },
    });
  } catch {
    return next({
      context: { session: null },
    });
  }
});
