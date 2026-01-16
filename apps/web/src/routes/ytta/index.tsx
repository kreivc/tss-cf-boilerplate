import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Gamepad2Icon,
  PackageIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/")({
  component: AdminDashboard,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.game.getAll.queryOptions());
  },
});

function AdminDashboard() {
  const gamesQuery = useSuspenseQuery(orpc.game.getAll.queryOptions());

  const totalGames = gamesQuery.data.total;
  const activeGames = gamesQuery.data.data.filter((g) => g.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">
            <span className="text-gradient-gaming">Admin</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your store.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/ytta/game/create">
            <Button className="btn-gaming">
              <PlusIcon className="mr-2 size-4" />
              Add Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Games */}
        <Card className="gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Total Games</CardTitle>
            <Gamepad2Icon className="size-4 text-gaming-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalGames}</div>
            <p className="text-muted-foreground text-xs">
              {activeGames} active
            </p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Active Games</CardTitle>
            <TrendingUpIcon className="size-4 text-gaming-accent" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{activeGames}</div>
            <p className="text-muted-foreground text-xs">Currently available</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Categories</CardTitle>
            <PackageIcon className="size-4 text-gaming-secondary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {new Set(gamesQuery.data.data.map((g) => g.category)).size}
            </div>
            <p className="text-muted-foreground text-xs">Unique categories</p>
          </CardContent>
        </Card>

        {/* Inactive Games */}
        <Card className="gaming-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Inactive</CardTitle>
            <Gamepad2Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalGames - activeGames}</div>
            <p className="text-muted-foreground text-xs">Games disabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/ytta/game">
              <div className="group flex items-center gap-4 rounded-xl border border-glass-border bg-background/50 p-4 transition-all hover:border-gaming-primary/50 hover:bg-gaming-primary/5">
                <div className="rounded-lg bg-gaming-primary/20 p-3">
                  <Gamepad2Icon className="size-5 text-gaming-primary" />
                </div>
                <div>
                  <p className="font-medium">Manage Games</p>
                  <p className="text-muted-foreground text-sm">
                    View and edit all games
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/ytta/game/create">
              <div className="group flex items-center gap-4 rounded-xl border border-glass-border bg-background/50 p-4 transition-all hover:border-gaming-primary/50 hover:bg-gaming-primary/5">
                <div className="rounded-lg bg-gaming-accent/20 p-3">
                  <PlusIcon className="size-5 text-gaming-accent" />
                </div>
                <div>
                  <p className="font-medium">Add New Game</p>
                  <p className="text-muted-foreground text-sm">
                    Create a new game entry
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Games */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
          <CardDescription>Latest added games</CardDescription>
        </CardHeader>
        <CardContent>
          {gamesQuery.data.data.length === 0 ? (
            <div className="py-8 text-center">
              <Gamepad2Icon className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No games yet</p>
              <Link to="/ytta/game/create">
                <Button className="mt-4" variant="outline">
                  Add your first game
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {gamesQuery.data.data.slice(0, 5).map((game) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-glass-border bg-background/50 p-4"
                  key={game.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gaming-primary/20">
                      <Gamepad2Icon className="size-5 text-gaming-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{game.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {game.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        game.isActive
                          ? "bg-gaming-accent/20 text-gaming-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {game.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link
                      params={{ slug: game.slug }}
                      to="/ytta/game/$slug/edit"
                    >
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
