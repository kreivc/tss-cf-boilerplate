import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GameSlug } from "@test-tss/game-provider/client";
import { GameCategory } from "@test-tss/types";
import {
  ArrowLeftIcon,
  Gamepad2Icon,
  PackageIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
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

export const Route = createFileRoute("/ytta/game/$slug/edit")({
  component: EditGamePage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      orpc.game.getBySlug.queryOptions({ input: { slug: params.slug } })
    );
  },
});

function EditGamePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const gameQuery = useSuspenseQuery(
    orpc.game.getBySlug.queryOptions({ input: { slug } })
  );
  const game = gameQuery.data;

  const [name, setName] = useState("");
  const [gameSlug, setGameSlug] = useState("");
  const [category, setCategory] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Initialize form with game data
  useEffect(() => {
    if (game) {
      setName(game.name);
      setGameSlug(game.slug);
      setCategory(game.category);
      setLogo(game.logo || "");
      setBanner(game.banner || "");
      setIsActive(game.isActive);
    }
  }, [game]);

  const updateMutation = useMutation(
    orpc.game.update.mutationOptions({
      onSuccess: () => {
        toast.success("Game updated successfully");
        gameQuery.refetch();
      },
      onError: (error) => {
        toast.error(`Failed to update game: ${error.message}`);
      },
    })
  );

  const deleteMutation = useMutation(
    orpc.game.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Game deleted successfully");
        navigate({ to: "/ytta/game" });
      },
      onError: (error) => {
        toast.error(`Failed to delete game: ${error.message}`);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!game) {
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!gameSlug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }

    updateMutation.mutate({
      id: game.id,
      name: name.trim(),
      slug: gameSlug.trim() as GameSlug,
      category: category as (typeof GameCategory.options)[number],
      logo: logo.trim() || undefined,
      banner: banner.trim() || undefined,
      isActive,
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/ytta/game">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">Edit Game</h1>
            <p className="text-muted-foreground">{game.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link params={{ slug }} to="/ytta/game/$slug/item">
            <Button variant="outline">
              <PackageIcon className="mr-2 size-4" />
              Manage Items
            </Button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2Icon className="size-5 text-gaming-primary" />
              Game Details
            </CardTitle>
            <CardDescription>Update the game information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                className="border-glass-border bg-background/50"
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mobile Legends"
                value={name}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-glass-border bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="slug"
                onChange={(e) => setGameSlug(e.target.value)}
                value={gameSlug}
              >
                <option value="">Select a slug</option>
                {Object.values(GameSlug.enum).map((slugOption) => (
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
                {GameCategory.options.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <ImageUpload
                folder="games"
                label="Logo"
                onChange={setLogo}
                value={logo}
              />
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <ImageUpload
                folder="games"
                label="Banner"
                onChange={setBanner}
                value={banner}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-glass-border bg-background/50 p-4">
              <div>
                <Label className="font-medium" htmlFor="isActive">
                  Active
                </Label>
                <p className="text-muted-foreground text-sm">
                  Make this game visible to customers
                </p>
              </div>
              <Switch
                checked={isActive}
                id="isActive"
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 border-glass-border border-t pt-4">
              <Button
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteOpen(true)}
                type="button"
                variant="destructive"
              >
                <Trash2Icon className="mr-2 size-4" />
                Delete
              </Button>

              <div className="flex gap-4">
                <Link to="/ytta/game">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  className="btn-gaming"
                  disabled={updateMutation.isPending}
                  type="submit"
                >
                  <SaveIcon className="mr-2 size-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Delete Dialog */}
      <AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{game.name}"? This will
              deactivate the game and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate({ id: game.id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
