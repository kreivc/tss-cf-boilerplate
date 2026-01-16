import { createFileRoute, redirect } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/admin-layout";
import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/ytta")({
  component: YttaLayout,
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: ({ context }) => {
    // Redirect to login if not authenticated

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
  return <AdminLayout />;
}
