import { createFileRoute } from "@tanstack/react-router";
import { HelpCircleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

function FaqPage() {
  const faqs = [
    {
      question: m.faq1Question?.() ?? "How long does delivery take?",
      answer:
        m.faq1Answer?.() ??
        "Delivery is instant! Your in-game currency will be credited within 1-5 minutes after payment confirmation.",
    },
    {
      question: m.faq2Question?.() ?? "Is it safe to use this service?",
      answer:
        m.faq2Answer?.() ??
        "100% safe! We are an authorized reseller with secure payment processing. Your account and data are protected.",
    },
    {
      question: m.faq3Question?.() ?? "What if I enter the wrong ID?",
      answer:
        m.faq3Answer?.() ??
        "Please double-check your ID before purchasing. If you make a mistake, contact our support team immediately.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <HelpCircleIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">
            {m.faqTitle?.() ?? "Frequently Asked Questions"}
          </h1>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircleIcon className="size-5 text-gaming-primary" />
              {m.faq?.() ?? "FAQ"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
