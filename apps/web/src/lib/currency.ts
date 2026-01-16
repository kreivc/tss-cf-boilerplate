import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getLocale } from "@/paraglide/runtime";
import {
  CURRENCIES,
  type Currency,
  type GamePrice,
  LOCALE_TO_CURRENCY,
} from "@/types/game";

const CURRENCY_STORAGE_KEY = "CURRENCY";

// Get initial currency from localStorage or derive from locale
const getStoredCurrency = (): Currency => {
  if (typeof window === "undefined") {
    return "USD";
  }
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored && (stored === "USD" || stored === "IDR")) {
    return stored;
  }
  // Derive from locale
  const locale = getLocale();
  return LOCALE_TO_CURRENCY[locale] || "USD";
};

// Simple event-based store for currency
let currentCurrency: Currency =
  typeof window !== "undefined" ? getStoredCurrency() : "USD";
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => currentCurrency;

const getServerSnapshot = () => "USD" as Currency;

export const setCurrency = (currency: Currency) => {
  currentCurrency = currency;
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }
  for (const listener of listeners) {
    listener();
  }
};

export const useCurrency = () => {
  const currency = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const currencyInfo = useMemo(() => CURRENCIES[currency], [currency]);

  const formatPrice = useCallback(
    (price: GamePrice | number): string => {
      const amount = typeof price === "number" ? price : price[currency];
      const info = CURRENCIES[currency];

      return new Intl.NumberFormat(info.locale === "id" ? "id-ID" : "en-US", {
        style: "currency",
        currency: info.code,
        minimumFractionDigits: currency === "IDR" ? 0 : 2,
        maximumFractionDigits: currency === "IDR" ? 0 : 2,
      }).format(amount);
    },
    [currency]
  );

  const syncWithLocale = useCallback(() => {
    const locale = getLocale();
    const localeCurrency = LOCALE_TO_CURRENCY[locale];
    if (localeCurrency && localeCurrency !== currency) {
      setCurrency(localeCurrency);
    }
  }, [currency]);

  return {
    currency,
    currencyInfo,
    setCurrency,
    formatPrice,
    syncWithLocale,
  };
};
