import { createFileRoute } from "@tanstack/react-router";
import { ReceiptTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/refund")({
  component: RefundPage,
});

function RefundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <ReceiptTextIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">
            {m.refundPolicy?.() ?? "Refund Policy"}
          </h1>
          <p className="text-muted-foreground text-sm">Last Updated: 2026</p>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptTextIcon className="size-5 text-gaming-primary" />
              {m.refundPolicy?.() ?? "Refund Policy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground">1. Overview</h3>
              <p>
                Flazbit is a digital platform operated by PT Global Inti Digital
                that provides game top-up services. All products sold through
                the platform are digital goods delivered electronically to
                users' game accounts. Because digital goods are delivered
                instantly, transactions are generally non-refundable.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                2. Non-Refundable Transactions
              </h3>
              <p>Transactions are considered final when:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>The digital product has been successfully delivered</li>
                <li>
                  The transaction has been processed to the specified game
                  account
                </li>
              </ul>
              <p>
                Users are responsible for verifying account information before
                completing a purchase.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                3. Refund Eligibility
              </h3>
              <p>
                Refunds may only be issued if the transaction cannot be
                completed due to:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Provider delivery failure</li>
                <li>System or processing error</li>
                <li>Duplicate payment caused by technical issues</li>
              </ul>
              <p>All refund requests are subject to verification.</p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                4. Refund Method
              </h3>
              <p>If a refund is approved:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  Registered users may receive refunds to their Flazbit wallet
                  balance
                </li>
                <li>
                  Non-registered users may contact support for manual review
                </li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
