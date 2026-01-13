import { FlameIcon, SparklesIcon, TicketIcon } from "lucide-react";
import { toast } from "sonner";
import { m } from "@/paraglide/messages";

export function QuickAccess() {
  const items = [
    {
      id: "hot-deals",
      href: "#hot-deals",
      label: m.hotDeals?.() ?? "Hot Deals",
      icon: FlameIcon,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
      borderColor: "border-orange-500/20",
    },
    {
      id: "new-releases",
      href: "#new-releases",
      label: m.newRelease?.() ?? "New Release",
      icon: SparklesIcon,
      color: "text-gaming-accent",
      bgColor: "bg-gaming-accent/10 hover:bg-gaming-accent/20",
      borderColor: "border-gaming-accent/20",
    },
    {
      id: "vouchers",
      href: "#vouchers",
      label: m.vouchers?.() ?? "Vouchers",
      icon: TicketIcon,
      color: "text-gaming-secondary",
      bgColor: "bg-gaming-secondary/10 hover:bg-gaming-secondary/20",
      borderColor: "border-gaming-secondary/20",
    },
  ];

  const handleClick = (label: string) => {
    toast.info(label, {
      description: m.sectionNavigated?.() ?? "Navigating to section...",
      duration: 1500,
    });
  };

  return (
    <nav className="scrollbar-hide flex items-center justify-center gap-2 overflow-x-auto px-4 py-3 sm:gap-4">
      {items.map(
        ({ id, href, label, icon: Icon, color, bgColor, borderColor }) => (
          <a
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${bgColor} ${borderColor}transition-all whitespace-nowrap duration-200 hover:scale-105 hover:shadow-lg`}
            href={href}
            key={id}
            onClick={() => handleClick(label)}
          >
            <Icon className={`size-4 ${color}`} />
            <span className="font-medium text-sm">{label}</span>
          </a>
        )
      )}
    </nav>
  );
}
