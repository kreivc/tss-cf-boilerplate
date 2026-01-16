import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
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

export const Route = createFileRoute("/ytta/game/$slug/item/")({
  component: ItemListPage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      orpc.item.getByGame.queryOptions({ input: { gameSlug: params.slug } })
    );
  },
});

function ItemListPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const itemsQuery = useSuspenseQuery(
    orpc.item.getByGame.queryOptions({ input: { gameSlug: slug } })
  );

  const deleteMutation = useMutation(
    orpc.item.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Item deleted successfully");
        setDeleteItemId(null);
        itemsQuery.refetch();
      },
      onError: (error) => {
        toast.error(`Failed to delete item: ${error.message}`);
      },
    })
  );

  const game = itemsQuery.data.game;
  const items = itemsQuery.data.data;

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
  );

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

  // Get primary price (first detail) for display
  const getPrimaryPrice = (item: (typeof items)[0]) => {
    if (item.details && item.details.length > 0) {
      const detail = item.details[0];
      return `${detail.symbol}${detail.price.toLocaleString()}`;
    }
    return "No price";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link params={{ slug }} to="/ytta/game/$slug/edit">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">Items</h1>
            <p className="text-muted-foreground">
              Manage items for {game.name}
            </p>
          </div>
        </div>
        <Link params={{ slug }} to="/ytta/game/$slug/item/create">
          <Button className="btn-gaming">
            <PlusIcon className="mr-2 size-4" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Game Info */}
      <Card className="gaming-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gaming-primary/20">
              {game.logo ? (
                <img
                  alt={game.name}
                  className="size-10 rounded object-cover"
                  height={40}
                  src={game.logo}
                  width={40}
                />
              ) : (
                <Gamepad2Icon className="size-6 text-gaming-primary" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{game.name}</h2>
              <div className="flex items-center gap-2">
                <Badge className="capitalize" variant="secondary">
                  {game.category}
                </Badge>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item List */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageIcon className="size-5 text-gaming-primary" />
            Item List
          </CardTitle>
          <CardDescription>
            {itemsQuery.data.total} items in total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="border-glass-border bg-background/50 pl-10"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                value={search}
              />
            </div>
          </div>

          {/* Table */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <PackageIcon className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {search ? "No items match your search" : "No items yet"}
              </p>
              {!search && (
                <Link params={{ slug }} to="/ytta/game/$slug/item/create">
                  <Button className="mt-4" variant="outline">
                    Add your first item
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-glass-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow
                      className="transition-colors hover:bg-muted/20"
                      key={item.id}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gaming-secondary/20">
                            {item.logo ? (
                              <img
                                alt={item.name}
                                className="size-8 rounded object-cover"
                                height={32}
                                src={item.logo}
                                width={32}
                              />
                            ) : (
                              <PackageIcon className="size-5 text-gaming-secondary" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <p className="text-muted-foreground text-xs">
                              {item.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="capitalize" variant="secondary">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gaming-primary">
                          {getPrimaryPrice(item)}
                        </span>
                        {item.details && item.details.length > 1 && (
                          <span className="ml-1 text-muted-foreground text-xs">
                            +{item.details.length - 1} more
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.isActive
                              ? "bg-gaming-accent/20 text-gaming-accent"
                              : ""
                          }
                          variant={item.isActive ? "default" : "secondary"}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() =>
                              navigate({
                                to: "/ytta/game/$slug/item/$itemSlug",
                                params: { slug, itemSlug: item.slug },
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
                            onClick={() => setDeleteItemId(item.id)}
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
        onOpenChange={(open) => !open && setDeleteItemId(null)}
        open={deleteItemId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This will deactivate
              the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                deleteItemId && deleteMutation.mutate({ id: deleteItemId })
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
