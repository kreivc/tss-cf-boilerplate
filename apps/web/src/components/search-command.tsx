import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  FlameIcon,
  Gamepad2,
  SearchIcon,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TRENDING_SLUGS } from "@/data/game-constants";
import { m } from "@/paraglide/messages";
import { orpc } from "@/utils/orpc";

interface SearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchCommand({
  open: controlledOpen,
  onOpenChange,
}: SearchCommandProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Fetch games for search - only when dialog is open
  const gamesQuery = useQuery({
    ...orpc.game.getAll.queryOptions({ input: { activeOnly: true } }),
    enabled: open,
  });

  const games = gamesQuery.data?.data ?? [];

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  // Search results
  const results = useMemo(() => {
    if (query.length === 0) {
      return [];
    }
    const lowerQuery = query.toLowerCase();
    return games.filter(
      (game) =>
        game.name.toLowerCase().includes(lowerQuery) ||
        game.category.toLowerCase().includes(lowerQuery)
    );
  }, [games, query]);

  // Group results by category
  const groupedResults = useMemo(() => {
    return results.reduce(
      (acc, game) => {
        const category = game.category.toLowerCase();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(game);
        return acc;
      },
      {} as Record<string, typeof games>
    );
  }, [results]);

  // Trending games for default view
  const trendingGames = useMemo(() => {
    return TRENDING_SLUGS.map((slug) =>
      games.find((game) => game.slug === slug)
    ).filter((game) => game !== undefined);
  }, [games]);

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      navigate({ to: "/game/$slug", params: { slug } });
    },
    [setOpen, navigate]
  );

  const categoryLabels: Record<string, string> = {
    mobile: m.categoryMobile?.() ?? "Mobile Games",
    pc: m.categoryPc?.() ?? "PC Games",
    console: m.categoryConsole?.() ?? "Console",
    moba: "MOBA Games",
    rpg: "RPG Games",
    fps: "FPS Games",
    "battle royale": "Battle Royale",
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    mobile: <Gamepad2 className="size-4" />,
    pc: <Sparkles className="size-4" />,
    console: <Ticket className="size-4" />,
  };

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <Command>
        <CommandInput
          onValueChange={setQuery}
          placeholder={m.searchPlaceholder?.() ?? "Search games..."}
          value={query}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>{m.noResults?.() ?? "No games found."}</CommandEmpty>

          {query.length === 0 && trendingGames.length > 0 && (
            <CommandGroup heading={m.trending?.() ?? "Trending"}>
              {trendingGames.map((game) => (
                <CommandItem
                  className="flex items-center gap-3 py-3"
                  key={game.id}
                  onSelect={() => handleSelect(game.slug)}
                  value={game.name}
                >
                  <FlameIcon className="size-4 text-orange-500" />
                  <div className="flex-1">
                    <span className="font-medium">{game.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs capitalize">
                      {game.category}
                    </span>
                  </div>
                  {game.logo && (
                    <img
                      alt={game.name}
                      className="size-6 rounded object-contain"
                      height={24}
                      src={game.logo}
                      width={24}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Object.entries(groupedResults).map(([category, categoryGames]) => (
            <CommandGroup
              heading={
                <span className="flex items-center gap-2">
                  {categoryIcons[category] ?? <Gamepad2 className="size-4" />}
                  {categoryLabels[category] ?? category}
                </span>
              }
              key={category}
            >
              {categoryGames.map((game) => (
                <CommandItem
                  className="flex items-center gap-3 py-3"
                  key={game.id}
                  onSelect={() => handleSelect(game.slug)}
                  value={game.name}
                >
                  <div className="flex-1">
                    <span className="font-medium">{game.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs capitalize" variant="secondary">
                      {category}
                    </Badge>
                    {game.logo && (
                      <img
                        alt={game.name}
                        className="size-6 rounded object-contain"
                        height={24}
                        src={game.logo}
                        width={24}
                      />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

// Search trigger button component
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
      onClick={onClick}
      type="button"
    >
      <SearchIcon className="size-4" />
      <span className="hidden text-sm sm:inline">
        {m.search?.() ?? "Search..."}
      </span>
      <kbd className="hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] md:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
