import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/ytta")({
  component: YttaLayout,
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: ({ context }) => {
    // Redirect to login if not authenticated

    console.log("context.session", context.session);
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }

    // Check if user has admin role
    if (context.session.user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function YttaLayout() {
  return <Outlet />;
}
