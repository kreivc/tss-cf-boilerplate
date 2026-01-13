export type GameSlug =
  | "mobile-legends"
  | "genshin-impact"
  | "pubg-mobile"
  | "free-fire"
  | "honor-of-kings"
  | "valorant"
  | "steam-wallet";

export type CountryCode = "ID" | "EN";

export type Currency = "IDR" | "USD";

export type CurrencySymbol = "Rp" | "$";

export type PaymentProvider = "MIDTRANS" | "XENDIT";

export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED";
