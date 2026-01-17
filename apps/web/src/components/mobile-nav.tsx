import { Link } from "@tanstack/react-router";
import {
  FlameIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageSearchIcon,
  SparklesIcon,
  TicketIcon,
} from "lucide-react";
import { useState } from "react";
import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { m } from "@/paraglide/messages";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const mainLinks = [
    { to: "/", label: m.home?.() ?? "Home", icon: HomeIcon },
    {
      to: "/find-order",
      label: "Find Order",
      icon: PackageSearchIcon,
    },
    {
      to: "/dashboard",
      label: m.dashboard?.() ?? "Dashboard",
      icon: LayoutDashboardIcon,
    },
  ] as const;

  const quickLinks = [
    {
      href: "#hot-deals",
      label: m.hotDeals?.() ?? "Hot Deals",
      icon: FlameIcon,
      color: "text-orange-500",
    },
    {
      href: "#new-releases",
      label: m.newRelease?.() ?? "New Release",
      icon: SparklesIcon,
      color: "text-gaming-accent",
    },
    {
      href: "#vouchers",
      label: m.vouchers?.() ?? "Vouchers",
      icon: TicketIcon,
      color: "text-gaming-secondary",
    },
  ];

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger>
        <Button
          className={`md:hidden ${className}`}
          size="icon"
          variant="ghost"
        >
          <MenuIcon className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="glass-strong w-[300px] border-glass-border p-0 sm:w-[350px]"
        side="right"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-left">
            <span className="font-bold text-2xl text-gradient-gaming">
              GameTop
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4">
          <Separator className="bg-border/50" />
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 p-4">
          <p className="px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-gaming">
            {m.navigation?.() ?? "Navigation"}
          </p>
          {mainLinks.map(({ to, label, icon: Icon }) => (
            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent/50"
              key={to}
              onClick={() => setOpen(false)}
              to={to}
            >
              <Icon className="size-5 text-muted-foreground" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4">
          <Separator className="bg-border/50" />
        </div>

        {/* Quick Access */}
        <nav className="space-y-1 p-4">
          <p className="px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-gaming">
            {m.quickAccess?.() ?? "Quick Access"}
          </p>
          {quickLinks.map(({ href, label, icon: Icon, color }) => (
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent/50"
              href={href}
              key={href}
              onClick={() => setOpen(false)}
            >
              <Icon className={`size-5 ${color}`} />
              <span className="font-medium">{label}</span>
            </a>
          ))}
        </nav>

        <div className="px-4">
          <Separator className="bg-border/50" />
        </div>

        {/* Settings */}
        <div className="space-y-3 p-4">
          <p className="px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-gaming">
            {m.settings?.() ?? "Settings"}
          </p>
          <div className="px-3">
            <LocaleCurrencySelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Bottom Navigation Bar (alternative style)
export function MobileBottomNav() {
  const links = [
    { to: "/", label: m.home?.() ?? "Home", icon: HomeIcon },
    { href: "#hot-deals", label: m.hotDeals?.() ?? "Deals", icon: FlameIcon },
    {
      href: "#trending",
      label: m.trending?.() ?? "Trending",
      icon: SparklesIcon,
    },
    {
      to: "/dashboard",
      label: m.dashboard?.() ?? "Profile",
      icon: LayoutDashboardIcon,
    },
  ] as const;

  return (
    <nav className="glass-strong safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 border-glass-border border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {links.map((item) => {
          const Icon = item.icon;
          if ("to" in item) {
            return (
              <Link
                className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
                key={item.to}
                to={item.to}
              >
                <Icon className="size-5" />
                <span className="font-medium text-xs">{item.label}</span>
              </Link>
            );
          }
          return (
            <a
              className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              <Icon className="size-5" />
              <span className="font-medium text-xs">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
