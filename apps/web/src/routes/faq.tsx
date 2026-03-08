import { createFileRoute } from "@tanstack/react-router";
import { HelpCircleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const faqs = [
  {
    question: "What is Flazbit?",
    answer:
      "Flazbit is an online platform that allows users to purchase digital game top-ups such as in-game currency, credits, or items for supported games.",
  },
  {
    question: "How does the top-up process work?",
    answer:
      "The process is simple: (1) Select the game you want to top up, (2) Enter your game ID and required information, (3) Choose the amount of credits or items, (4) Complete the payment, (5) The top-up will be delivered automatically to your game account.",
  },
  {
    question: "How long does it take to receive the top-up?",
    answer:
      "Most transactions are processed instantly after payment confirmation. However, delays may occasionally occur due to game server maintenance, provider system issues, or network congestion. These delays are related to the game provider and not the payment process.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "Flazbit supports multiple payment methods depending on your region. Available payment methods will be displayed during checkout.",
  },
  {
    question: "What should I do if I don't receive my top-up?",
    answer:
      "If you do not receive your top-up: Registered users may receive a refund to their Flazbit wallet balance. Non-registered users should contact customer support for assistance. Our support team will help verify and resolve the issue.",
  },
  {
    question: "Are purchases refundable?",
    answer:
      "All purchases are generally non-refundable because the products sold are digital goods. Refunds may only be issued if the transaction fails due to system error or the delivery fails due to provider issues. For full details please refer to the Refund Policy page.",
  },
  {
    question: "What happens if I enter the wrong game ID?",
    answer:
      "Users are responsible for entering the correct game ID and server information. Flazbit cannot guarantee recovery of top-ups delivered to incorrect accounts due to user input errors.",
  },
  {
    question: "Is Flazbit safe to use?",
    answer:
      "Yes. Flazbit implements security measures and works with trusted service providers to ensure safe and reliable transactions.",
  },
  {
    question: "Who operates Flazbit?",
    answer:
      "Flazbit is operated by PT Global Inti Digital, a digital platform company based in Indonesia.",
  },
];

function FaqPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <HelpCircleIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about Flazbit
          </p>
        </div>

        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircleIcon className="size-5 text-gaming-primary" />
              FAQ
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
