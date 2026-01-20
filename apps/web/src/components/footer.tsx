import { Link } from "@tanstack/react-router";
import {
  DiscIcon,
  Gamepad2Icon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { m } from "@/paraglide/messages";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    games: [
      { label: m.categoryMobile?.() ?? "Mobile Games", href: "#mobile" },
      { label: m.categoryPc?.() ?? "PC Games", href: "#pc" },
      { label: m.categoryConsole?.() ?? "Console", href: "#console" },
      { label: m.vouchers?.() ?? "Vouchers", href: "#vouchers" },
    ],
    support: [
      { label: m.helpCenter?.() ?? "Help Center", href: "/help" },
      { label: m.contactUs?.() ?? "Contact Us", href: "/contact" },
      { label: m.faq?.() ?? "FAQ", href: "/faq" },
      { label: m.refundPolicy?.() ?? "Refund Policy", href: "/refund" },
    ],
    company: [
      { label: m.aboutUs?.() ?? "About Us", href: "/about" },
      { label: m.careers?.() ?? "Careers", href: "/careers" },
      { label: m.blog?.() ?? "Blog", href: "/blog" },
      { label: m.partners?.() ?? "Partners", href: "/partners" },
    ],
  };

  const socialLinks = [
    { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
    { icon: DiscIcon, href: "https://discord.com", label: "Discord" },
    { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
    { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="mt-auto border-glass-border border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
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
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  aria-label={label}
                  className="rounded-lg bg-muted/50 p-2 transition-all duration-200 hover:bg-gaming-primary/10 hover:text-gaming-primary"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Games */}
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-gaming">
              {m.games?.() ?? "Games"}
            </h3>
            <ul className="space-y-2">
              {footerLinks.games.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={href}
                  >
                    {label}
                  </a>
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
              {footerLinks.support.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-gaming">
              {m.company?.() ?? "Company"}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm sm:flex-row">
          <p>
            © {currentYear} FlazBit.{" "}
            {m.allRightsReserved?.() ?? "All rights reserved."}
          </p>
          <div className="flex items-center gap-4">
            <a
              className="transition-colors hover:text-foreground"
              href="/privacy"
            >
              {m.privacyPolicy?.() ?? "Privacy Policy"}
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="/terms"
            >
              {m.termsOfService?.() ?? "Terms of Service"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
