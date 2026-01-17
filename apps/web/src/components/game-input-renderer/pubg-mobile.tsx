import { InfoIcon, Loader2Icon, UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GameInputRendererProps } from "./types";

/**
 * Input renderer for PUBG Mobile
 * Requires: Player ID only
 */
export function PubgMobileRenderer({
  values,
  onChange,
  disabled,
  verifiedAccount,
  isChecking,
  onCheck,
  onReset,
}: GameInputRendererProps) {
  const handleChange = (value: string) => {
    onChange({ ...values, playerId: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="playerId">Player ID</Label>
        <Input
          className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
          disabled={disabled}
          id="playerId"
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your Player ID"
          value={values.playerId || ""}
        />
      </div>

      {/* Verified Account Display */}
      {verifiedAccount && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <UserCheckIcon className="size-5 text-emerald-500" />
          <div>
            <p className="font-medium text-emerald-500">
              {verifiedAccount.username}
            </p>
            <p className="text-muted-foreground text-xs">
              Player ID: {verifiedAccount.params.playerId}
            </p>
          </div>
          {onReset && (
            <Button
              className="ml-auto"
              onClick={onReset}
              size="sm"
              variant="ghost"
            >
              Change
            </Button>
          )}
        </div>
      )}

      {/* Check Button & Help Text */}
      {!verifiedAccount && (
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-muted-foreground text-xs">
            <InfoIcon className="size-3" />
            Find in Settings → Basic Info
          </p>
          {onCheck && (
            <Button
              className="btn-gaming"
              disabled={!values.playerId || isChecking}
              onClick={onCheck}
            >
              {isChecking ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <UserCheckIcon className="mr-2 size-4" />
                  Check User
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
