import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { GameSlug } from "@test-tss/game-provider/client";
import {
  CurrencyByCountry,
  getItemSlugsByGame,
  ItemCategory,
  type ItemDetailInput,
  type ItemSlug,
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
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
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

export const Route = createFileRoute("/ytta/game/$slug/item/create")({
  component: CreateItemPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      orpc.game.getBySlug.queryOptions({ input: { slug: params.slug } })
    );
  },
});

interface PricingRow {
  countryCode: string;
  symbol: string;
  price: string;
}

function CreateItemPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const gameQuery = useSuspenseQuery(
    orpc.game.getBySlug.queryOptions({ input: { slug } })
  );
  const game = gameQuery.data;

  const [name, setName] = useState("");
  const [itemSlug, setItemSlug] = useState("");
  const [category, setCategory] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [pricing, setPricing] = useState<PricingRow[]>([
    { countryCode: "ID", symbol: "Rp", price: "" },
  ]);

  const createMutation = useMutation(
    orpc.item.create.mutationOptions({
      onSuccess: () => {
        toast.success("Item created successfully");
        navigate({ to: "/ytta/game/$slug/item", params: { slug } });
      },
      onError: (error) => {
        toast.error(`Failed to create item: ${error.message}`);
      },
    })
  );

  const addPricing = () => {
    // Find first country not already used
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

    // Auto-update symbol when country changes
    if (field === "countryCode") {
      updated[index].symbol =
        CurrencyByCountry[value as keyof typeof CurrencyByCountry] || "";
    }

    setPricing(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!game) {
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!itemSlug.trim()) {
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

    createMutation.mutate({
      gameId: game.id,
      name: name.trim(),
      slug: itemSlug.trim() as ItemSlug,
      category: category as (typeof ItemCategory.options)[number],
      logo: logo.trim() || undefined,
      isActive,
      details: validPricing,
    });
  };

  if (!game) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Gamepad2Icon className="mx-auto size-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Game not found</p>
          <Link to="/ytta/game">
            <Button className="mt-4" variant="outline">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link params={{ slug }} to="/ytta/game/$slug/item">
          <Button size="icon-sm" variant="ghost">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">Create Item</h1>
          <p className="text-muted-foreground">Add a new item to {game.name}</p>
        </div>
      </div>

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
              <CardDescription>
                Enter the basic information for the new item
              </CardDescription>
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
                <select
                  className="flex h-10 w-full rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="slug"
                  onChange={(e) => setItemSlug(e.target.value)}
                  value={itemSlug}
                >
                  <option value="">Select an item slug</option>
                  {getItemSlugsByGame(slug as GameSlug).map((slugOption) => (
                    <option key={slugOption} value={slugOption}>
                      {slugOption}
                    </option>
                  ))}
                </select>
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
                  aspectRatio="square"
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
                {pricing.map((row, index) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link params={{ slug }} to="/ytta/game/$slug/item">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              className="btn-gaming"
              disabled={createMutation.isPending}
              type="submit"
            >
              <SaveIcon className="mr-2 size-4" />
              {createMutation.isPending ? "Creating..." : "Create Item"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
