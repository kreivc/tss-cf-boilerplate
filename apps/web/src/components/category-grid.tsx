import { Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGamesByCategory } from "@/data/games";
import { useCurrency } from "@/lib/currency";
import { m } from "@/paraglide/messages";
import type { Game, GameCategory } from "@/types/game";

type CategoryTab = "all" | GameCategory;

const ITEMS_PER_PAGE = 10;

function GameCard({ game }: { game: Game }) {
  const { formatPrice } = useCurrency();

  return (
    <Link
      className="gaming-card group relative block cursor-pointer overflow-hidden text-left"
      params={{ slug: game.slug }}
      to="/game/$slug"
    >
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted via-card to-muted">
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${Number.parseInt(game.id, 10) * 45}, 60%, 45%) 0%, 
              transparent 70%
            )`,
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {game.hotDeal && (
            <Badge className="text-xs" variant="destructive">
              {game.discount}% OFF
            </Badge>
          )}
          {game.newRelease && (
            <Badge className="bg-gaming-accent text-black text-xs">NEW</Badge>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge
            className="glass border-glass-border text-xs capitalize"
            variant="secondary"
          >
            {game.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-semibold text-sm transition-colors group-hover:text-gaming-primary">
          {game.name}
        </h3>
        <p className="mb-2 text-muted-foreground text-xs">{game.publisher}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gaming-primary text-sm">
            {formatPrice(game.price)}
          </span>
          <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
            {m.topUp?.() ?? "Top Up"} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function GameCardSkeleton() {
  return (
    <div className="gaming-card overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const allGames = getGamesByCategory(activeTab);
  const displayedGames = allGames.slice(0, displayCount);
  const hasMore = displayCount < allGames.length;

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as CategoryTab);
    setDisplayCount(ITEMS_PER_PAGE);
    toast.info(
      value === "all"
        ? (m.allGames?.() ?? "All Games")
        : `${value.charAt(0).toUpperCase()}${value.slice(1)} Games`,
      { duration: 1500 }
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allGames.length)
      );
      setIsLoading(false);
      toast.success(m.moreGamesLoaded?.() ?? "More games loaded!", {
        duration: 1500,
      });
    }, 800);
  }, [allGames.length]);

  const tabs = [
    { value: "all", label: m.categoryAll?.() ?? "All" },
    { value: "mobile", label: m.categoryMobile?.() ?? "Mobile" },
    { value: "pc", label: m.categoryPc?.() ?? "PC" },
    { value: "console", label: m.categoryConsole?.() ?? "Console" },
  ];

  return (
    <section className="py-12" id="categories">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-1 font-bold text-2xl tracking-tight sm:text-3xl">
              {m.browseGames?.() ?? "🎮 Browse Games"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {m.browseGamesSubtitle?.() ??
                "Find your favorite game and top up instantly"}
            </p>
          </div>

          {/* Tabs */}
          <Tabs onValueChange={handleTabChange} value={activeTab}>
            <TabsList className="glass border-glass-border">
              {tabs.map(({ value, label }) => (
                <TabsTrigger
                  className="data-[state=active]:bg-gaming-primary/20 data-[state=active]:text-gaming-primary"
                  key={value}
                  value={value}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {displayedGames.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}

          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <GameCardSkeleton
                key={`skeleton-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <we need to use the index for the key>
                  i
                }`}
              />
            ))}
        </div>

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Button
              className="glass glow-hover border-glass-border hover:border-gaming-primary/30 hover:bg-gaming-primary/10 hover:text-gaming-primary"
              onClick={handleLoadMore}
              size="lg"
              variant="outline"
            >
              {m.loadMore?.() ?? "Load More"}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 flex justify-center">
            <Button
              className="glass border-glass-border"
              disabled
              size="lg"
              variant="outline"
            >
              {m.loading?.() ?? "Loading..."}
            </Button>
          </div>
        )}

        {/* No More Items */}
        {!hasMore && displayedGames.length > 0 && (
          <p className="mt-8 text-center text-muted-foreground text-sm">
            {m.noMoreGames?.() ?? "You've seen all games in this category"}
          </p>
        )}
      </div>
    </section>
  );
}

export default CategoryGrid;
