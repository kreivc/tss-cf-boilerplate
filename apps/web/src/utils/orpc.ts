import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { AppRouter } from "@test-tss/api/routers/index";
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
    const link = new RPCLink({
      url: `${env.VITE_SERVER_URL}/rpc`,
      headers: () => {
        const headers = getRequestHeaders();
        return {
          ...Object.fromEntries(headers.entries()),
        };
      },
    });

    return createORPCClient(link) as RouterClient<AppRouter>;
  })
  .client((): RouterClient<AppRouter> => {
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
