import { CheckIcon, GlobeIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { m } from "@/paraglide/messages";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";

// Locale display configuration with flags and full names
// Only includes locales that are available in the runtime
const localeConfig: Record<string, { flag: string; name: string }> = {
  en: { flag: "🇺🇸", name: "English" },
  id: { flag: "🇮🇩", name: "Bahasa Indonesia" },
  de: { flag: "🇩🇪", name: "Deutsch" },
};

// Get locale display info with fallback for any locale
const getLocaleInfo = (locale: string) => {
  return localeConfig[locale] || { flag: "🌐", name: locale.toUpperCase() };
};

export function LocaleSwitcher() {
  const [currentLocale, setCurrentLocale] = useState(getLocale());
  const currentInfo = getLocaleInfo(currentLocale);

  const handleLocaleChange = (newLocale: (typeof locales)[number]) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 px-3 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/80 hover:border-accent transition-all duration-200 shadow-sm"
          >
            <GlobeIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentInfo.flag}</span>
            <span className="hidden sm:inline text-sm">{currentInfo.name}</span>
            <ChevronDownIcon className="size-3 text-muted-foreground ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[200px] rounded-lg bg-popover/95 backdrop-blur-md border border-border/50 shadow-xl"
      >
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          {m.selectLanguage()}
        </div>
        <div className="h-px bg-border/50 mx-2 mb-1" />
        {locales.map((loc) => {
          const info = getLocaleInfo(loc);
          const isActive = loc === currentLocale;
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`
                flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md mx-1 my-0.5
                transition-all duration-150
                ${isActive 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-accent/50"
                }
              `}
            >
              <span className="text-lg leading-none">{info.flag}</span>
              <span className="flex-1 text-sm font-medium">{info.name}</span>
              {isActive && (
                <CheckIcon className="size-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
