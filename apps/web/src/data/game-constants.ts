/**
 * Constants for game display on landing page
 * These are hardcoded slugs to control which games appear in each section
 */

/**
 * Game slugs for trending section (top 5 games)
 */
export const TRENDING_SLUGS = [
  "mobile-legends",
  "genshin-impact",
  "pubg-mobile",
  "free-fire",
  "honor-of-kings",
] as const;

/**
 * Game slugs by category/platform for browse section
 * Note: "all" is computed from all category arrays
 */
export const CATEGORY_SLUGS: Record<"mobile" | "pc" | "console", string[]> = {
  mobile: [
    "mobile-legends",
    "genshin-impact",
    "pubg-mobile",
    "free-fire",
    "honor-of-kings",
  ],
  pc: ["valorant", "steam-wallet"],
  console: [],
};

/**
 * Get all game slugs across all categories
 */
export const getAllGameSlugs = (): string[] => {
  return [
    ...CATEGORY_SLUGS.mobile,
    ...CATEGORY_SLUGS.pc,
    ...CATEGORY_SLUGS.console,
  ];
};

/**
 * Mapping from user locale to country code for item pricing
 */
export const LOCALE_TO_COUNTRY_CODE: Record<string, string> = {
  en: "US",
  id: "ID",
};

/**
 * Game publisher mapping by slug
 * Used to display publisher info on game cards
 */
export const GAME_PUBLISHERS: Record<string, string> = {
  "genshin-impact": "miHoYo",
  "mobile-legends": "Moonton",
  "pubg-mobile": "Krafton",
  "free-fire": "Garena",
  "honor-of-kings": "TiMi Studio",
  valorant: "Riot Games",
  "steam-wallet": "Valve",
};

/**
 * Get publisher for a game by slug
 */
export const getGamePublisher = (slug: string): string | undefined => {
  return GAME_PUBLISHERS[slug];
};
