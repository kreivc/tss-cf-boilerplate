import { Link } from "@tanstack/react-router";
import { HomeIcon, MenuIcon, PackageSearchIcon } from "lucide-react";
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
  ] as const;

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
              FlazBit
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
