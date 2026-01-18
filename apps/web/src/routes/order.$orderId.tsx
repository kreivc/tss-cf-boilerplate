import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GAME_PARAM_FIELDS,
  type GameSlug,
  parseGameParams,
} from "@test-tss/game-provider/client";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  Loader2Icon,
  PackageIcon,
  QrCodeIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PaymentProviderRenderer } from "@/components/payment/payment-provider-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/order/$orderId")({
  component: OrderPage,
});

// Helper function to get status badge class
function getStatusBadgeClass(
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"
): string {
  switch (status) {
    case "SUCCESS":
      return "bg-emerald-500/20 text-emerald-500";
    case "FAILED":
      return "bg-red-500/20 text-red-500";
    case "PROCESSING":
      return "bg-blue-500/20 text-blue-500";
    default:
      return "bg-amber-500/20 text-amber-500";
  }
}

// Helper function to get status badge text
function getStatusBadgeText(
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"
): string {
  switch (status) {
    case "SUCCESS":
      return "✓ Completed";
    case "FAILED":
      return "✗ Failed";
    case "PROCESSING":
      return "⟳ Processing";
    default:
      return "⏳ Awaiting Payment";
  }
}

// Status Banner Components
function PendingBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shadow-amber-500/20 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <QrCodeIcon className="size-10 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Awaiting Payment</h1>
          <p className="text-white/80">
            Scan the QR code below to complete your payment
          </p>
        </div>
      </div>
    </div>
  );
}

function ProcessingBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow-blue-500/20 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Loader2Icon className="size-10 animate-spin text-white" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Processing Order</h1>
          <p className="text-white/80">
            Your payment was received. We're processing your order...
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-emerald-500/20 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <CheckCircle2Icon className="size-10 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Order Successful!</h1>
          <p className="text-white/80">
            Your top-up has been processed and delivered
          </p>
        </div>
      </div>
    </div>
  );
}

function FailedBanner() {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white shadow-red-500/20 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <AlertTriangleIcon className="size-10 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-2xl">Order Failed</h1>
          <p className="text-white/80">
            We couldn't process your order. Please try again or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBanner({
  status,
}: {
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
}) {
  switch (status) {
    case "PENDING":
      return <PendingBanner />;
    case "PROCESSING":
      return <ProcessingBanner />;
    case "SUCCESS":
      return <SuccessBanner />;
    case "FAILED":
      return <FailedBanner />;
    default:
      return <PendingBanner />;
  }
}

