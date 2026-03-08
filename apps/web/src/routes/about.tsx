import { createFileRoute } from "@tanstack/react-router";
import { BuildingIcon, HeadphonesIcon, InfoIcon, ZapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <InfoIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">About Us</h1>
          <p className="text-muted-foreground">
            Learn more about Flazbit and what we do
          </p>
        </div>

        {/* About Card */}
        <Card className="gaming-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ZapIcon className="size-5 text-gaming-primary" />
              About Flazbit
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              Flazbit is an online digital platform operated by PT Global Inti
              Digital, providing game top-up services for users worldwide.
            </p>
            <p>
              Through Flazbit, users can purchase in-game currency, credits, and
              other digital items for supported games quickly and securely. All
              products offered on the platform are digital goods delivered
              electronically to the user's game account through integrated
              service providers.
            </p>
            <p>
              Flazbit is designed to provide a simple, fast, and reliable way
              for gamers to top up their favorite games anytime and anywhere.
            </p>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="gaming-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="size-5 text-gaming-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-glass-border bg-background/50 p-4">
                <p className="mb-1 font-medium text-foreground text-sm">
                  Platform Name
                </p>
                <p className="text-muted-foreground text-sm">Flazbit</p>
              </div>
              <div className="rounded-lg border border-glass-border bg-background/50 p-4">
                <p className="mb-1 font-medium text-foreground text-sm">
                  Operated By
                </p>
                <p className="text-muted-foreground text-sm">
                  PT Global Inti Digital
                </p>
              </div>
              <div className="rounded-lg border border-glass-border bg-background/50 p-4">
                <p className="mb-1 font-medium text-foreground text-sm">
                  Business Type
                </p>
                <p className="text-muted-foreground text-sm">
                  Digital Platform &ndash; Game Top-Up Services
                </p>
              </div>
              <div className="rounded-lg border border-glass-border bg-background/50 p-4 sm:col-span-2">
                <p className="mb-1 font-medium text-foreground text-sm">
                  Address
                </p>
                <p className="text-muted-foreground text-sm">
                  Infiniti Office, MTH Square Ground Floor A4/A, Jl. Letjen M.T.
                  Haryono Kav. 10 Jakarta Timur 13330, JAKARTA TIMUR, DKI
                  Jakarta
                </p>
              </div>
              <div className="rounded-lg border border-glass-border bg-background/50 p-4 sm:col-span-2">
                <p className="mb-1 font-medium text-foreground text-sm">
                  Registration Number
                </p>
                <p className="text-muted-foreground text-sm">
                  AHU-007118.AH.01.30.Tahun 2026
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeadphonesIcon className="size-5 text-gaming-primary" />
              Customer Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground text-sm">
            <p>If you need assistance, please contact our support team.</p>
            <div className="rounded-lg border border-glass-border bg-background/50 p-4">
              <p className="mb-1 font-medium text-foreground">Email</p>
              <a
                className="text-gaming-primary hover:underline"
                href="mailto:support@flazbit.com"
              >
                support@flazbit.com
              </a>
            </div>
            <div className="rounded-lg border border-glass-border bg-background/50 p-4">
              <p className="mb-1 font-medium text-foreground">Support Hours</p>
              <p>24/7</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
