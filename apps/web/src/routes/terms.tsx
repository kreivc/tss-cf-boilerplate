import { createFileRoute, Link } from "@tanstack/react-router";
import { FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <FileTextIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">Terms & Conditions</h1>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="size-5 text-gaming-primary" />
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground">1. Introduction</h3>
              <p>
                These Terms and Conditions govern the use of the Flazbit
                platform, which is operated by PT Global Inti Digital. By
                accessing or using Flazbit, users agree to comply with these
                Terms and all applicable policies related to the platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                2. Related Policies
              </h3>
              <p>
                These Terms and Conditions should be read together with the
                following policies:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <Link
                    className="text-gaming-primary hover:underline"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gaming-primary hover:underline"
                    to="/refund"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gaming-primary hover:underline"
                    to="/delivery"
                  >
                    Delivery Policy
                  </Link>
                </li>
              </ul>
              <p>
                Each policy provides additional details regarding user rights,
                transaction handling, delivery procedures, and data protection
                practices. By using the platform, users acknowledge and agree to
                these policies.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                3. Description of Services
              </h3>
              <p>
                Flazbit provides an online platform that allows users to
                purchase digital game top-ups, including:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>In-game currency</li>
                <li>Game credits</li>
                <li>Digital items</li>
              </ul>
              <p>
                These products are digital goods delivered electronically to the
                user's game account through integrated service providers.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                4. User Responsibilities
              </h3>
              <p>
                Users are responsible for ensuring that all information
                submitted during a transaction is accurate, including:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Game ID</li>
                <li>Username</li>
                <li>Server or region information</li>
              </ul>
              <p>
                Flazbit is not responsible for delivery failures resulting from
                incorrect information provided by the user.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                5. Payment Processing
              </h3>
              <p>
                Payments must be completed using the payment methods available
                on the platform. Transactions will only be processed after
                payment confirmation has been received from the payment
                provider. Flazbit reserves the right to suspend or cancel
                transactions that appear suspicious or violate platform
                policies.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                6. Digital Product Delivery
              </h3>
              <p>
                Products purchased through Flazbit are delivered electronically
                to the user's game account. Delivery times may vary depending on
                the game provider. For more information regarding delivery
                procedures, please refer to the{" "}
                <Link
                  className="text-gaming-primary hover:underline"
                  to="/delivery"
                >
                  Delivery Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">7. Refunds</h3>
              <p>
                Due to the nature of digital goods, transactions are generally
                non-refundable once completed. Refunds may only be issued under
                specific conditions such as provider delivery failure or system
                errors. Full refund conditions are explained in the{" "}
                <Link
                  className="text-gaming-primary hover:underline"
                  to="/refund"
                >
                  Refund Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                8. Privacy and Data Protection
              </h3>
              <p>
                Flazbit respects the privacy of its users and takes reasonable
                measures to protect personal data. Information regarding how
                user data is collected, used, and protected is described in the{" "}
                <Link
                  className="text-gaming-primary hover:underline"
                  to="/privacy"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                9. Prohibited Activities
              </h3>
              <p>
                Users may not use the platform for activities including but not
                limited to:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Fraudulent transactions</li>
                <li>Abuse of platform services</li>
                <li>Unlawful activities</li>
              </ul>
              <p>
                Flazbit reserves the right to suspend or terminate accounts
                involved in such activities.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                10. Limitation of Liability
              </h3>
              <p>Flazbit shall not be liable for:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Delays caused by game providers or third-party services</li>
                <li>Technical interruptions beyond the company's control</li>
                <li>
                  Losses resulting from incorrect information submitted by users
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                11. Policy Updates
              </h3>
              <p>
                Flazbit may update these Terms and related policies
                periodically. Updated versions will be published on the
                platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
