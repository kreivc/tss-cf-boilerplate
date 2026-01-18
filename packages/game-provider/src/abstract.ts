/**
 * Game Provider Abstract Class
 *
 * Base class for all game provider implementations.
 * Handles username checking and top-up processing.
 */

import type {
  GameParams,
  GameSlug,
  TopUpRequest,
  TopUpResponse,
  VerifiedAccountData,
} from "./types";

/**
 * Abstract base class for game provider implementations
 *
 * To add a new game provider:
 * 1. Create a new class extending GameProvider
 * 2. Implement checkUsername and sendTopUp methods
 * 3. Register it in the game provider factory (index.ts)
 */
export abstract class GameProvider {
  /** Unique identifier for this game provider */
  abstract readonly name: string;

  /** Human-readable display name */
  abstract readonly displayName: string;

  /** List of games supported by this provider */
  abstract readonly supportedGames: GameSlug[];

  /**
   * Check if a username/account exists for the specified game
   *
   * @param gameSlug - The game to check
   * @param params - Game-specific parameters (userId, serverId, etc.)
   * @returns Verified account data or null if not found
   */
  abstract checkUsername(
    gameSlug: GameSlug,
    params: GameParams
  ): Promise<VerifiedAccountData | null>;

  /**
   * Send a top-up request to the game provider
   *
   * @param request - Top-up request details
   * @returns Top-up response with success/failure info
   */
  abstract sendTopUp(request: TopUpRequest): Promise<TopUpResponse>;

  /**
   * Check if this provider supports a specific game
   */
  supportsGame(gameSlug: GameSlug): boolean {
    return this.supportedGames.includes(gameSlug);
  }
}
