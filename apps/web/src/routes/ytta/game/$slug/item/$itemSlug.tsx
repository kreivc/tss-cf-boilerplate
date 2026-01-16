import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CurrencyByCountry,
  ItemCategory,
  type ItemDetailInput,
  SupportedCountry,
} from "@test-tss/types";
import {
  ArrowLeftIcon,
  Gamepad2Icon,
  PackageIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Switch } from "@/components/ui/switch";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/game/$slug/item/$itemSlug")({
  component: EditItemPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      orpc.item.getBySlug.queryOptions({
        input: { gameSlug: params.slug, itemSlug: params.itemSlug },
      })
    );
  },
});

interface PricingRow {
  countryCode: string;
  symbol: string;
  price: string;
}

function EditItemPage() {
  const params = Route.useParams();
  const { slug } = params;
  const itemSlugParam = params.itemSlug;
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const itemQuery = useSuspenseQuery(
    orpc.item.getBySlug.queryOptions({
      input: { gameSlug: slug, itemSlug: itemSlugParam },
    })
  );
  const item = itemQuery.data;

  const [name, setName] = useState("");
  const [currentSlug, setCurrentSlug] = useState("");
  const [category, setCategory] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [pricing, setPricing] = useState<PricingRow[]>([]);

  // Initialize form with item data
  useEffect(() => {
    if (item) {
      setName(item.name);
      setCurrentSlug(item.slug);
      setCategory(item.category);
      setLogo(item.logo || "");
      setIsActive(item.isActive);
      setPricing(
        item.details.map((d) => ({
          countryCode: d.countryCode,
          symbol: d.symbol,
          price: d.price.toString(),
        }))
      );
    }
  }, [item]);

  const updateMutation = useMutation(
    orpc.item.update.mutationOptions({
      onSuccess: () => {
        toast.success("Item updated successfully");
        itemQuery.refetch();
      },
      onError: (error) => {
        toast.error(`Failed to update item: ${error.message}`);
      },
    })
  );

  const deleteMutation = useMutation(
    orpc.item.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Item deleted successfully");
        navigate({ to: "/ytta/game/$slug/item", params: { slug } });
      },
      onError: (error) => {
        toast.error(`Failed to delete item: ${error.message}`);
      },
    })
  );

  const addPricing = () => {
    const usedCountries = new Set(pricing.map((p) => p.countryCode));
    const availableCountry = SupportedCountry.options.find(
      (c) => !usedCountries.has(c)
    );

    if (availableCountry) {
      setPricing([
        ...pricing,
        {
          countryCode: availableCountry,
          symbol: CurrencyByCountry[availableCountry],
          price: "",
        },
      ]);
    } else {
      toast.error("All countries already have pricing");
    }
  };

  const removePricing = (index: number) => {
    if (pricing.length <= 1) {
      toast.error("At least one pricing is required");
      return;
    }
    setPricing(pricing.filter((_, i) => i !== index));
  };

  const updatePricing = (
    index: number,
    field: keyof PricingRow,
    value: string
  ) => {
    const updated = [...pricing];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "countryCode") {
      updated[index].symbol =
        CurrencyByCountry[value as keyof typeof CurrencyByCountry] || "";
    }

    setPricing(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) {
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!currentSlug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }

    // Validate pricing
    const validPricing: ItemDetailInput[] = [];
    for (const p of pricing) {
      const priceNum = Number.parseFloat(p.price);
      if (
        !(p.countryCode && p.symbol) ||
        Number.isNaN(priceNum) ||
        priceNum <= 0
      ) {
        toast.error("All pricing rows must have valid values");
        return;
      }
      validPricing.push({
        countryCode: p.countryCode as (typeof SupportedCountry.options)[number],
        symbol: p.symbol,
        price: priceNum,
      });
    }

    updateMutation.mutate({
      id: item.id,
      name: name.trim(),
      slug: currentSlug.trim(),
      category: category as (typeof ItemCategory.options)[number],
      logo: logo.trim() || undefined,
      isActive,
      details: validPricing,
    });
  };

  if (!item) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <PackageIcon className="mx-auto size-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Item not found</p>
          <Link params={{ slug }} to="/ytta/game/$slug/item">
            <Button className="mt-4" variant="outline">
              Back to Items
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link params={{ slug }} to="/ytta/game/$slug/item">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">Edit Item</h1>
            <p className="text-muted-foreground">{item.name}</p>
          </div>
        </div>
      </div>

      {/* Game Info */}
      {item.game && (
        <Card className="gaming-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gaming-primary/20">
                {item.game.logo ? (
                  <img
                    alt={item.game.name}
                    className="size-8 rounded object-cover"
                    height={32}
                    src={item.game.logo}
                    width={32}
                  />
                ) : (
                  <Gamepad2Icon className="size-5 text-gaming-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">{item.game.name}</p>
                <p className="text-muted-foreground text-sm">Parent Game</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Item Details */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageIcon className="size-5 text-gaming-primary" />
                Item Details
              </CardTitle>
              <CardDescription>Update the item information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  className="border-glass-border bg-background/50"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., 100 Diamonds"
                  value={name}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  className="border-glass-border bg-background/50"
                  id="slug"
                  onChange={(e) => setCurrentSlug(e.target.value)}
                  placeholder="e.g., 100-diamonds"
                  value={currentSlug}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select a category</option>
                  {ItemCategory.options.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <ImageUpload
                  folder="items"
                  label="Logo"
                  onChange={setLogo}
                  value={logo}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-glass-border bg-background/50 p-4">
                <div>
                  <Label className="font-medium" htmlFor="isActive">
                    Active
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Make this item available for purchase
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  id="isActive"
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="gaming-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    💰 Localized Pricing
                  </CardTitle>
                  <CardDescription>
                    Set prices for different countries
                  </CardDescription>
                </div>
                <Button
                  disabled={pricing.length >= SupportedCountry.options.length}
                  onClick={addPricing}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <PlusIcon className="mr-2 size-4" />
                  Add Price
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricing.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No pricing configured
                    </p>
                    <Button
                      className="mt-4"
                      onClick={addPricing}
                      type="button"
                      variant="outline"
                    >
                      <PlusIcon className="mr-2 size-4" />
                      Add First Price
                    </Button>
                  </div>
                ) : (
                  pricing.map((row, index) => (
                    <div
                      className="flex items-end gap-4 rounded-lg border border-glass-border bg-background/50 p-4"
                      // biome-ignore lint/suspicious/noArrayIndexKey: <index is a valid key>
                      key={index}
                    >
                      {/* Country */}
                      <div className="flex-1 space-y-2">
                        <Label>Country</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onChange={(e) =>
                            updatePricing(index, "countryCode", e.target.value)
                          }
                          value={row.countryCode}
                        >
                          {SupportedCountry.options.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Symbol */}
                      <div className="w-20 space-y-2">
                        <Label>Symbol</Label>
                        <Input
                          className="border-glass-border bg-background/50"
                          onChange={(e) =>
                            updatePricing(index, "symbol", e.target.value)
                          }
                          readOnly
                          value={row.symbol}
                        />
                      </div>

                      {/* Price */}
                      <div className="flex-1 space-y-2">
                        <Label>Price</Label>
                        <Input
                          className="border-glass-border bg-background/50"
                          min="0"
                          onChange={(e) =>
                            updatePricing(index, "price", e.target.value)
                          }
                          placeholder="0.00"
                          step="0.01"
                          type="number"
                          value={row.price}
                        />
                      </div>

                      {/* Remove */}
                      <Button
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removePricing(index)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between gap-4">
            <Button
              disabled={deleteMutation.isPending}
              onClick={() => setDeleteOpen(true)}
              type="button"
              variant="destructive"
            >
              <Trash2Icon className="mr-2 size-4" />
              Delete
            </Button>

            <div className="flex gap-4">
              <Link params={{ slug }} to="/ytta/game/$slug/item">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                className="btn-gaming"
                disabled={updateMutation.isPending}
                type="submit"
              >
                <SaveIcon className="mr-2 size-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Dialog */}
      <AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.name}"? This will
              deactivate the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate({ id: item.id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
