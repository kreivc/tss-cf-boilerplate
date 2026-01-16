import { z } from "zod";

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

export const ItemCategory = z.enum(["Recomended", "Hot", "All"]);
export type ItemCategory = z.infer<typeof ItemCategory>;

export const SupportedCountry = z.enum(["ID", "US"]);
export type SupportedCountry = z.infer<typeof SupportedCountry>;

export const CurrencyByCountry: Record<SupportedCountry, string> = {
  ID: "Rp",
  US: "$",
};

export const GameSlug = z.enum([
  "mobile-legends",
  "genshin-impact",
  "pubg-mobile",
  "free-fire",
  "honor-of-kings",
  "valorant",
  "steam-wallet",
]);
export type GameSlug = z.infer<typeof GameSlug>;

export const CountryCode = z.enum(["ID", "US"]);
export type CountryCode = z.infer<typeof CountryCode>;

export const Currency = z.enum(["USD", "IDR"]);
export type Currency = z.infer<typeof Currency>;

export const CurrencySymbol = z.enum(["$", "Rp"]);
export type CurrencySymbol = z.infer<typeof CurrencySymbol>;

// Item Slugs - All item slugs from seed data
export const ItemSlug = z.enum([
  // Mobile Legends Items
  "ml-diamond-86",
  "ml-diamond-172",
  "ml-diamond-257",
  "ml-diamond-344",
  "ml-diamond-429",
  "ml-diamond-514",
  "ml-diamond-706",
  "ml-diamond-878",
  "ml-diamond-1050",
  "ml-twilight-pass",
  "ml-starlight",
  // Free Fire Items
  "ff-diamond-100",
  "ff-diamond-210",
  "ff-diamond-530",
  "ff-diamond-1080",
  "ff-diamond-2200",
  "ff-weekly-membership",
  "ff-monthly-membership",
  "ff-level-up-pass",
  // Magic Chess: Go Go Items
  "mcgg-diamond-100",
  "mcgg-diamond-250",
  "mcgg-diamond-500",
  "mcgg-diamond-1000",
  "mcgg-season-pass",
  "mcgg-premium-pass",
  // PUBG Mobile Items
  "pubgm-uc-60",
  "pubgm-uc-325",
  "pubgm-uc-660",
  "pubgm-uc-1800",
  "pubgm-uc-3850",
  "pubgm-uc-8100",
  "pubgm-royale-pass",
  "pubgm-royale-pass-plus",
  // Blood Strike Items
  "bs-gold-100",
  "bs-gold-300",
  "bs-gold-500",
  "bs-gold-1000",
  "bs-gold-2000",
  "bs-battle-pass",
  "bs-elite-pass",
  // Genshin Impact Items
  "genshin-genesis-60",
  "genshin-genesis-300",
  "genshin-genesis-980",
  "genshin-genesis-1980",
  "genshin-genesis-3280",
  "genshin-genesis-6480",
  "genshin-welkin",
  "genshin-battle-pass",
  "genshin-battle-pass-bundle",
]);
export type ItemSlug = z.infer<typeof ItemSlug>;

// Mapping from GameSlug to ItemSlug arrays
const GAME_TO_ITEM_SLUGS: Record<GameSlug, ItemSlug[]> = {
  "mobile-legends": [
    "ml-diamond-86",
    "ml-diamond-172",
    "ml-diamond-257",
    "ml-diamond-344",
    "ml-diamond-429",
    "ml-diamond-514",
    "ml-diamond-706",
    "ml-diamond-878",
    "ml-diamond-1050",
    "ml-twilight-pass",
    "ml-starlight",
  ],
  "free-fire": [
    "ff-diamond-100",
    "ff-diamond-210",
    "ff-diamond-530",
    "ff-diamond-1080",
    "ff-diamond-2200",
    "ff-weekly-membership",
    "ff-monthly-membership",
    "ff-level-up-pass",
  ],
  "pubg-mobile": [
    "pubgm-uc-60",
    "pubgm-uc-325",
    "pubgm-uc-660",
    "pubgm-uc-1800",
    "pubgm-uc-3850",
    "pubgm-uc-8100",
    "pubgm-royale-pass",
    "pubgm-royale-pass-plus",
  ],
  "genshin-impact": [
    "genshin-genesis-60",
    "genshin-genesis-300",
    "genshin-genesis-980",
    "genshin-genesis-1980",
    "genshin-genesis-3280",
    "genshin-genesis-6480",
    "genshin-welkin",
    "genshin-battle-pass",
    "genshin-battle-pass-bundle",
  ],
  "honor-of-kings": [],
  valorant: [],
  "steam-wallet": [],
};

/**
 * Get all item slugs for a specific game
 * @param gameSlug - The game slug to get item slugs for
 * @returns Array of item slugs for the game
 */
export function getItemSlugsByGame(gameSlug: GameSlug): ItemSlug[] {
  return GAME_TO_ITEM_SLUGS[gameSlug] ?? [];
}

/**
 * Check if an item slug belongs to a specific game
 * @param itemSlug - The item slug to check
 * @param gameSlug - The game slug to check against
 * @returns True if the item belongs to the game
 */
export function isItemSlugForGame(
  itemSlug: ItemSlug,
  gameSlug: GameSlug
): boolean {
  return getItemSlugsByGame(gameSlug).includes(itemSlug);
}
