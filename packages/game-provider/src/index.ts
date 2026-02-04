/**
 * Game Provider Package
 *
 * Centralized game provider logic with strategy pattern.
 * Supports multiple game providers (Smile.One, Mihoyo, etc.)
 *
 * Usage:
 *   const provider = getGameProvider("mobile-legends");
 *   const account = await provider.checkUsername("mobile-legends", params);
 *   const result = await provider.sendTopUp(request);
 */

import type { GameProvider } from "./abstract";
import { DefaultProvider } from "./providers/default";
import { SmileOneProvider } from "./providers/smile-one";
import type { GameParamFieldDef } from "./types";
import { GAME_PARAM_FIELDS, GameSlug } from "./types";

export * from "./abstract";
export { DefaultProvider } from "./providers/default";
export { SmileOneProvider } from "./providers/smile-one";
export * from "./types";

// =============================================================================
// PROVIDER INSTANCES (Lazy singleton pattern)
// =============================================================================

let _smileOneProvider: SmileOneProvider | null = null;
let _defaultProvider: DefaultProvider | null = null;

function getSmileOneProviderInstance(): SmileOneProvider {
  if (!_smileOneProvider) {
    _smileOneProvider = new SmileOneProvider();
  }
  return _smileOneProvider;
}

function getDefaultProviderInstance(): DefaultProvider {
  if (!_defaultProvider) {
    _defaultProvider = new DefaultProvider();
  }
  return _defaultProvider;
}

/**
 * Game to Provider mapping
 *
 * NOTE: Currently all games use SmileOneProvider or DefaultProvider as mock.
 * When specific provider integrations are available, update the mapping.
 */
const GAME_PROVIDER_FACTORY: Record<GameSlug, () => GameProvider> = {
  "mobile-legends": getSmileOneProviderInstance,
  "free-fire": getDefaultProviderInstance,
  "pubg-mobile": getDefaultProviderInstance,
  "honor-of-kings": getDefaultProviderInstance,
  "blood-strike": getDefaultProviderInstance,
  "arena-breakout": getDefaultProviderInstance,
  "magic-chess-gogo": getDefaultProviderInstance,
  valorant: getDefaultProviderInstance,
};

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Get the game provider for a specific game.
 *
 * @param gameSlug - The game slug
 * @returns Game provider instance
 * @throws Error if game is not supported
 *
 * @example
 * const provider = getGameProvider("mobile-legends");
 * const account = await provider.checkUsername("mobile-legends", { userId: "123", serverId: "456" });
 */
export function getGameProvider(gameSlug: GameSlug): GameProvider {
  const factory = GAME_PROVIDER_FACTORY[gameSlug];
  if (!factory) {
    throw new Error(`Unsupported game: ${gameSlug}`);
  }
  return factory();
}

/**
 * Get the default provider instance.
 * Use this when you need a fallback provider that works for any game.
 *
 * @returns DefaultProvider instance
 *
 * @example
 * const provider = getDefaultProvider();
 * const result = await provider.sendTopUp(request);
 */
export function getDefaultProvider(): DefaultProvider {
  return getDefaultProviderInstance();
}

/**
 * Get all available game providers.
 */
export function getAllProviders(): GameProvider[] {
  return [getSmileOneProviderInstance(), getDefaultProviderInstance()];
}

/**
 * Get field definitions for a specific game's input form.
 *
 * @param gameSlug - The game slug
 * @returns Array of field definitions
 */
export function getGameParamFields(gameSlug: GameSlug): GameParamFieldDef[] {
  return GAME_PARAM_FIELDS[gameSlug] ?? [];
}

/**
 * List of supported games
 */
export const SUPPORTED_GAMES = GameSlug.options;

/**
 * Check if a game slug is supported
 */
export function isGameSupported(gameSlug: string): gameSlug is GameSlug {
  return SUPPORTED_GAMES.includes(gameSlug as GameSlug);
}
