import { InfoIcon, Loader2Icon, UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/paraglide/messages";
import type { GameInputRendererProps } from "./types";

/**
 * Input renderer for Mobile Legends: Bang Bang
 * Requires: User ID + Server ID (Zone ID)
 */
export function MobileLegendRenderer({
  values,
  onChange,
  disabled,
  verifiedAccount,
  isChecking,
  onCheck,
  onReset,
}: GameInputRendererProps) {
  const handleChange = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="userId">{m.userId?.() ?? "User ID"}</Label>
          <Input
            className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
            disabled={disabled}
            id="userId"
            onChange={(e) => handleChange("userId", e.target.value)}
            placeholder={m.enterUserId?.() ?? "Enter your User ID"}
            value={values.userId || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serverId">
            {m.serverId?.() ?? "Server ID"} (Zone ID)
          </Label>
          <Input
            className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
            disabled={disabled}
            id="serverId"
            onChange={(e) => handleChange("serverId", e.target.value)}
            placeholder={m.enterServerId?.() ?? "Enter Server ID"}
            value={values.serverId || ""}
          />
        </div>
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
              ID: {verifiedAccount.params.userId} • Server:{" "}
              {verifiedAccount.params.serverId}
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
            {m.findIdInfo?.() ?? "Find your ID in game settings or profile"}
          </p>
          {onCheck && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className={`btn-gaming ${values.userId && values.serverId && !isChecking ? "animate-pulse" : ""}`}
                    disabled={!(values.userId && values.serverId) || isChecking}
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
              {values.userId && values.serverId && !isChecking && (
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
