import type { GameSlug } from "@test-tss/game-provider/client";

/**
 * Constants for game display on landing page
 * These are hardcoded slugs to control which games appear in each section
 */

/**
 * Game slugs for trending section (top 5 games)
 */
export const TRENDING_SLUGS: readonly GameSlug[] = [
  "mobile-legends",
  "pubg-mobile",
  "free-fire",
  "honor-of-kings",
  "blood-strike",
];

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
export const GAME_PUBLISHERS: Record<GameSlug, string> = {
  "mobile-legends": "Moonton",
  "pubg-mobile": "Krafton",
  "free-fire": "Garena",
  "honor-of-kings": "TiMi Studio",
  "blood-strike": "NetEase",
  "arena-breakout": "NetEase",
  "magic-chess-gogo": "Moonton",
  valorant: "Riot Games",
};

/**
 * Get publisher for a game by slug
 */
export const getGamePublisher = (slug: GameSlug): string => {
  return GAME_PUBLISHERS[slug];
};
