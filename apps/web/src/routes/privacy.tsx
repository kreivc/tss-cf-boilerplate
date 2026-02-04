import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

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
          <h1 className="mb-2 font-bold text-3xl">
            {m.privacyPolicy?.() ?? "Privacy Policy"}
          </h1>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-gaming-primary" />
              {m.privacyPolicy?.() ?? "Privacy Policy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
            <p>
              Flazbit is committed to protecting your Personal Information when
              you use our website, products and services.
            </p>

            <p>We will collect your personal data including:</p>
            <ol className="list-decimal space-y-1 pl-6">
              <li>Full name</li>
              <li>Email Address</li>
              <li>Online game account identifiers</li>
            </ol>

            <p>
              We will use your personal information for a number of purposes
              including:
            </p>
            <ol className="list-decimal space-y-1 pl-6">
              <li>
                To provide our services, activities or online content, or
                communicating information about promotions or dealing with your
                requests and enquiries.
              </li>
              <li>
                To personalize your experience and provide you with better ways
                of accessing information from this website.
              </li>
              <li>
                For service administration, which means that we may contact you
                for reasons related to the service, activity or online content
                you have signed up for.
              </li>
            </ol>

            <p>
              We collect and use the Personal Information about you for the
              purposes described above based on your consent and, because we
              have a legitimate business interest to do so that is not
              overridden by your right to have your Personal Information
              adequately protected. You do not have to provide us with any of
              the Personal Information described above, but if you chose not to
              do so, you may not be able to receive certain Company services,
              access certain parts of our website or receive information from us
              that you have requested.
            </p>

            <p>
              To fully access the website, you, as a user, may voluntarily
              register for an account by completing a registration form. Certain
              data is collected during this process, including your name and
              email address. This data is used to contact you, suggest
              appropriate products and services, and improve your user
              experience. By registering for an account, you have consented to
              our processing of your data.
            </p>

            <p>
              We may process your personal data for marketing purposes to keep
              you up to date with the latest products, services and promotions
              we have to offer. You may receive marketing communications from us
              if you have signed up to receive our newsletters, purchased
              products or services from us, or registered to any promotions we
              offer, and in each case, you have not opted-out of receiving those
              communications.
            </p>

            <p>
              If you no longer want to receive marketing communications from us,
              you can contact us at any time using the contact details below or
              by following the unsubscribe links in our marketing
              communications. If you opt-out of receiving marketing
              communications we may still process your personal data in order to
              fulfil contracts with you and in accordance with our legal,
              accounting and regulatory obligations.
            </p>

            <p>
              We will get your express opt-in consent before we share your
              personal data outside of our company for marketing purposes.
            </p>

            <p>
              We will only retain personal data for the duration necessary to
              fulfill the purposes for which it was collected. Personal data may
              also be retained for longer periods if it is solely for archiving
              purposes in the public interest, scientific or historical research
              purposes, or statistical purposes.
            </p>

            <p>
              Your Personal Data will be retained for as long as is necessary to
              fulfil or complete the purpose for which it was collected and
              until it is no longer necessary for any other legal or business
              purposes. Thereafter, we dispose of your Personal Data in a manner
              that prevents further access or processing, including but not
              limited to deletion or irreversible anonymization.
            </p>

            <p>
              We are committed to protect your Personal Data with our best
              effort. Unfortunately, no data transmission or storage over the
              Internet can be guaranteed as totally secure. Nonetheless, we have
              adopted and currently practice administrative, organizational,
              technical, and physical security measures to protect your Personal
              Data to the best of our reasonable capacity, including but not
              limited to the following:
            </p>
            <ol className="list-decimal space-y-1 pl-6">
              <li>Limiting Personal Data access to authorized</li>
              <li>
                Implementing technical solutions to ensure information security
              </li>
              <li>
                Continuous monitoring and review of Personal Data protection
                measures
              </li>
              <li>Other security measures.</li>
            </ol>

            <p>
              For any questions, concerns, or requests to exercise your rights
              outlined in this privacy policy, please contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
