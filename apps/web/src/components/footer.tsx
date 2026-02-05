import { Link } from "@tanstack/react-router";
import { Gamepad2Icon } from "lucide-react";
import { m } from "@/paraglide/messages";

const gameLinks = [
  { label: "Mobile Legends", slug: "mobile-legends" },
  { label: "PUBG Mobile", slug: "pubg-mobile" },
  { label: "Free Fire", slug: "free-fire" },
  { label: "Honor of Kings", slug: "honor-of-kings" },
  { label: "Blood Strike", slug: "blood-strike" },
  { label: "Arena Breakout", slug: "arena-breakout" },
  { label: "Magic Chess GoGo", slug: "magic-chess-gogo" },
  { label: "Valorant", slug: "valorant" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const supportLinks = [
    { label: m.privacyPolicy?.() ?? "Privacy Policy", href: "/privacy" },
    { label: m.faq?.() ?? "FAQ", href: "/faq" },
    { label: m.refundPolicy?.() ?? "Refund Policy", href: "/refund" },
    { label: m.contactUs?.() ?? "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="mt-auto border-glass-border border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link className="mb-4 flex items-center gap-2" to="/">
              <div className="rounded-lg bg-gradient-to-br from-gaming-primary to-gaming-secondary p-2">
                <Gamepad2Icon className="size-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-gaming">
                <span className="text-gradient-gaming">Flaz</span>
                <span className="text-foreground">Bit</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-muted-foreground text-sm">
              {m.footerDescription?.() ??
                "Your trusted destination for game top-ups, vouchers, and premium gaming content."}
            </p>
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} FlazBit.{" "}
              {m.allRightsReserved?.() ?? "All rights reserved."}
            </p>
          </div>

          {/* Games - 2 columns */}
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-gaming">
              {m.games?.() ?? "Games"}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {gameLinks.map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    params={{ slug }}
                    to="/game/$slug"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-gaming">
              {m.support?.() ?? "Support"}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    to={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
