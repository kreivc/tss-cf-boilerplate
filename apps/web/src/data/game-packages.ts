import type { Currency } from "@/types/game";

export interface GamePackage {
  id: string;
  name: string;
  amount: number; // e.g., 50 diamonds, 100 UC
  price: Record<Currency, number>;
  bonus?: number; // bonus items
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  category: "ewallet" | "bank" | "convenience" | "other" | "gateway";
  /** Payment gateway provider (if this is a gateway method) */
  gateway?: "IPAYMU";
  /** Locales where this payment method is available */
  availableLocales?: string[];
}

// Generic packages for games - in a real app this would be per-game
export const GAME_PACKAGES: Record<string, GamePackage[]> = {
  "mobile-legends": [
    {
      id: "ml-1",
      name: "50 Diamonds",
      amount: 50,
      price: { USD: 0.99, IDR: 15_000 },
    },
    {
      id: "ml-2",
      name: "100 Diamonds",
      amount: 100,
      price: { USD: 1.99, IDR: 29_000 },
    },
    {
      id: "ml-3",
      name: "250 Diamonds",
      amount: 250,
      price: { USD: 4.49, IDR: 69_000 },
      popular: true,
    },
    {
      id: "ml-4",
      name: "500 Diamonds",
      amount: 500,
      price: { USD: 8.99, IDR: 139_000 },
      bonus: 50,
    },
    {
      id: "ml-5",
      name: "1000 Diamonds",
      amount: 1000,
      price: { USD: 17.99, IDR: 279_000 },
      bonus: 100,
    },
    {
      id: "ml-6",
      name: "2000 Diamonds",
      amount: 2000,
      price: { USD: 34.99, IDR: 549_000 },
      bonus: 250,
    },
  ],
  default: [
    {
      id: "def-1",
      name: "50 Credits",
      amount: 50,
      price: { USD: 0.99, IDR: 15_000 },
    },
    {
      id: "def-2",
      name: "100 Credits",
      amount: 100,
      price: { USD: 1.99, IDR: 29_000 },
    },
    {
      id: "def-3",
      name: "250 Credits",
      amount: 250,
      price: { USD: 4.49, IDR: 69_000 },
      popular: true,
    },
    {
      id: "def-4",
      name: "500 Credits",
      amount: 500,
      price: { USD: 8.99, IDR: 139_000 },
      bonus: 50,
    },
    {
      id: "def-5",
      name: "1000 Credits",
      amount: 1000,
      price: { USD: 17.99, IDR: 279_000 },
      bonus: 100,
    },
    {
      id: "def-6",
      name: "2500 Credits",
      amount: 2500,
      price: { USD: 39.99, IDR: 629_000 },
      bonus: 300,
    },
  ],
};

/**
 * Payment gateways - these are the main payment providers that handle transactions
 */
export const PAYMENT_GATEWAYS: PaymentMethod[] = [
  {
    id: "ipaymu",
    name: "iPaymu",
    icon: "💳",
    category: "gateway",
    gateway: "IPAYMU",
    availableLocales: ["id"], // Indonesia only
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  // E-Wallets
  { id: "dana", name: "DANA", icon: "💳", category: "ewallet" },
  { id: "ovo", name: "OVO", icon: "💜", category: "ewallet" },
  { id: "gopay", name: "GoPay", icon: "💚", category: "ewallet" },
  { id: "shopeepay", name: "ShopeePay", icon: "🧡", category: "ewallet" },
  { id: "linkaja", name: "LinkAja", icon: "🔴", category: "ewallet" },

  // Banks
  { id: "bca", name: "BCA", icon: "🏦", category: "bank" },
  { id: "mandiri", name: "Mandiri", icon: "🏦", category: "bank" },
  { id: "bni", name: "BNI", icon: "🏦", category: "bank" },
  { id: "bri", name: "BRI", icon: "🏦", category: "bank" },

  // International
  { id: "paypal", name: "PayPal", icon: "🅿️", category: "other" },
  { id: "visa", name: "Credit Card", icon: "💳", category: "other" },
];

export const getPackagesForGame = (slug: string): GamePackage[] => {
  return GAME_PACKAGES[slug] ?? GAME_PACKAGES.default;
};

export const getPaymentMethodsByCategory = () => {
  return {
    ewallet: PAYMENT_METHODS.filter((m) => m.category === "ewallet"),
    bank: PAYMENT_METHODS.filter((m) => m.category === "bank"),
    other: PAYMENT_METHODS.filter((m) => m.category === "other"),
  };
};

/**
 * Get payment gateways with availability status for current locale
 */
export const getPaymentGatewaysForLocale = (locale: string) => {
  return PAYMENT_GATEWAYS.map((gateway) => ({
    ...gateway,
    isAvailable:
      !gateway.availableLocales || gateway.availableLocales.includes(locale),
  }));
};
