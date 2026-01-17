import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  areRequiredParamsFilled,
  type GameSlug,
  getEmptyParamsForGame,
} from "@test-tss/types";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ClockIcon,
  CreditCardIcon,
  FlameIcon,
  GlobeIcon,
  HelpCircleIcon,
  MailIcon,
  PackageIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { GameInputRenderer } from "@/components/game-input-renderer";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LOCALE_TO_COUNTRY_CODE } from "@/data/game-constants";
import { getPaymentGatewaysForLocale } from "@/data/game-packages";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/game/$slug")({
  component: GameDetailPage,
  loader: async ({ context, params }) => {
    const locale = typeof window !== "undefined" ? getLocale() : "en";
    const countryCode = LOCALE_TO_COUNTRY_CODE[locale] || "US";
    await context.queryClient.ensureQueryData(
      orpc.game.getWithItems.queryOptions({
        input: { slug: params.slug, countryCode },
      })
    );
  },
});

// Types for items with details
interface ItemDetail {
  id: string;
  itemId: string;
  countryCode: string;
  symbol: string;
  price: number;
}

interface ItemWithDetails {
  id: string;
  slug: string;
  gameId: string;
  name: string;
  logo: string | null;
  category: string;
  isActive: boolean;
  details: ItemDetail[];
}

interface VerifiedAccount {
  username: string;
  params: Record<string, string>;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <we need to use a lot of state and logic for the game detail page>
function GameDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const locale = getLocale();
  const countryCode = LOCALE_TO_COUNTRY_CODE[locale] || "US";

  // Section refs for auto-scroll
  const packageSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const emailSectionRef = useRef<HTMLDivElement>(null);

  const gameQuery = useSuspenseQuery(
    orpc.game.getWithItems.queryOptions({
      input: { slug, countryCode },
    })
  );

  const game = gameQuery.data;
  const items = (game?.items ?? []) as ItemWithDetails[];

  // Get payment gateways with availability for current locale
  const paymentGateways = useMemo(
    () => getPaymentGatewaysForLocale(locale),
    [locale]
  );

