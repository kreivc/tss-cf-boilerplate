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
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptTextIcon className="size-5 text-gaming-primary" />
              {m.refundPolicy?.() ?? "Refund Policy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              Flazbit Products are subject to a strict no-refund policy. Please
              ensure that the product you purchase is suitable for your needs
              before completing your transaction.
            </p>

            <p>
              Customers are solely responsible for verifying the requirements of
              the product. By purchasing any Flazbit product, you acknowledge
              and agree that all sales are final.
            </p>

            <p>
              All products are non-refundable, non-returnable, and
              non-exchangeable, including but not limited to cases of:
            </p>
            <ol className="list-decimal space-y-1 pl-6">
              <li>Incorrect product selection</li>
              <li>Device or software incompatibility</li>
              <li>Change of mind after purchase</li>
            </ol>

            <p>
              We do not offer refunds, replacements, or exchanges once the
              product has been delivered.
            </p>

            <p>
              If you have questions about compatibility or product details,
              please contact our support team before making a purchase.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