function GameParamsDisplay({
  inputDataJson,
  gameSlug,
  email,
}: {
  inputDataJson: string | null;
  gameSlug: string;
  email: string | null;
}) {
  if (!inputDataJson) {
    return null;
  }

  const gameParams = parseGameParams(inputDataJson);
  if (!gameParams) {
    return null;
  }

  const fields = GAME_PARAM_FIELDS[gameSlug as GameSlug] || [];

  return (
    <div>
      <h3 className="mb-2 font-medium text-muted-foreground text-sm">
        Account Information
      </h3>
      <div className="rounded-lg border bg-muted/30 p-3">
        {fields.map((field) => (
          <div
            className="flex items-center justify-between py-1 text-sm first:pt-0 last:pb-0"
            key={field.key}
          >
            <span className="text-muted-foreground">{field.label}</span>
            <span className="font-medium font-mono">
              {/* biome-ignore lint/suspicious/noExplicitAny: generic type casting needed here */}
              {(gameParams as any)[field.key] || "-"}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{email || "-"}</span>
        </div>
      </div>
    </div>
  );
}

function OrderPage() {
  const { orderId } = Route.useParams();

  // Fetch transaction with short-polling
  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useQuery(
    orpc.transaction.getById.queryOptions({
      input: { transactionId: orderId },
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        // Stop polling when status is terminal (SUCCESS or FAILED)
        if (status === "SUCCESS" || status === "FAILED") {
          return false;
        }
        // Poll every 3 seconds for PENDING or PROCESSING
        return 3000;
      },
    })
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-12 animate-spin text-gaming-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <XCircleIcon className="mx-auto mb-4 size-16 text-red-500" />
          <h1 className="mb-2 font-bold text-2xl">Order Not Found</h1>
          <p className="mb-4 text-muted-foreground">
            We couldn't find this order. Please check your order ID.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const status = transaction.status as
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED";

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Back Button */}
        <Link className="mb-6 inline-block" to="/">
          <Button size="sm" variant="ghost">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to Home
          </Button>
        </Link>

        {/* Status Banner */}
        <StatusBanner status={status} />

        {/* Payment Section for PENDING status */}
        {status === "PENDING" && transaction.paymentUrl && (
          <Card className="gaming-card mb-6">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCodeIcon className="size-5 text-gaming-primary" />
                Complete Your Payment
              </CardTitle>
              <CardDescription>
                Click the button below to proceed to the payment page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentProviderRenderer
                paymentUrl={transaction.paymentUrl}
                provider={transaction.paymentProvider}
                referenceId={transaction.referenceId ?? ""}
              />
            </CardContent>
          </Card>
        )}

        {/* Processing Animation for PROCESSING status */}
        {status === "PROCESSING" && (
          <Card className="gaming-card mb-6">
            <CardContent className="flex flex-col items-center py-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
                <div className="relative flex size-24 items-center justify-center rounded-full bg-blue-500/20">
                  <Loader2Icon className="size-12 animate-spin text-blue-500" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">
                Processing Your Order
              </h3>
              <p className="text-center text-muted-foreground text-sm">
                Please wait while we deliver your items. This usually takes less
                than a minute.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Details Card */}
        <Card className="gaming-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PackageIcon className="size-5 text-gaming-primary" />
                Order Details
              </CardTitle>
              <Badge className={getStatusBadgeClass(status)}>
                {getStatusBadgeText(status)}
              </Badge>
            </div>
            <CardDescription>Order ID: {transaction.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Game & Item */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-gaming-primary/20">
                  {transaction.game?.logo ? (
                    <img
                      alt={transaction.game.name}
                      className="size-10 rounded object-contain"
                      height={40}
                      src={transaction.game.logo}
                      width={40}
                    />
                  ) : (
                    <SparklesIcon className="size-6 text-gaming-primary" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {transaction.game?.name ?? "Unknown Game"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {transaction.item?.name ?? "Unknown Item"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="font-bold text-gaming-primary text-lg">
                  {transaction.itemDetail?.symbol ?? "$"}
                  {transaction.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <GameParamsDisplay
              email={transaction.email}
              gameSlug={transaction.game?.slug ?? ""}
              inputDataJson={transaction.inputData}
            />

            <Separator />

            {/* Payment Info */}
            <div>
              <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                Payment Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">
                    {transaction.paymentProvider}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <div className="flex items-center gap-2">
                    <span className="max-w-[150px] truncate font-mono text-xs sm:max-w-none">
                      {transaction.id}
                    </span>
                    <Button
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(transaction.id)}
                      size="icon"
                      title="Copy"
                      variant="ghost"
                    >
                      <CopyIcon className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamp */}
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4 text-muted-foreground" />
                <span className="text-sm">Order Created:</span>
              </div>
              <span className="font-medium text-sm">
                {new Date(transaction.createdAt ?? "").toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {status === "PENDING" && (
            <Button
              className="flex-1"
              onClick={() => refetch()}
              variant="outline"
            >
              <RefreshCwIcon className="mr-2 size-4" />
              Refresh Status
            </Button>
          )}
          {status === "SUCCESS" && (
            <Button className="flex-1" variant="outline">
              <DownloadIcon className="mr-2 size-4" />
              Download Receipt
            </Button>
          )}
          {status === "FAILED" && (
            <Link className="flex-1" to="/">
              <Button className="w-full" variant="outline">
                <RefreshCwIcon className="mr-2 size-4" />
                Try Again
              </Button>
            </Link>
          )}
          <Link className="flex-1" to="/">
            <Button className="btn-gaming w-full">
              <SparklesIcon className="mr-2 size-4" />
              {status === "SUCCESS" ? "Top Up Again" : "Back to Shop"}
            </Button>
          </Link>
        </div>

        {/* Trust Info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-center text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4" />
            Secure Payment
          </div>
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            Instant Delivery
          </div>
        </div>
      </div>
    </main>
  );
}
