import { Link } from "@tanstack/react-router";
import { Gamepad2Icon } from "lucide-react";
import { useState } from "react";

import { LocaleCurrencySelector } from "@/components/locale-currency-selector";
import { MobileNav } from "@/components/mobile-nav";
import { SearchCommand, SearchTrigger } from "@/components/search-command";
import UserMenu from "@/components/user-menu";
import { m } from "@/paraglide/messages";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { to: "/", label: m.home?.() ?? "Home" },
    { to: "/dashboard", label: m.dashboard?.() ?? "Dashboard" },
    { to: "/todos", label: m.todos?.() ?? "Todos" },
  ] as const;

  return (
    <>
      <header className="glass-strong sticky top-0 z-50 w-full border-glass-border border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link className="group flex items-center gap-2" to="/">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gaming-primary/30 blur-md transition-all group-hover:blur-lg" />
                <div className="relative rounded-lg bg-gradient-to-br from-gaming-primary to-gaming-secondary p-2">
                  <Gamepad2Icon className="size-5 text-white" />
                </div>
              </div>
              <span className="hidden font-bold text-xl tracking-gaming sm:inline">
                <span className="text-gradient-gaming">Game</span>
                <span className="text-foreground">Top</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map(({ to, label }) => (
                <Link
                  className="group relative font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
                  key={to}
                  to={to}
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gaming-primary transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <SearchTrigger onClick={() => setSearchOpen(true)} />

              {/* Language/Currency Selector (Desktop) */}
              <div className="hidden md:block">
                <LocaleCurrencySelector />
              </div>

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu Toggle */}
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <SearchCommand onOpenChange={setSearchOpen} open={searchOpen} />
    </>
  );
}

export default Navbar;
