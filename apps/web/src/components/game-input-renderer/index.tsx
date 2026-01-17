import type { GameSlug } from "@test-tss/types";
import type { ComponentType } from "react";

// Individual renderers
// biome-ignore lint/style/noExportedImports: used internally and exported
import { DefaultRenderer } from "./default";
// biome-ignore lint/style/noExportedImports: used internally and exported
import { FreeFireRenderer } from "./free-fire";
// biome-ignore lint/style/noExportedImports: used internally and exported
import { GenshinImpactRenderer } from "./genshin-impact";
// biome-ignore lint/style/noExportedImports: used internally and exported
import { MobileLegendRenderer } from "./mobile-legends";
// biome-ignore lint/style/noExportedImports: used internally and exported
import { PubgMobileRenderer } from "./pubg-mobile";
import type { GameInputRendererProps } from "./types";

// Re-export types
export type { GameInputRendererProps, VerifiedGameAccount } from "./types";

/**
 * Registry mapping game slugs to their custom renderers
 * Games not in this map will use the DefaultRenderer
 */
const RENDERER_MAP: Partial<
  Record<GameSlug, ComponentType<GameInputRendererProps>>
> = {
  "mobile-legends": MobileLegendRenderer,
  "genshin-impact": GenshinImpactRenderer,
  "pubg-mobile": PubgMobileRenderer,
  "free-fire": FreeFireRenderer,
  // Honor of Kings, Valorant, Steam Wallet use DefaultRenderer
};

/**
 * Main GameInputRenderer component
 * Automatically selects the appropriate renderer based on game slug
 *
 * @example
 * <GameInputRenderer
 *   gameSlug="mobile-legends"
 *   values={gameParams}
 *   onChange={setGameParams}
 *   disabled={!!verifiedAccount}
 *   verifiedAccount={verifiedAccount}
 *   isChecking={isChecking}
 *   onCheck={handleCheck}
 *   onReset={handleReset}
 * />
 */
export function GameInputRenderer(props: GameInputRendererProps) {
  const { gameSlug } = props;

  // Get the appropriate renderer for this game, or use default
  const Renderer = RENDERER_MAP[gameSlug] ?? DefaultRenderer;

  return <Renderer {...props} />;
}

// Export individual renderers for direct use if needed
export {
  DefaultRenderer,
  FreeFireRenderer,
  GenshinImpactRenderer,
  MobileLegendRenderer,
  PubgMobileRenderer,
};
