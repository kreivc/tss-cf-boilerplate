import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { getLocale } from "@/paraglide/runtime";
import type { orpc } from "@/utils/orpc";
import { Footer } from "../components/footer";
import { MobileBottomNav } from "../components/mobile-nav";
import { Navbar } from "../components/navbar";
import appCss from "../index.css?url";

export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "GameTop - Premium Gaming Top-Up",
      },
      {
        name: "description",
        content:
          "Your trusted destination for game top-ups, vouchers, and premium gaming content.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  const locale = getLocale();

  return (
    <html className="dark" lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-svh flex-col">
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </div>
        <MobileBottomNav />
        <Toaster position="top-right" richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
        <Scripts />
      </body>
    </html>
  );
}
