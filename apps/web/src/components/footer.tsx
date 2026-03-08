import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { m } from "@/paraglide/messages";

const allGameLinks = [
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

  const gameLinks = useMemo(() => {
    const shuffled = [...allGameLinks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  const legalLinks = [
    {
      label: m.termsOfService?.() ?? "Terms & Conditions",
      href: "/terms" as const,
    },
    {
      label: m.privacyPolicy?.() ?? "Privacy Policy",
      href: "/privacy" as const,
    },
    {
      label: m.refundPolicy?.() ?? "Refund Policy",
      href: "/refund" as const,
    },
    {
      label: m.deliveryPolicy?.() ?? "Delivery Policy",
      href: "/delivery" as const,
    },
  ];

  const supportLinks = [
    { label: m.faq?.() ?? "FAQ", href: "/faq" as const },
    { label: m.contactUs?.() ?? "Contact Us", href: "/contact" as const },
    { label: m.aboutUs?.() ?? "About Us", href: "/about" as const },
  ];

  return (
    <footer className="mt-auto border-glass-border border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link className="mb-4 flex items-center gap-2" to="/">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gaming-primary/40 blur-md" />
                <div className="absolute -inset-1.5 rounded-xl bg-gaming-primary/20 blur-lg" />
                <img
                  alt="FlazBit"
                  className="relative size-9 rounded-lg"
                  height={36}
                  src="/flazbit_logo_white.png"
                  width={36}
                />
              </div>
              <span className="font-extrabold text-xl uppercase tracking-tight">
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
            <ul className="space-y-2">
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

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-gaming">
              {m.legal?.() ?? "Legal"}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
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
