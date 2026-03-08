import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <ShieldCheckIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last Updated: 2026</p>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-gaming-primary" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground">1. Introduction</h3>
              <p>
                Flazbit respects the privacy of its users and is committed to
                protecting personal information. This Privacy Policy explains
                how information is collected, used, and protected.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                2. Information We Collect
              </h3>
              <p>Information collected may include:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Device or browser information</li>
                <li>Transaction details</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                3. Use of Information
              </h3>
              <p>Collected information may be used to:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Process transactions</li>
                <li>Verify user identity</li>
                <li>Improve platform functionality</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                4. Data Security
              </h3>
              <p>
                Flazbit implements reasonable technical and organizational
                measures to protect user information from unauthorized access or
                misuse.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                5. Third-Party Services
              </h3>
              <p>
                Flazbit may use third-party providers such as payment processors
                or game service providers. These providers may process limited
                user information required to complete transactions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                6. Data Retention
              </h3>
              <p>
                User data may be retained for operational, legal, and compliance
                purposes.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground">
                7. Policy Updates
              </h3>
              <p>
                Flazbit may update this Privacy Policy from time to time.
                Updated versions will be published on the platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