  // Account verification mutation
  const checkUserMutation = useMutation(
    orpc.account.checkUser.mutationOptions({
      onSuccess: (data) => {
        setVerifiedAccount({
          username: data.username,
          params: gameParams,
        });
        toast.success("Account verified successfully!");
        // Auto-scroll to package section
        setTimeout(() => {
          packageSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      },
      onError: () => {
        toast.error("Failed to verify account. Please check your ID.");
      },
    })
  );

  // Transaction creation mutation
  const createTransactionMutation = useMutation(
    orpc.transaction.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(m.orderPlaced?.() ?? "Order placed successfully!");
        navigate({
          to: "/order/$orderId",
          params: { orderId: data.transactionId },
        });
      },
      onError: () => {
        toast.error("Failed to create transaction. Please try again.");
      },
    })
  );

  // Group items by category
  const groupedItems = useMemo(() => {
    const recommended: ItemWithDetails[] = [];
    const hot: ItemWithDetails[] = [];
    const all: ItemWithDetails[] = [];

    for (const item of items) {
      const category = item.category.toLowerCase();
      if (category === "recomended" || category === "recommended") {
        recommended.push(item);
      } else if (category === "hot") {
        hot.push(item);
      } else {
        all.push(item);
      }
    }

    return { recommended, hot, all };
  }, [items]);

  // Form state - use game-specific params
  const [gameParams, setGameParams] = useState<Record<string, string>>(() =>
    getEmptyParamsForGame(slug as GameSlug)
  );
  const [verifiedAccount, setVerifiedAccount] =
    useState<VerifiedAccount | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const selectedItem = items.find((item) => item.id === selectedPackage);

  // Get price for selected item
  const getItemPrice = (item: ItemWithDetails): string => {
    const detail = item.details[0];
    if (!detail) {
      return "N/A";
    }
    return `${detail.symbol}${detail.price.toLocaleString()}`;
  };

  // Handle account check
  const handleCheckAccount = useCallback(() => {
    if (!areRequiredParamsFilled(slug as GameSlug, gameParams)) {
      toast.error("Please fill in all required fields");
      return;
    }
    // For API, we send the first available ID field
    const accountId =
      gameParams.userId ||
      gameParams.uid ||
      gameParams.playerId ||
      gameParams.riotId ||
      gameParams.steamId ||
      "";
    checkUserMutation.mutate({
      accountId,
      gameSlug: slug,
      serverId: gameParams.serverId || undefined,
    });
  }, [gameParams, slug, checkUserMutation]);

  // Handle reset account
  const handleResetAccount = useCallback(() => {
    setVerifiedAccount(null);
    setGameParams(getEmptyParamsForGame(slug as GameSlug));
  }, [slug]);

  // Handle package selection with auto-scroll
  const handleSelectPackage = useCallback((itemId: string) => {
    setSelectedPackage(itemId);
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }, []);

  // Handle payment selection with auto-scroll
  const handleSelectPayment = useCallback((paymentId: string) => {
    setSelectedPayment(paymentId);
    setTimeout(() => {
      emailSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }, []);

  const handleSubmit = () => {
    if (!verifiedAccount) {
      toast.error("Please verify your account first");
      return;
    }
    if (!game) {
      toast.error("Game not found");
      return;
    }
    if (!(selectedPackage && selectedItem)) {
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

    // Get the item detail for the selected item
    const itemDetail = selectedItem.details[0];
    if (!itemDetail) {
      toast.error("Item price not available");
      return;
    }

    // Create real transaction via API
    createTransactionMutation.mutate({
      gameId: game.id,
      itemId: selectedItem.id,
      itemDetailId: itemDetail.id,
      email,
      gameParams: verifiedAccount.params,
      paymentMethod: selectedPayment,
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
      done: !!verifiedAccount,
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
        {/* Background - Use banner or gradient */}
        <div className="absolute inset-0">
          {game.banner ? (
            <img
              alt={game.name}
              className="size-full object-cover"
              height={320}
              src={game.banner}
              width={1280}
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-muted via-card to-muted">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(${game.name.length * 45}, 70%, 40%) 0%, 
                    transparent 60%
                  )`,
                }}
              />
            </div>
          )}
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
              {/* Game Icon/Logo */}
              <div className="shrink-0">
                <div className="glow-primary h-20 w-20 rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary p-0.5 md:h-24 md:w-24">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-card">
                    {game.logo ? (
                      <img
                        alt={game.name}
                        className="size-16 object-contain md:size-20"
                        height={80}
                        src={game.logo}
                        width={80}
                      />
                    ) : (
                      <span className="text-3xl md:text-4xl">🎮</span>
                    )}
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

                <GameInputRenderer
                  disabled={!!verifiedAccount}
                  gameSlug={slug as GameSlug}
                  isChecking={checkUserMutation.isPending}
                  onChange={setGameParams}
                  onCheck={handleCheckAccount}
                  onReset={handleResetAccount}
                  values={gameParams}
                  verifiedAccount={verifiedAccount}
                />
              </div>

              {/* Step 2: Select Package */}
              <div className="gaming-card p-6" ref={packageSectionRef}>
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

                {/* Recommended Section */}
                {groupedItems.recommended.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <StarIcon className="size-4 text-gaming-accent" />
                      <h3 className="font-medium text-gaming-accent">
                        Recommended
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {groupedItems.recommended.map((item) => (
                        <button
                          className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                            selectedPackage === item.id
                              ? "glow-primary border-gaming-accent bg-gaming-accent/20"
                              : "border-gaming-accent/30 bg-gradient-to-br from-gaming-accent/10 to-transparent hover:border-gaming-accent/50"
                          }`}
                          key={item.id}
                          onClick={() => handleSelectPackage(item.id)}
                          type="button"
                        >
                          <Badge className="absolute -top-1 -right-1 bg-gaming-accent text-black text-xs">
                            ⭐ Best Value
                          </Badge>
                          <div className="flex items-center gap-3">
                            {item.logo && (
                              <img
                                alt={item.name}
                                className="size-10 rounded-lg object-contain"
                                height={40}
                                src={item.logo}
                                width={40}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">{item.name}</p>
                              <p className="font-bold text-gaming-accent text-lg">
                                {getItemPrice(item)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hot Section */}
                {groupedItems.hot.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <FlameIcon className="size-4 text-orange-500" />
                      <h3 className="font-medium text-orange-500">Hot</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {groupedItems.hot.map((item) => (
                        <button
                          className={`relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all ${
                            selectedPackage === item.id
                              ? "glow-primary border-orange-500 bg-orange-500/20"
                              : "border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent hover:border-orange-500/50"
                          }`}
                          key={item.id}
                          onClick={() => handleSelectPackage(item.id)}
                          type="button"
                        >
                          <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs">
                            🔥
                          </Badge>
                          <div className="flex flex-col items-center gap-2 text-center">
                            {item.logo && (
                              <img
                                alt={item.name}
                                className="size-8 rounded object-contain"
                                height={32}
                                src={item.logo}
                                width={32}
                              />
                            )}
                            <p className="line-clamp-1 font-medium text-sm">
                              {item.name}
                            </p>
                            <p className="font-bold text-orange-500">
                              {getItemPrice(item)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Items Section */}
                {groupedItems.all.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <PackageIcon className="size-4 text-muted-foreground" />
                      <h3 className="font-medium text-muted-foreground">
                        All Packages
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {groupedItems.all.map((item) => (
                        <button
                          className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                            selectedPackage === item.id
                              ? "glow-primary border-gaming-primary bg-gaming-primary/10"
                              : "border-glass-border bg-background/50 hover:border-gaming-primary/50"
                          }`}
                          key={item.id}
                          onClick={() => handleSelectPackage(item.id)}
                          type="button"
                        >
                          <div className="flex items-center gap-2">
                            {item.logo && (
                              <img
                                alt={item.name}
                                className="size-6 rounded object-contain"
                                height={24}
                                src={item.logo}
                                width={24}
                              />
                            )}
                            <p className="mb-1 line-clamp-1 font-semibold text-sm">
                              {item.name}
                            </p>
                          </div>
                          <p className="font-bold text-gaming-primary">
                            {getItemPrice(item)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {items.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">
                    No packages available for this game
                  </p>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className="gaming-card p-6" ref={paymentSectionRef}>
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

                {/* Payment Gateways */}
                <div className="mb-4">
                  <h3 className="mb-3 font-medium text-muted-foreground text-sm">
                    Payment Gateway
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {paymentGateways.map((gateway) => {
                      const isDisabled = !gateway.isAvailable;
                      const getPaymentButtonClass = () => {
                        if (selectedPayment === gateway.id) {
                          return "border-gaming-primary bg-gaming-primary/10";
                        }
                        if (isDisabled) {
                          return "cursor-not-allowed border-glass-border bg-background/30 opacity-50";
                        }
                        return "border-glass-border bg-background/50 hover:border-gaming-primary/50";
                      };
                      const button = (
                        <button
                          className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${getPaymentButtonClass()}`}
                          disabled={isDisabled}
                          key={gateway.id}
                          onClick={() =>
                            !isDisabled && handleSelectPayment(gateway.id)
                          }
                          type="button"
                        >
                          <span className="text-2xl">{gateway.icon}</span>
                          <div className="flex-1 text-left">
                            <span className="font-semibold">
                              {gateway.name}
                            </span>
                            {isDisabled && (
                              <p className="flex items-center gap-1 text-muted-foreground text-xs">
                                <GlobeIcon className="size-3" />
                                Indonesia only
                              </p>
                            )}
                          </div>
                          {selectedPayment === gateway.id && (
                            <CheckCircle2Icon className="size-5 text-gaming-primary" />
                          )}
                        </button>
                      );

                      if (isDisabled) {
                        return (
                          <Tooltip key={gateway.id}>
                            <TooltipTrigger render={<div className="w-full" />}>
                              {button}
                            </TooltipTrigger>
                            <TooltipContent>
                              This payment method is only available in
                              Indonesia. Please change your language to
                              Indonesian to use {gateway.name}.
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return button;
                    })}
                  </div>
                </div>
              </div>

              {/* Step 4: Email */}
              <div className="gaming-card p-6" ref={emailSectionRef}>
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
                    !(
                      verifiedAccount &&
                      selectedPackage &&
                      selectedPayment &&
                      email
                    )
                  }
                  onClick={handleSubmit}
                >
                  <SparklesIcon className="mr-2 size-5" />
                  {m.buyNow?.() ?? "Buy Now"}{" "}
                  {selectedItem && `- ${getItemPrice(selectedItem)}`}
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
                    <span className="text-muted-foreground">Category</span>
                    <Badge className="capitalize" variant="secondary">
                      {game.category}
                    </Badge>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">In-Game Currency</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      className={
                        game.isActive
                          ? "bg-gaming-accent/20 text-gaming-accent"
                          : ""
                      }
                      variant={game.isActive ? "default" : "secondary"}
                    >
                      {game.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Order Summary */}
                {selectedItem && (
                  <div className="mt-6 rounded-xl border border-gaming-primary/30 bg-gaming-primary/10 p-4">
                    <h4 className="mb-2 font-medium text-sm">Order Summary</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedItem.name}</span>
                      <span className="font-bold text-gaming-primary">
                        {getItemPrice(selectedItem)}
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
                        verifiedAccount &&
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
              <Accordion>
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

              <Accordion>
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
