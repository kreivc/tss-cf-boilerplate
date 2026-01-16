import { CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCurrency, useCurrency } from "@/lib/currency";
import { m } from "@/paraglide/messages";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";
import { CURRENCIES, type Currency, LOCALE_TO_CURRENCY } from "@/types/game";

// Locale display configuration with flags and full names
const localeConfig: Record<
  string,
  { flag: string; name: string; currency: Currency }
> = {
  en: { flag: "🇺🇸", name: "English", currency: "USD" },
  id: { flag: "🇮🇩", name: "Indonesia", currency: "IDR" },
};

// Get locale display info with fallback
const getLocaleInfo = (locale: string) => {
  return (
    localeConfig[locale] || {
      flag: "🌐",
      name: locale.toUpperCase(),
      currency: "USD" as Currency,
    }
  );
};

export function LocaleCurrencySelector() {
  const [currentLocale, setCurrentLocale] = useState(getLocale());
  const { currencyInfo } = useCurrency();

  // Sync state on mount
  useEffect(() => {
    setCurrentLocale(getLocale());
  }, []);

  const currentInfo = getLocaleInfo(currentLocale);

  const handleLocaleChange = (newLocale: (typeof locales)[number]) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);

    // Automatically sync currency with locale
    const localeCurrency = LOCALE_TO_CURRENCY[newLocale];
    if (localeCurrency) {
      setCurrency(localeCurrency);
    }

    toast.success(m.languageChanged?.() ?? "Language changed", {
      description: `${getLocaleInfo(newLocale).flag} ${getLocaleInfo(newLocale).name} • ${CURRENCIES[localeCurrency || "USD"].symbol} ${localeCurrency || "USD"}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className="glass glow-hover gap-2 border-glass-border px-3 transition-all duration-200 hover:border-gaming-primary/30 hover:bg-accent/80"
          size="sm"
          variant="outline"
        >
          <GlobeIcon className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{currentInfo.flag}</span>
          <span className="hidden text-sm sm:inline">{currentInfo.name}</span>
          <span className="font-semibold text-gaming-primary">
            {currencyInfo.symbol}
          </span>
          <ChevronDownIcon className="ml-1 size-3 text-muted-foreground transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="glass-strong min-w-[220px] rounded-xl border-glass-border"
        sideOffset={8}
      >
        {/* Language Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-gaming">
            {m.selectLanguage?.() ?? "Select Language"}
          </DropdownMenuLabel>
          {locales.map((loc) => {
            const info = getLocaleInfo(loc);
            const isActive = loc === currentLocale;
            return (
              <DropdownMenuItem
                className={`mx-1 my-0.5 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${isActive ? "bg-gaming-primary/10 text-gaming-primary" : "hover:bg-accent/50"}
                `}
                key={loc}
                onClick={() => handleLocaleChange(loc)}
              >
                <span className="text-lg leading-none">{info.flag}</span>
                <span className="flex-1 font-medium text-sm">{info.name}</span>
                <span className="text-muted-foreground text-xs">
                  {CURRENCIES[info.currency].symbol}
                </span>
                {isActive && (
                  <CheckIcon className="size-4 text-gaming-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
