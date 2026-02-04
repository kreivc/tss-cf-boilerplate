import { z } from "zod";

// =============================================================================
// GAME SLUG AND ENUMS
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
// GAME-SPECIFIC PARAMETER TYPES
// =============================================================================

/**
 * Mobile Legends: Bang Bang
 * Requires User ID + Server ID (Zone ID)
 */
export interface MobileLegendParams {
  userId: string;
  serverId: string;
}

/**
 * PUBG Mobile
 * Requires Player ID only
 */
export interface PubgMobileParams {
  playerId: string;
}

/**
 * Free Fire
 * Requires Player ID only
 */
export interface FreeFireParams {
  playerId: string;
}

/**
 * Honor of Kings
 * Requires Player ID + Server ID (similar to ML)
 */
export interface HonorOfKingsParams {
  playerId: string;
  serverId: string;
}

/**
 * Valorant
 * Requires Riot ID (username#tagline format)
 */
export interface ValorantParams {
  riotId: string;
}

/**
 * Blood Strike
 * Requires Player ID only
 */
export interface BloodStrikeParams {
  playerId: string;
}

/**
 * Arena Breakout
 * Requires Player ID only
 */
export interface ArenaBreakoutParams {
  playerId: string;
}

/**
 * Magic Chess: Go Go
 * Requires Player ID only
 */
export interface MagicChessGogoParams {
  playerId: string;
}

// =============================================================================
// TYPE MAPPING
// =============================================================================

/**
 * Maps GameSlug to its corresponding parameter type
 */
export interface GameParamsMap {
  "mobile-legends": MobileLegendParams;
  "pubg-mobile": PubgMobileParams;
  "free-fire": FreeFireParams;
  "honor-of-kings": HonorOfKingsParams;
  "blood-strike": BloodStrikeParams;
  "arena-breakout": ArenaBreakoutParams;
  "magic-chess-gogo": MagicChessGogoParams;
  valorant: ValorantParams;
}

/**
 * Helper type to get the params type for a specific game slug
 */
export type GameParamsFor<T extends GameSlug> = T extends keyof GameParamsMap
  ? GameParamsMap[T]
  : Record<string, string>;

/**
 * Generic game params schema for API
 */
export const GameParamsSchema = z.record(z.string(), z.string());
export type GameParams = z.infer<typeof GameParamsSchema>;

// =============================================================================
// FIELD DEFINITIONS
// =============================================================================

/**
 * Definition for a single form field in a game's input form
 */
export interface GameParamFieldDef {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
}

/**
 * Field definitions for each game's input form
 */
export const GAME_PARAM_FIELDS: Record<GameSlug, GameParamFieldDef[]> = {
  "mobile-legends": [
    {
      key: "userId",
      label: "User ID",
      placeholder: "Enter your User ID",
      required: true,
      helpText: "Find your ID in game profile",
    },
    {
      key: "serverId",
      label: "Server ID (Zone ID)",
      placeholder: "Enter Server ID",
      required: true,
      helpText: "The zone number below your User ID",
    },
  ],
  "pubg-mobile": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
      helpText: "Find in Settings > Basic Info",
    },
  ],
  "free-fire": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
      helpText: "Find in game profile",
    },
  ],
  "honor-of-kings": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
    },
    {
      key: "serverId",
      label: "Server ID",
      placeholder: "Enter Server ID",
      required: true,
    },
  ],
  "blood-strike": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
      helpText: "Find in game profile",
    },
  ],
  "arena-breakout": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
      helpText: "Find in game profile",
    },
  ],
  "magic-chess-gogo": [
    {
      key: "playerId",
      label: "Player ID",
      placeholder: "Enter your Player ID",
      required: true,
      helpText: "Find in game profile",
    },
  ],
  valorant: [
    {
      key: "riotId",
      label: "Riot ID",
      placeholder: "Username#Tagline",
      required: true,
      helpText: "Format: YourName#1234",
    },
  ],
};

// =============================================================================
// ACCOUNT & TOP-UP TYPES
// =============================================================================

/**
 * Verified account data structure (returned after username check)
 */
export interface VerifiedAccountData {
  username: string;
  params: Record<string, string>;
}

/**
 * Top-up request structure
 */
export interface TopUpRequest {
  gameSlug: GameSlug;
  gameParams: GameParams;
  itemCode: string;
  transactionId: string;
}

/**
 * Top-up response structure
 */
export interface TopUpResponse {
  success: boolean;
  message: string;
  providerTransactionId?: string;
  errorCode?: string;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get initial empty params for a game
 */
export function getEmptyParamsForGame(
  gameSlug: GameSlug
): Record<string, string> {
  const fields = GAME_PARAM_FIELDS[gameSlug] || [];
  const params: Record<string, string> = {};
  for (const field of fields) {
    params[field.key] = "";
  }
  return params;
}

/**
 * Check if all required params are filled
 */
export function areRequiredParamsFilled(
  gameSlug: GameSlug,
  params: Record<string, string>
): boolean {
  const fields = GAME_PARAM_FIELDS[gameSlug] || [];
  for (const field of fields) {
    if (field.required && !params[field.key]?.trim()) {
      return false;
    }
  }
  return true;
}

/**
 * Parse game params from JSON string
 */
export function parseGameParams(
  json: string | null | undefined
): Record<string, string> | null {
  if (!json) {
    return null;
  }
  try {
    const parsed = JSON.parse(json);
    const result = GameParamsSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Stringify game params for storage
 */
export function stringifyGameParams(data: Record<string, string>): string {
  return JSON.stringify(data);
}

/**
 * Get typed game params for a specific game
 */
export function getTypedGameParamsForGame<T extends keyof GameParamsMap>(
  params: Record<string, string> | null,
  _gameSlug: T
): GameParamsFor<T> | null {
  if (!params) {
    return null;
  }
  return params as unknown as GameParamsFor<T>;
}
