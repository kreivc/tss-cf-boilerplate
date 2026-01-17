import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon, PackageSearchIcon, SearchIcon } from "lucide-react";
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

export const Route = createFileRoute("/find-order")({
  component: FindOrderPage,
});

function FindOrderPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      toast.error("Please enter an Order ID");
      return;
    }

    setIsSearching(true);

    // Navigate to the order page - validation will happen there
    navigate({ to: "/order/$orderId", params: { orderId: orderId.trim() } });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gaming-primary to-gaming-secondary shadow-gaming-primary/30 shadow-lg">
            <PackageSearchIcon className="size-10 text-white" />
          </div>
          <h1 className="mb-2 font-bold text-3xl">Find Your Order</h1>
          <p className="text-muted-foreground">
            Enter your Order ID to check the status and details of your
            transaction
          </p>
        </div>

        {/* Search Card */}
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="size-5 text-gaming-primary" />
              Order Lookup
            </CardTitle>
            <CardDescription>
              Your Order ID was sent to your email after purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID / Transaction ID</Label>
                <Input
                  className="h-12 border-glass-border bg-background/50 font-mono focus:border-gaming-primary"
                  disabled={isSearching}
                  id="orderId"
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., 01234567-89ab-cdef-0123-456789abcdef"
                  value={orderId}
                />
              </div>

              <Button
                className="btn-gaming h-12 w-full font-semibold"
                disabled={isSearching || !orderId.trim()}
                type="submit"
              >
                {isSearching ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2 size-4" />
                    Find Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 rounded-xl border border-glass-border bg-card/30 p-4">
          <h3 className="mb-2 font-medium text-sm">
            Can't find your Order ID?
          </h3>
          <ul className="space-y-1 text-muted-foreground text-sm">
            <li>• Check your email for the order confirmation</li>
            <li>• Look in your spam or promotions folder</li>
            <li>• Contact our support if you still can't find it</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
