import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  EditIcon,
  Gamepad2Icon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/game/")({
  component: GameListPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.game.getAll.queryOptions());
  },
});

function GameListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteGameId, setDeleteGameId] = useState<string | null>(null);

  const gamesQuery = useSuspenseQuery(orpc.game.getAll.queryOptions());

  const deleteMutation = useMutation(
    orpc.game.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Game deleted successfully");
        setDeleteGameId(null);
        gamesQuery.refetch();
      },
      onError: (error) => {
        toast.error(`Failed to delete game: ${error.message}`);
      },
    })
  );

  const filteredGames = gamesQuery.data.data.filter(
    (game) =>
      game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.category.toLowerCase().includes(search.toLowerCase()) ||
      game.slug.toLowerCase().includes(search.toLowerCase())
  );

  const gameToDelete = filteredGames.find((g) => g.id === deleteGameId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">Games</h1>
          <p className="text-muted-foreground">Manage your game catalog</p>
        </div>
        <Link to="/ytta/game/create">
          <Button className="btn-gaming">
            <PlusIcon className="mr-2 size-4" />
            Add Game
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2Icon className="size-5 text-gaming-primary" />
            Game List
          </CardTitle>
          <CardDescription>
            {gamesQuery.data.total} games in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="border-glass-border bg-background/50 pl-10"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                value={search}
              />
            </div>
          </div>

          {/* Table */}
          {filteredGames.length === 0 ? (
            <div className="py-12 text-center">
              <Gamepad2Icon className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {search ? "No games match your search" : "No games yet"}
              </p>
              {!search && (
                <Link to="/ytta/game/create">
                  <Button className="mt-4" variant="outline">
                    Add your first game
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-glass-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Game</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow
                      className="transition-colors hover:bg-muted/20"
                      key={game.id}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gaming-primary/20">
                            {game.logo ? (
                              <img
                                alt={game.name}
                                className="size-8 rounded object-cover"
                                height={32}
                                src={game.logo}
                                width={32}
                              />
                            ) : (
                              <Gamepad2Icon className="size-5 text-gaming-primary" />
                            )}
                          </div>
                          <span className="font-medium">{game.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="capitalize" variant="secondary">
                          {game.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {game.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            game.isActive
                              ? "bg-gaming-accent/20 text-gaming-accent"
                              : ""
                          }
                          variant={game.isActive ? "default" : "secondary"}
                        >
                          {game.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() =>
                              navigate({
                                to: "/ytta/game/$slug/item",
                                params: { slug: game.slug },
                              })
                            }
                            size="icon-sm"
                            title="Manage Items"
                            variant="ghost"
                          >
                            <PackageIcon className="size-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              navigate({
                                to: "/ytta/game/$slug/edit",
                                params: { slug: game.slug },
                              })
                            }
                            size="icon-sm"
                            title="Edit"
                            variant="ghost"
                          >
                            <EditIcon className="size-4" />
                          </Button>
                          <Button
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteGameId(game.id)}
                            size="icon-sm"
                            title="Delete"
                            variant="ghost"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        onOpenChange={(open) => !open && setDeleteGameId(null)}
        open={deleteGameId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{gameToDelete?.name}"? This will
              deactivate the game and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                deleteGameId && deleteMutation.mutate({ id: deleteGameId })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
