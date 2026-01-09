import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    const headers = getRequestHeaders();

    const sessionResult = await authClient.getSession({
      fetchOptions: {
        headers,
      },
    });

    const session = sessionResult.data;

    return next({
      context: { session },
    });
  } catch {
    return next({
      context: { session: null },
    });
  }
});
