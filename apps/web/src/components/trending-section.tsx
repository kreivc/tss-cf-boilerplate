import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrendingGames } from "@/data/games";
import { useCurrency } from "@/lib/currency";
import { m } from "@/paraglide/messages";
import type { Game } from "@/types/game";

function TrendingCard({ game, rank }: { game: Game; rank: number }) {
  const { formatPrice } = useCurrency();

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-badge rank-badge-1";
      case 2:
        return "rank-badge rank-badge-2";
      case 3:
        return "rank-badge rank-badge-3";
      default:
        return "rank-badge rank-badge-default";
    }
  };

  return (
    <Link
      className="gaming-card group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden"
      params={{ slug: game.slug }}
      to="/game/$slug"
    >
      {/* Rank Badge */}
      <div className={getRankBadgeClass(rank)}>{rank}</div>

      {/* Background Placeholder with Gaming Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-muted">
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${(rank * 60) % 360}, 70%, 50%) 0%, 
              transparent 60%
            )`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="gradient-overlay-strong absolute inset-0" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="mb-1 line-clamp-2 font-bold text-lg transition-colors group-hover:text-gaming-primary">
          {game.name}
        </h3>
        <p className="mb-2 text-muted-foreground text-xs">{game.publisher}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gaming-primary">
            {formatPrice(game.price)}
          </span>
          <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
            {m.topUp?.() ?? "Top Up"} →
          </span>
        </div>
      </div>

      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="glow-primary absolute inset-0 rounded-2xl" />
      </div>
    </Link>
  );
}

export function TrendingSection() {
  const trendingGames = getTrendingGames();

  return (
    <section className="py-12" id="trending">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-1 font-bold text-2xl tracking-tight sm:text-3xl">
              {m.trendingTitle?.() ?? "🔥 Trending Now"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {m.trendingSubtitle?.() ?? "Most popular games this week"}
            </p>
          </div>
          <Button
            className="hidden items-center gap-2 hover:text-gaming-primary sm:flex"
            variant="ghost"
          >
            {m.viewAll?.() ?? "View All"}
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trendingGames.map((game, index) => (
            <TrendingCard game={game} key={game.id} rank={index + 1} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Button className="gap-2" variant="outline">
            {m.viewAll?.() ?? "View All"}
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;
