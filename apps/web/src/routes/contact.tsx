import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon, MessageSquareIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { m } from "@/paraglide/messages";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const submitMutation = useMutation(
    orpc.contact.submit.mutationOptions({
      onSuccess: () => {
        toast.success(m.messageSent?.() ?? "Message Sent!", {
          description:
            m.messageSentDescription?.() ??
            "Thank you for reaching out. We'll get back to you soon.",
        });
        setName("");
        setEmail("");
        setQuestion("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ name, email, question });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <MessageSquareIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">
            {m.contactPageTitle?.() ?? "Contact Us"}
          </h1>
          <p className="text-muted-foreground">
            {m.contactPageDescription?.() ??
              "Have a question or need help? Send us a message and we'll get back to you as soon as possible."}
          </p>
        </div>

        {/* Contact Form */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="size-5 text-gaming-primary" />
              {m.sendMessage?.() ?? "Send Message"}
            </CardTitle>
            <CardDescription>
              {m.contactPageDescription?.() ??
                "Have a question or need help? Send us a message and we'll get back to you as soon as possible."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">{m.yourName?.() ?? "Your Name"}</Label>
                <Input
                  className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
                  disabled={submitMutation.isPending}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={m.yourName?.() ?? "Your Name"}
                  required
                  value={name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{m.yourEmail?.() ?? "Your Email"}</Label>
                <Input
                  className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
                  disabled={submitMutation.isPending}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={m.enterEmail?.() ?? "your@email.com"}
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">
                  {m.yourQuestion?.() ?? "Your Question"}
                </Label>
                <Textarea
                  className="min-h-32 border-glass-border bg-background/50 focus:border-gaming-primary"
                  disabled={submitMutation.isPending}
                  id="question"
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={m.yourQuestion?.() ?? "Your Question"}
                  required
                  value={question}
                />
              </div>

              <Button
                className="btn-gaming h-12 w-full font-semibold"
                disabled={
                  submitMutation.isPending ||
                  !name.trim() ||
                  !email.trim() ||
                  !question.trim()
                }
                type="submit"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    {m.submitting?.() ?? "Submitting..."}
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 size-4" />
                    {m.sendMessage?.() ?? "Send Message"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
