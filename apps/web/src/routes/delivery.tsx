import { createFileRoute } from "@tanstack/react-router";
import { TruckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/delivery")({
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <TruckIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">
            {m.deliveryPolicy?.() ?? "Delivery Policy"}
          </h1>
          <p className="text-muted-foreground text-sm">Last Updated: 2026</p>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="size-5 text-gaming-primary" />
              {m.deliveryPolicy?.() ?? "Delivery Policy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground">
                1. Digital Product Delivery
              </h3>
              <p>
                Flazbit provides digital products including game credits,
                in-game currency, and other digital items. These products are
                delivered electronically to the user's game account.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                2. Delivery Process
              </h3>
              <p>Once payment is confirmed:</p>
              <ol className="list-decimal space-y-1 pl-6">
                <li>The order is processed by the Flazbit system</li>
                <li>The request is sent to the service provider</li>
                <li>
                  The digital item is delivered to the user's game account
                </li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                3. Delivery Time
              </h3>
              <p>
                Most transactions are processed instantly after payment
                confirmation. However, delivery may be delayed due to:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Game server maintenance</li>
                <li>Provider technical issues</li>
                <li>Network congestion</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                4. Incorrect Account Information
              </h3>
              <p>
                Users must ensure that account information is correct before
                completing a transaction. Flazbit is not responsible for
                delivery failures caused by incorrect information submitted by
                users.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                5. Failed Delivery
              </h3>
              <p>If delivery fails due to provider issues:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Registered users may receive a refund to their wallet balance
                </li>
                <li>Other users may contact support for assistance</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
