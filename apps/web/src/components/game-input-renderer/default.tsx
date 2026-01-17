import { GAME_PARAM_FIELDS } from "@test-tss/types";
import { InfoIcon, Loader2Icon, UserCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GameInputRendererProps } from "./types";

/**
 * Default/fallback input renderer for games without custom renderers
 * Dynamically generates fields based on GAME_PARAM_FIELDS config
 */
export function DefaultRenderer({
  gameSlug,
  values,
  onChange,
  disabled,
  verifiedAccount,
  isChecking,
  onCheck,
  onReset,
}: GameInputRendererProps) {
  const fields = GAME_PARAM_FIELDS[gameSlug] || [];

  const handleChange = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  // Check if all required fields are filled
  const allRequiredFilled = fields
    .filter((f) => f.required)
    .every((f) => values[f.key]?.trim());

  return (
    <div className="space-y-4">
      <div
        className={`grid gap-4 ${fields.length > 1 ? "grid-cols-1 sm:grid-cols-2" : ""}`}
      >
        {fields.map((field) => (
          <div className="space-y-2" key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}
              {!field.required && (
                <span className="ml-1 text-muted-foreground">(Optional)</span>
              )}
            </Label>
            <Input
              className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
              disabled={disabled}
              id={field.key}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              value={values[field.key] || ""}
            />
            {field.helpText && (
              <p className="text-muted-foreground text-xs">{field.helpText}</p>
            )}
          </div>
        ))}
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
              {fields
                .map(
                  (f) => `${f.label}: ${verifiedAccount.params[f.key] || "N/A"}`
                )
                .join(" • ")}
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
            Find your ID in game settings or profile
          </p>
          {onCheck && (
            <Button
              className="btn-gaming"
              disabled={!allRequiredFilled || isChecking}
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
