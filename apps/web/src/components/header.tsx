import { Link } from "@tanstack/react-router";

import { LocaleSwitcher } from "./locale-switcher";
import UserMenu from "./user-menu";
import { m } from "@/paraglide/messages";

export default function Header() {
  const links = [
    { to: "/", label: m.home() },
    { to: "/dashboard", label: m.dashboard() },
    { to: "/todos", label: m.todos() },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} to={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
