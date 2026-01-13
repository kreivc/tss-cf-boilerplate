import { CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
            className="gap-2 border-border/50 bg-background/50 px-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-accent/80"
            size="sm"
            variant="outline"
          >
            <GlobeIcon className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">{currentInfo.flag}</span>
            <span className="hidden text-sm sm:inline">{currentInfo.name}</span>
            <ChevronDownIcon className="ml-1 size-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="min-w-[200px] rounded-lg border border-border/50 bg-popover/95 shadow-xl backdrop-blur-md"
        sideOffset={8}
      >
        <div className="px-3 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          {m.selectLanguage()}
        </div>
        <DropdownMenuSeparator />
        {locales.map((loc) => {
          const info = getLocaleInfo(loc);
          const isActive = loc === currentLocale;
          return (
            <DropdownMenuItem
              className={`mx-1 my-0.5 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-150 ${
                isActive ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
              }
              `}
              key={loc}
              onClick={() => handleLocaleChange(loc)}
            >
              <span className="text-lg leading-none">{info.flag}</span>
              <span className="flex-1 font-medium text-sm">{info.name}</span>
              {isActive && <CheckIcon className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
