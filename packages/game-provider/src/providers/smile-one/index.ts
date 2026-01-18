/**
 * Smile.One Game Provider
 *
 * Provider for Mobile Legends, Free Fire, PUBG Mobile and other games.
 * Documentation: https://www.smile.one/developer
 *
 * NOTE: This is a mock stub. Actual API integration will be implemented
 * when Smile.One credentials are available.
 */

import { GameProvider } from "../../abstract";
import type {
  GameParams,
  GameSlug,
  TopUpRequest,
  TopUpResponse,
  VerifiedAccountData,
} from "../../types";

/**
 * Smile.One Game Provider
 *
 * Handles username checking and top-up for supported games.
 * Currently returns mock responses until API integration is complete.
 */
export class SmileOneProvider extends GameProvider {
  readonly name = "smile-one";
  readonly displayName = "Smile.One";
  readonly supportedGames: GameSlug[] = ["mobile-legends"];

  // biome-ignore lint/suspicious/useAwait: Mock stub - will have await when API is implemented
  async checkUsername(
    gameSlug: GameSlug,
    params: GameParams
  ): Promise<VerifiedAccountData | null> {
    // Extract userId from various possible param keys
    const userId = params.userId ?? params.playerId ?? "Unknown";

    console.log(`[SmileOneProvider] checkUsername for ${gameSlug}:`, {
      userId,
      serverId: params.serverId ?? "N/A",
    });

    // Mock response - always returns success
    return {
      username: `Player_${userId}`,
      params,
    };
  }

  // biome-ignore lint/suspicious/useAwait: Mock stub - will have await when API is implemented
  async sendTopUp(request: TopUpRequest): Promise<TopUpResponse> {
    console.log("[SmileOneProvider] sendTopUp - Mock:", {
      gameSlug: request.gameSlug,
      itemCode: request.itemCode,
      transactionId: request.transactionId,
      gameParams: request.gameParams,
    });

    // Mock response - always returns success
    return {
      success: true,
      message: "Top-up successful (Smile.One mock)",
      providerTransactionId: `SMILE_${request.transactionId}`,
    };
  }
}
