import { ClockIcon, FlameIcon, SparklesIcon } from "lucide-react";
import { m } from "@/paraglide/messages";

export function QuickAccess() {
  const items = [
    {
      id: "hot-deals",
      label: m.hotDeals?.() ?? "Hot Deals",
      icon: FlameIcon,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "new-releases",
      label: m.newRelease?.() ?? "Newest Release",
      icon: SparklesIcon,
      color: "text-gaming-accent",
      bgColor: "bg-gaming-accent/10",
      borderColor: "border-gaming-accent/20",
    },
    {
      id: "24-7",
      label: m.support247?.() ?? "24/7 Support",
      icon: ClockIcon,
      color: "text-gaming-secondary",
      bgColor: "bg-gaming-secondary/10",
      borderColor: "border-gaming-secondary/20",
    },
  ];

  return (
    <div className="mx-5 flex flex-wrap items-center justify-center gap-2 overflow-hidden py-3 sm:gap-4">
      {items.map(({ id, label, icon: Icon, color, bgColor, borderColor }) => (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${bgColor} ${borderColor} whitespace-nowrap`}
          key={id}
        >
          <Icon className={`size-4 ${color}`} />
          <span className="font-medium text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
}
