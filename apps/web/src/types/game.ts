export type GameCategory = "mobile" | "pc" | "console";

export interface GamePrice {
  USD: number;
  IDR: number;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  category: GameCategory;
  image: string;
  publisher: string;
  price: GamePrice;
  trending?: boolean;
  newRelease?: boolean;
  hotDeal?: boolean;
  discount?: number;
  description?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

export type Currency = "USD" | "IDR";

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en" },
  IDR: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id" },
};

export const LOCALE_TO_CURRENCY: Record<string, Currency> = {
  en: "USD",
  id: "IDR",
};
