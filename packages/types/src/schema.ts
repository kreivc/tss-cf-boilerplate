import { z } from "zod";

// =============================================================================
// GAME SCHEMAS
// =============================================================================

export const GameCategory = z.enum([
  "Trending",
  "RPG",
  "FPS",
  "Battle Royale",
  "Sports",
  "Racing",
  "Puzzle",
  "Card",
  "Other",
]);
export type GameCategory = z.infer<typeof GameCategory>;

// =============================================================================
// ITEM SCHEMAS
// =============================================================================

export const ItemCategory = z.enum(["Recomended", "Hot", "All"]);
export type ItemCategory = z.infer<typeof ItemCategory>;

// =============================================================================
// COUNTRY/CURRENCY SCHEMAS
// =============================================================================

export const SupportedCountry = z.enum(["ID", "US"]);
export type SupportedCountry = z.infer<typeof SupportedCountry>;

export const CurrencyByCountry: Record<SupportedCountry, string> = {
  ID: "Rp",
  US: "$",
};

export const CountryCode = z.enum(["ID", "US"]);
export type CountryCode = z.infer<typeof CountryCode>;

// =============================================================================
// GAME SLUG
// =============================================================================

export const GameSlug = z.enum([
  "mobile-legends",
  "pubg-mobile",
  "free-fire",
  "honor-of-kings",
  "blood-strike",
  "arena-breakout",
  "magic-chess-gogo",
  "valorant",
]);
export type GameSlug = z.infer<typeof GameSlug>;

// =============================================================================
// CURRENCY SCHEMAS
// =============================================================================

export const Currency = z.enum(["USD", "IDR"]);
export type Currency = z.infer<typeof Currency>;

export const CurrencySymbol = z.enum(["$", "Rp"]);
export type CurrencySymbol = z.infer<typeof CurrencySymbol>;

// =============================================================================
// ITEM SLUG
// =============================================================================

// Item Slugs - free-form strings (not constrained to an enum)
export const ItemSlug = z.string();
export type ItemSlug = z.infer<typeof ItemSlug>;
