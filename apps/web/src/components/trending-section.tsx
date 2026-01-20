import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, FlameIcon, TrendingUpIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGamePublisher, TRENDING_SLUGS } from "@/data/game-constants";
import { m } from "@/paraglide/messages";

// Game type matching API response
interface Game {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo: string | null;
  banner: string | null;
  isActive: boolean;
}

interface TrendingCardProps {
  game: Game;
  rank: number;
}

const TrendingCard = memo(function TrendingCard({
  game,
  rank,
}: TrendingCardProps) {
  const publisher = getGamePublisher(game.slug);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          style:
            "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-amber-500/40",
          glow: "ring-2 ring-amber-400/30",
          accent: "from-amber-500/20 via-transparent to-transparent",
        };
      case 2:
        return {
          style:
            "bg-gradient-to-br from-slate-300 to-gray-400 text-black shadow-lg shadow-gray-400/30",
          glow: "ring-2 ring-slate-400/20",
          accent: "from-slate-400/15 via-transparent to-transparent",
        };
      case 3:
        return {
          style:
            "bg-gradient-to-br from-orange-400 to-amber-600 text-black shadow-lg shadow-orange-500/30",
          glow: "ring-2 ring-orange-400/20",
          accent: "from-orange-500/15 via-transparent to-transparent",
        };
      default:
        return {
          style: "bg-muted/80 text-foreground",
          glow: "",
          accent: "from-muted/10 via-transparent to-transparent",
        };
    }
  };

  const rankConfig = getRankBadge(rank);

  return (
    <Link
      className={`group relative block w-full overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gaming-primary/60 hover:shadow-2xl hover:shadow-gaming-primary/20 ${rankConfig.glow}`}
      params={{ slug: game.slug }}
      to="/game/$slug"
    >
      {/* Rank-based subtle gradient accent at top */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${rankConfig.accent} pointer-events-none`}
      />

      {/* Animated shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Logo/Image section with floating effect */}
      <div className="relative flex items-center justify-center px-4 pt-14 pb-4">
        {game.logo ? (
          <img
            alt={game.name}
            className="size-32 rounded-2xl object-cover shadow-xl ring-2 ring-white/10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-gaming-primary/30 group-hover:ring-gaming-primary/40 sm:size-36 md:size-40"
            height={160}
            src={game.logo}
            width={160}
          />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-2xl bg-muted/50 ring-2 ring-white/10 sm:size-36 md:size-40">
            <span className="text-5xl">🎮</span>
          </div>
        )}
      </div>

      {/* Rank Badge with special styling */}
      <div
        className={`absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${rankConfig.style}`}
      >
        {rank}
      </div>

      {/* Trending fire indicator for top 3 */}
      {rank <= 3 && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 rounded-full bg-gaming-primary/20 px-2 py-1 backdrop-blur-sm">
            <FlameIcon className="size-3 animate-pulse text-gaming-primary" />
            <span className="font-medium text-gaming-primary text-xs">Hot</span>
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="p-4 pt-3">
        <h3 className="mb-1.5 line-clamp-1 font-bold text-base transition-colors group-hover:text-gaming-primary sm:text-lg">
          {game.name}
        </h3>
        <div className="flex flex-col gap-2">
          {publisher && (
            <span className="font-medium text-muted-foreground text-xs">
              {publisher}
            </span>
          )}
          <div className="flex items-center justify-between">
            <Badge
              className="w-fit border-none bg-gaming-primary/20 text-gaming-primary text-xs capitalize backdrop-blur-sm"
              variant="secondary"
            >
              {game.category}
            </Badge>
            <span className="flex translate-x-2 items-center gap-1 font-medium text-gaming-primary text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              {m.topUp?.() ?? "Top Up"}
              <ArrowRightIcon className="size-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gaming-primary via-gaming-secondary to-gaming-accent transition-all duration-500 group-hover:w-full" />
    </Link>
  );
});

interface TrendingSectionProps {
  games: Game[];
}

export function TrendingSection({ games }: TrendingSectionProps) {
  const trendingGames = useMemo(() => {
    return TRENDING_SLUGS.map((slug) =>
      games.find((game) => game.slug === slug)
    ).filter((game): game is Game => game !== undefined);
  }, [games]);

  if (trendingGames.length === 0) {
    return null;
  }

  return (
    <section className="py-12" id="trending">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gaming-primary/20">
              <TrendingUpIcon className="size-5 text-gaming-primary" />
              <div className="absolute inset-0 animate-ping rounded-xl bg-gaming-primary/20 opacity-50" />
            </div>
            <div>
              <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                {m.trendingTitle?.() ?? "Trending Now"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {m.trendingSubtitle?.() ?? "Most popular games this week"}
              </p>
            </div>
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
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
