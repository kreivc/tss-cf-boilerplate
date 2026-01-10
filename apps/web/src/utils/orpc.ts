import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient, type RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { AppRouter } from "@test-tss/api/routers/index";
import { appRouter } from "@test-tss/api/routers/index";
import { auth } from "@test-tss/auth";
import { env } from "@test-tss/env/web";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: query.invalidate,
        },
      });
    },
  }),
});

const getORPCClient = createIsomorphicFn()
  .server((): RouterClient<AppRouter> => {
    // Use router directly on server-side (no HTTP request needed!)
    return createRouterClient(appRouter, {
      /**
       * Provide context for each request.
       * Using a function ensures per-request context isolation.
       */
      context: async () => {
        const headers = getRequestHeaders();
        const session = await auth.api.getSession({
          headers,
        });
        return { session };
      },
    });
  })
  .client((): RouterClient<AppRouter> => {
    // Browser still uses HTTP requests
    const link = new RPCLink({
      url: `${env.VITE_SERVER_URL}/rpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    });
    return createORPCClient(link) as RouterClient<AppRouter>;
  });

export const client: RouterClient<AppRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
