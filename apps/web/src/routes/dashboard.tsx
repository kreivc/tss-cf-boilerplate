import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import { m } from "@/paraglide/messages";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
    await context.queryClient.ensureQueryData(orpc.privateData.queryOptions());
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  const privateData = useSuspenseQuery(orpc.privateData.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-lg border p-6">
        <h1 className="mb-4 font-bold text-2xl">{m.dashboard()}</h1>
        <p className="mb-2 text-muted-foreground">
          {m.welcome({ name: session?.user.name || "" })}
        </p>
        <p className="text-muted-foreground">
          {m.api({ message: privateData.data?.message || "" })}
        </p>
      </div>
    </div>
  );
}
