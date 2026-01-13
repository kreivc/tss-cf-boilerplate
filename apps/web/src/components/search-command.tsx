import {
  FlameIcon,
  Gamepad2,
  SearchIcon,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { GAMES, searchGames } from "@/data/games";
import { useCurrency } from "@/lib/currency";
import { m } from "@/paraglide/messages";
import type { Game } from "@/types/game";

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
  const { formatPrice } = useCurrency();

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

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

  const results = query.length > 0 ? searchGames(query) : [];

  const groupedResults = results.reduce(
    (acc, game) => {
      if (!acc[game.category]) {
        acc[game.category] = [];
      }
      acc[game.category].push(game);
      return acc;
    },
    {} as Record<string, Game[]>
  );

  const handleSelect = useCallback(
    (game: Game) => {
      setOpen(false);
      setQuery("");
      toast.success(m.gameSelected?.() ?? `Selected: ${game.name}`, {
        description: game.publisher,
      });
    },
    [setOpen]
  );

  const categoryLabels: Record<string, string> = {
    mobile: m.categoryMobile?.() ?? "Mobile Games",
    pc: m.categoryPc?.() ?? "PC Games",
    console: m.categoryConsole?.() ?? "Console",
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

          {query.length === 0 && (
            <CommandGroup heading={m.trending?.() ?? "Trending"}>
              {GAMES.filter((g) => g.trending)
                .slice(0, 5)
                .map((game) => (
                  <CommandItem
                    className="flex items-center gap-3 py-3"
                    key={game.id}
                    onSelect={() => handleSelect(game)}
                    value={game.name}
                  >
                    <FlameIcon className="size-4 text-orange-500" />
                    <div className="flex-1">
                      <span className="font-medium">{game.name}</span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {game.publisher}
                      </span>
                    </div>
                    <span className="font-semibold text-gaming-primary text-sm">
                      {formatPrice(game.price)}
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {Object.entries(groupedResults).map(([category, games]) => (
            <CommandGroup
              heading={
                <span className="flex items-center gap-2">
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                </span>
              }
              key={category}
            >
              {games.map((game) => (
                <CommandItem
                  className="flex items-center gap-3 py-3"
                  key={game.id}
                  onSelect={() => handleSelect(game)}
                  value={game.name}
                >
                  <div className="flex-1">
                    <span className="font-medium">{game.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      {game.publisher}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {game.hotDeal && (
                      <Badge className="text-xs" variant="destructive">
                        {game.discount}% OFF
                      </Badge>
                    )}
                    {game.newRelease && (
                      <Badge className="bg-gaming-accent text-black text-xs">
                        NEW
                      </Badge>
                    )}
                    <span className="font-semibold text-gaming-primary text-sm">
                      {formatPrice(game.price)}
                    </span>
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
