/**
 * Default Game Provider
 *
 * A mock provider that works for any game.
 * Used for games without a specific provider integration.
 *
 * - Accepts userId (required) and serverId (optional) as input
 * - checkUsername always returns success with the user ID
 * - sendTopUp mocks with console.log and returns success
 */

import { GameProvider } from "../../abstract";
import {
  type GameParams,
  GameSlug,
  type TopUpRequest,
  type TopUpResponse,
  type VerifiedAccountData,
} from "../../types";

/**
 * Default Game Provider
 *
 * Fallback provider for all games. Returns mock success responses.
 */
export class DefaultProvider extends GameProvider {
  readonly name = "default";
  readonly displayName = "Default Provider";

  // Supports all games as fallback
  readonly supportedGames: GameSlug[] = [...GameSlug.options];

  // biome-ignore lint/suspicious/useAwait: Mock implementation - no async needed
  async checkUsername(
    gameSlug: GameSlug,
    params: GameParams
  ): Promise<VerifiedAccountData | null> {
    // Extract userId from various possible param keys
    const userId =
      params.userId ??
      params.playerId ??
      params.uid ??
      params.steamId ??
      params.riotId ??
      "";

    if (!userId) {
      console.log(
        `[DefaultProvider] checkUsername for ${gameSlug}: No userId found in params`,
        params
      );
      return null;
    }

    console.log(`[DefaultProvider] checkUsername for ${gameSlug}:`, {
      userId,
      serverId: params.serverId,
    });

    // Always return success with the user ID
    return {
      username: `Player_${userId}`,
      params,
    };
  }

  // biome-ignore lint/suspicious/useAwait: Mock implementation - no async needed
  async sendTopUp(request: TopUpRequest): Promise<TopUpResponse> {
    // Mock console.log for the top-up
    console.log("[DefaultProvider] sendTopUp - Mock Purchase:", {
      gameSlug: request.gameSlug,
      userId:
        request.gameParams.userId ?? request.gameParams.playerId ?? "Unknown",
      serverId: request.gameParams.serverId ?? "N/A",
      itemCode: request.itemCode,
      transactionId: request.transactionId,
    });

    // Always return success
    return {
      success: true,
      message: "Top-up successful (mock via DefaultProvider)",
      providerTransactionId: `DEFAULT_${request.transactionId}`,
    };
  }
}
