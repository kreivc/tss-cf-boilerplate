import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ClockIcon,
  CreditCardIcon,
  HelpCircleIcon,
  InfoIcon,
  MailIcon,
  PackageIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  getPackagesForGame,
  getPaymentMethodsByCategory,
} from "@/data/game-packages";
import { getGameBySlug } from "@/data/games";
import { useCurrency } from "@/lib/currency";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/game/$slug")({
  component: GameDetailPage,
});

function GameDetailPage() {
  const { slug } = Route.useParams();
  const game = getGameBySlug(slug);
  const packages = getPackagesForGame(slug);
  const paymentMethods = getPaymentMethodsByCategory();
  const { formatPrice } = useCurrency();

  // Form state
  const [accountId, setAccountId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const selectedPkg = packages.find((p) => p.id === selectedPackage);

  const handleSubmit = () => {
    if (!accountId) {
      toast.error(m.accountDataRequired?.() ?? "Please enter your account ID");
      return;
    }
    if (!selectedPackage) {
      toast.error(m.selectPackageRequired?.() ?? "Please select a package");
      return;
    }
    if (!selectedPayment) {
      toast.error(
        m.selectPaymentRequired?.() ?? "Please select a payment method"
      );
      return;
    }
    if (!email) {
      toast.error(m.emailRequired?.() ?? "Please enter your email");
      return;
    }

    toast.success(m.orderPlaced?.() ?? "Order placed successfully!", {
      description: `${selectedPkg?.name} for ${game?.name}`,
    });
  };

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl">Game not found</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    {
      num: 1,
      title: m.accountData?.() ?? "Account Data",
      icon: UserIcon,
      done: !!accountId,
    },
    {
      num: 2,
      title: m.selectPackage?.() ?? "Select Package",
      icon: PackageIcon,
      done: !!selectedPackage,
    },
    {
      num: 3,
      title: m.paymentMethod?.() ?? "Payment Method",
      icon: CreditCardIcon,
      done: !!selectedPayment,
    },
    {
      num: 4,
      title: m.emailReceipt?.() ?? "Email for Receipt",
      icon: MailIcon,
      done: !!email,
    },
  ];

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden md:h-80">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-muted">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${Number.parseInt(game.id) * 45}, 70%, 40%) 0%, 
                transparent 60%
              )`,
            }}
          />
        </div>
        <div className="gradient-overlay-strong absolute inset-0" />

        {/* Content */}
        <div className="container relative z-10 mx-auto h-full px-4">
          <div className="flex h-full flex-col justify-end pb-6">
            {/* Back Button */}
            <Link className="absolute top-4 left-4" to="/">
              <Button
                className="glass border-glass-border hover:bg-gaming-primary/10"
                size="sm"
                variant="ghost"
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                {m.home?.() ?? "Home"}
              </Button>
            </Link>

            {/* Game Info */}
            <div className="flex items-end gap-4">
              {/* Game Icon */}
              <div className="shrink-0">
                <div className="glow-primary h-20 w-20 rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary p-0.5 md:h-24 md:w-24">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-card">
                    <span className="text-3xl md:text-4xl">🎮</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <Badge className="mb-2 capitalize" variant="secondary">
                  {game.category}
                </Badge>
                <h1 className="mb-1 line-clamp-1 font-bold text-2xl md:text-3xl">
                  {game.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {game.publisher}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="border-glass-border border-b bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="scrollbar-hide flex items-center justify-between gap-2 overflow-x-auto">
            {steps.map((step, i) => (
              <div className="flex shrink-0 items-center gap-2" key={step.num}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    step.done
                      ? "bg-gaming-primary/20 text-gaming-primary"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2Icon className="size-4" />
                  ) : (
                    <step.icon className="size-4" />
                  )}
                  <span className="hidden font-medium text-sm sm:inline">
                    {step.title}
                  </span>
                  <span className="font-medium text-sm sm:hidden">
                    {step.num}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden h-px w-8 bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Steps Section (Left - Larger) */}
            <div className="space-y-6 lg:col-span-2">
              {/* Step 1: Account Data */}
              <div className="gaming-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gaming-primary/20">
                    <span className="font-bold text-gaming-primary text-sm">
                      1
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">
                    {m.accountData?.() ?? "Account Data"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accountId">
                      {m.userId?.() ?? "User ID"}
                    </Label>
                    <Input
                      className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
                      id="accountId"
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder={m.enterUserId?.() ?? "Enter your User ID"}
                      value={accountId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverId">
                      {m.serverId?.() ?? "Server ID"} (
                      {m.optional?.() ?? "Optional"})
                    </Label>
                    <Input
                      className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
                      id="serverId"
                      onChange={(e) => setServerId(e.target.value)}
                      placeholder={m.enterServerId?.() ?? "Enter Server ID"}
                      value={serverId}
                    />
                  </div>
                </div>

                <p className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
                  <InfoIcon className="size-3" />
                  {m.findIdInfo?.() ??
                    "Find your ID in game settings or profile"}
                </p>
              </div>

              {/* Step 2: Select Package */}
              <div className="gaming-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gaming-primary/20">
                    <span className="font-bold text-gaming-primary text-sm">
                      2
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">
                    {m.selectPackage?.() ?? "Select Package"}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {packages.map((pkg) => (
                    <button
                      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                        selectedPackage === pkg.id
                          ? "glow-primary border-gaming-primary bg-gaming-primary/10"
                          : "border-glass-border bg-background/50 hover:border-gaming-primary/50"
                      }`}
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {pkg.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-gaming-accent text-black text-xs">
                          Popular
                        </Badge>
                      )}
                      {pkg.bonus && (
                        <Badge
                          className="absolute -top-2 left-2 text-xs"
                          variant="destructive"
                        >
                          +{pkg.bonus}
                        </Badge>
                      )}
                      <p className="mb-1 font-semibold text-sm">{pkg.name}</p>
                      <p className="font-bold text-gaming-primary">
                        {formatPrice(pkg.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="gaming-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gaming-primary/20">
                    <span className="font-bold text-gaming-primary text-sm">
                      3
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">
                    {m.paymentMethod?.() ?? "Payment Method"}
                  </h2>
                </div>

                {/* E-Wallets */}
                <div className="mb-4">
                  <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                    E-Wallet
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {paymentMethods.ewallet.map((method) => (
                      <button
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selectedPayment === method.id
                            ? "border-gaming-primary bg-gaming-primary/10"
                            : "border-glass-border bg-background/50 hover:border-gaming-primary/50"
                        }`}
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span className="font-medium text-sm">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banks */}
                <div className="mb-4">
                  <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                    Bank Transfer
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {paymentMethods.bank.map((method) => (
                      <button
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selectedPayment === method.id
                            ? "border-gaming-primary bg-gaming-primary/10"
                            : "border-glass-border bg-background/50 hover:border-gaming-primary/50"
                        }`}
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span className="font-medium text-sm">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other */}
                <div>
                  <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                    Other
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {paymentMethods.other.map((method) => (
                      <button
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                          selectedPayment === method.id
                            ? "border-gaming-primary bg-gaming-primary/10"
                            : "border-glass-border bg-background/50 hover:border-gaming-primary/50"
                        }`}
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span className="font-medium text-sm">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Email */}
              <div className="gaming-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gaming-primary/20">
                    <span className="font-bold text-gaming-primary text-sm">
                      4
                    </span>
                  </div>
                  <h2 className="font-semibold text-lg">
                    {m.emailReceipt?.() ?? "Email for Receipt"}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{m.email?.() ?? "Email"}</Label>
                  <Input
                    className="h-12 border-glass-border bg-background/50 focus:border-gaming-primary"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={m.enterEmail?.() ?? "your@email.com"}
                    type="email"
                    value={email}
                  />
                </div>

                <p className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
                  <MailIcon className="size-3" />
                  {m.receiptInfo?.() ??
                    "We'll send your receipt and order confirmation here"}
                </p>
              </div>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <Button
                  className="btn-gaming h-14 w-full font-bold text-lg"
                  disabled={
                    !(accountId && selectedPackage && selectedPayment && email)
                  }
                  onClick={handleSubmit}
                >
                  <SparklesIcon className="mr-2 size-5" />
                  {m.buyNow?.() ?? "Buy Now"}{" "}
                  {selectedPkg && `- ${formatPrice(selectedPkg.price)}`}
                </Button>
              </div>
            </div>

            {/* Sidebar (Right - Smaller) */}
            <div className="space-y-6">
              {/* Game Details Card */}
              <div className="gaming-card sticky top-24 p-6">
                <h3 className="mb-4 font-semibold">
                  {m.gameDetails?.() ?? "Game Details"}
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher</span>
                    <span className="font-medium">{game.publisher}</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform</span>
                    <Badge className="capitalize" variant="secondary">
                      {game.category}
                    </Badge>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">In-Game Currency</span>
                  </div>
                  {game.trending && (
                    <>
                      <Separator className="bg-border/50" />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Trending</span>
                        <Badge className="bg-gaming-accent text-black">
                          🔥 Hot
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                {/* Order Summary */}
                {selectedPkg && (
                  <div className="mt-6 rounded-xl border border-gaming-primary/30 bg-gaming-primary/10 p-4">
                    <h4 className="mb-2 font-medium text-sm">Order Summary</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedPkg.name}</span>
                      <span className="font-bold text-gaming-primary">
                        {formatPrice(selectedPkg.price)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button - Desktop */}
                <div className="mt-6 hidden lg:block">
                  <Button
                    className="btn-gaming h-12 w-full font-bold"
                    disabled={
                      !(
                        accountId &&
                        selectedPackage &&
                        selectedPayment &&
                        email
                      )
                    }
                    onClick={handleSubmit}
                  >
                    <SparklesIcon className="mr-2 size-4" />
                    {m.buyNow?.() ?? "Buy Now"}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2">
                    <ShieldCheckIcon className="mx-auto mb-1 size-5 text-gaming-primary" />
                    <span className="text-muted-foreground text-xs">
                      Secure
                    </span>
                  </div>
                  <div className="p-2">
                    <ZapIcon className="mx-auto mb-1 size-5 text-gaming-accent" />
                    <span className="text-muted-foreground text-xs">
                      Instant
                    </span>
                  </div>
                  <div className="p-2">
                    <ClockIcon className="mx-auto mb-1 size-5 text-gaming-secondary" />
                    <span className="text-muted-foreground text-xs">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy Section */}
      <section className="border-glass-border border-t py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center gap-3">
            <HelpCircleIcon className="size-6 text-gaming-primary" />
            <h2 className="font-bold text-xl">
              {m.howToBuy?.() ?? "How to Top Up"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Steps */}
            <div className="gaming-card p-6">
              <Accordion collapsible defaultValue="step-1" type="single">
                <AccordionItem className="border-glass-border" value="step-1">
                  <AccordionTrigger className="hover:text-gaming-primary">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gaming-primary/20 font-bold text-gaming-primary text-xs">
                        1
                      </span>
                      {m.howToStep1Title?.() ?? "Enter Your Account ID"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {m.howToStep1Desc?.() ??
                      "Open your game, go to settings or profile, and find your User ID. Enter it in the Account Data section above."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-glass-border" value="step-2">
                  <AccordionTrigger className="hover:text-gaming-primary">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gaming-primary/20 font-bold text-gaming-primary text-xs">
                        2
                      </span>
                      {m.howToStep2Title?.() ?? "Choose Your Package"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {m.howToStep2Desc?.() ??
                      "Select the amount of in-game currency you want to purchase. Popular packages offer the best value."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-glass-border" value="step-3">
                  <AccordionTrigger className="hover:text-gaming-primary">
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gaming-primary/20 font-bold text-gaming-primary text-xs">
                        3
                      </span>
                      {m.howToStep3Title?.() ?? "Complete Payment"}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {m.howToStep3Desc?.() ??
                      "Select your preferred payment method and complete the transaction. Your currency will be delivered instantly!"}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* FAQ / Info */}
            <div className="gaming-card p-6">
              <h3 className="mb-4 font-semibold">
                {m.faqTitle?.() ?? "Frequently Asked Questions"}
              </h3>

              <Accordion collapsible type="single">
                <AccordionItem className="border-glass-border" value="faq-1">
                  <AccordionTrigger className="text-sm hover:text-gaming-primary">
                    {m.faq1Question?.() ?? "How long does delivery take?"}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {m.faq1Answer?.() ??
                      "Delivery is instant! Your in-game currency will be credited within 1-5 minutes after payment confirmation."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-glass-border" value="faq-2">
                  <AccordionTrigger className="text-sm hover:text-gaming-primary">
                    {m.faq2Question?.() ?? "Is it safe to use this service?"}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {m.faq2Answer?.() ??
                      "100% safe! We are an authorized reseller with secure payment processing. Your account and data are protected."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-glass-border" value="faq-3">
                  <AccordionTrigger className="text-sm hover:text-gaming-primary">
                    {m.faq3Question?.() ?? "What if I enter the wrong ID?"}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {m.faq3Answer?.() ??
                      "Please double-check your ID before purchasing. If you make a mistake, contact our support team immediately."}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
