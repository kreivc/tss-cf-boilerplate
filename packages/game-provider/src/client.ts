/**
 * Game Provider Client Exports
 *
 * Frontend-safe exports for types, constants, and utilities.
 * Used by web frontend for form rendering and type validation.
 *
 * Usage (in frontend code):
 *   import { GameSlug, GAME_PARAM_FIELDS, getGameParamFields } from "@test-tss/game-provider/client";
 */

// Re-export abstract class (no runtime dependencies)
export * from "./abstract";
// Re-export provider implementations (currently no env dependencies)
export { DefaultProvider } from "./providers/default";
export { SmileOneProvider } from "./providers/smile-one";
// Re-export types and field definitions (frontend-safe)
export * from "./types";

// =============================================================================
// FRONTEND-SAFE UTILITY FUNCTIONS
// =============================================================================

import type { GameParamFieldDef, GameSlug } from "./types";
import { GAME_PARAM_FIELDS, GameSlug as GameSlugEnum } from "./types";

/**
 * List of supported games (for client-side use)
 */
export const SUPPORTED_GAMES = GameSlugEnum.options;

/**
 * Get field definitions for a specific game's input form.
 * (Duplicated from index.ts for client bundle)
 *
 * @param gameSlug - The game slug
 * @returns Array of field definitions
 */
export function getGameParamFields(gameSlug: GameSlug): GameParamFieldDef[] {
  return GAME_PARAM_FIELDS[gameSlug] ?? [];
}

/**
 * Check if a game slug is supported
 * (Duplicated from index.ts for client bundle)
 */
export function isGameSupported(gameSlug: string): gameSlug is GameSlug {
  return (SUPPORTED_GAMES as readonly string[]).includes(gameSlug);
}
