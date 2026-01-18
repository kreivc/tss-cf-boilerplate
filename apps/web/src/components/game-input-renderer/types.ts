import type { GameSlug } from "@test-tss/game-provider/client";

/**
 * Verified account data returned after successful account check
 */
export interface VerifiedGameAccount {
  username: string;
  params: Record<string, string>;
}

/**
 * Props for game input renderer components
 */
export interface GameInputRendererProps {
  /** The game slug for this renderer */
  gameSlug: GameSlug;
  /** Current parameter values */
  values: Record<string, string>;
  /** Callback when values change */
  onChange: (values: Record<string, string>) => void;
  /** Whether inputs are disabled (e.g., after verification) */
  disabled?: boolean;
  /** Verified account data (shown after successful check) */
  verifiedAccount?: VerifiedGameAccount | null;
  /** Whether a check is in progress */
  isChecking?: boolean;
  /** Callback to trigger account check */
  onCheck?: () => void;
  /** Callback to reset/clear verification */
  onReset?: () => void;
}
