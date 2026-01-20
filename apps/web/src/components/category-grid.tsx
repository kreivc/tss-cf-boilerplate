import { Link } from "@tanstack/react-router";
import { Gamepad2Icon, SparklesIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_SLUGS, getGamePublisher } from "@/data/game-constants";
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

type CategoryTab = "all" | "mobile" | "pc" | "console";

interface GameCardProps {
  game: Game;
}

const GameCard = memo(function GameCard({ game }: GameCardProps) {
  const publisher = getGamePublisher(game.slug);

  return (
    <Link
      className="gaming-card group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-gaming-primary/50 hover:shadow-gaming-primary/10 hover:shadow-xl"
      params={{ slug: game.slug }}
      to="/game/$slug"
    >
      {/* Image/Logo Area */}
      <div className="relative flex items-center justify-center bg-gradient-to-b from-muted/20 to-transparent px-4 pt-14 pb-4">
        {/* Active indicator */}
        {game.isActive && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-white text-xs backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              Live
            </div>
          </div>
        )}

        {/* Category floating badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            className="border-none bg-background/80 text-xs capitalize backdrop-blur-md"
            variant="secondary"
          >
            {game.category}
          </Badge>
        </div>

        {game.logo ? (
          <img
            alt={game.name}
            className="size-32 rounded-2xl object-cover shadow-lg ring-2 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-gaming-primary/20 group-hover:shadow-xl group-hover:ring-gaming-primary/30 sm:size-36 md:size-40"
            height={160}
            src={game.logo}
            width={160}
          />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-2xl bg-muted/50 ring-2 ring-white/10 sm:size-36 md:size-40">
            <Gamepad2Icon className="size-14 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-bold text-base transition-colors group-hover:text-gaming-primary">
          {game.name}
        </h3>
        {publisher && (
          <p className="mb-2 text-muted-foreground text-xs">{publisher}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="size-3.5 text-gaming-primary" />
            <span className="font-medium text-gaming-primary text-xs">
              {m.topUp?.() ?? "Top Up"}
            </span>
          </div>
          <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
            →
          </span>
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gaming-primary to-gaming-secondary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
});

interface CategoryGridProps {
  games: Game[];
}

export function CategoryGrid({ games }: CategoryGridProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");

  const filteredGames = useMemo(() => {
    if (activeTab === "all") {
      return games;
    }
    const categorySlugs = CATEGORY_SLUGS[activeTab] || [];
    return games.filter((game) => categorySlugs.includes(game.slug));
  }, [games, activeTab]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as CategoryTab);
    toast.info(
      value === "all"
        ? (m.allGames?.() ?? "All Games")
        : `${value.charAt(0).toUpperCase()}${value.slice(1)} Games`,
      { duration: 1500 }
    );
  }, []);

  const tabs = useMemo(
    () => [
      { value: "all", label: m.categoryAll?.() ?? "All", icon: "🎮" },
      { value: "mobile", label: m.categoryMobile?.() ?? "Mobile", icon: "📱" },
      { value: "pc", label: m.categoryPc?.() ?? "PC", icon: "💻" },
      {
        value: "console",
        label: m.categoryConsole?.() ?? "Console",
        icon: "🎯",
      },
    ],
    []
  );

  return (
    <section className="py-12" id="categories">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gaming-primary/20">
              <Gamepad2Icon className="size-5 text-gaming-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
                {m.browseGames?.() ?? "Browse Games"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {m.browseGamesSubtitle?.() ??
                  "Find your favorite game and top up instantly"}
              </p>
            </div>
          </div>

          {/* Modern Tabs */}
          <Tabs onValueChange={handleTabChange} value={activeTab}>
            <TabsList className="h-auto gap-1 rounded-xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm">
              {tabs.map(({ value, label, icon }) => (
                <TabsTrigger
                  className="rounded-lg px-4 py-2 text-sm transition-all data-[state=active]:bg-gaming-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                  key={value}
                  value={value}
                >
                  <span className="mr-1.5">{icon}</span>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>

        {/* Empty state */}
        {filteredGames.length === 0 && (
          <div className="gaming-card py-16 text-center">
            <Gamepad2Icon className="mx-auto size-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              {m.noMoreGames?.() ?? "No games available in this category"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoryGrid;
