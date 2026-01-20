import { InfoIcon, Loader2Icon, UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GameInputRendererProps } from "./types";

/**
 * Input renderer for Genshin Impact
 * Requires: UID only (9-digit number)
 */
export function GenshinImpactRenderer({
  values,
  onChange,
  disabled,
  verifiedAccount,
  isChecking,
  onCheck,
  onReset,
}: GameInputRendererProps) {
  const handleChange = (value: string) => {
    onChange({ ...values, uid: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="uid">UID</Label>
        <Input
          className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
          disabled={disabled}
          id="uid"
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your 9-digit UID"
          value={values.uid || ""}
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
              UID: {verifiedAccount.params.uid}
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
            Find in Paimon menu → Settings
          </p>
          {onCheck && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className={`btn-gaming ${values.uid && !isChecking ? "animate-pulse" : ""}`}
                    disabled={!values.uid || isChecking}
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
                }
              />
              {values.uid && !isChecking && (
                <TooltipContent side="top">
                  <p>Click to verify your account before purchasing</p>
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}
