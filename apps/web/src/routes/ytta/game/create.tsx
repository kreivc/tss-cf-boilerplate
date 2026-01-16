import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GameCategory, GameSlug } from "@test-tss/types";
import { ArrowLeftIcon, Gamepad2Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
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

export const Route = createFileRoute("/ytta/game/create")({
  component: CreateGamePage,
});

function CreateGamePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [isActive, setIsActive] = useState(true);

  const createMutation = useMutation(
    orpc.game.create.mutationOptions({
      onSuccess: () => {
        toast.success("Game created successfully");
        navigate({ to: "/ytta/game" });
      },
      onError: (error) => {
        toast.error(`Failed to create game: ${error.message}`);
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      slug: slug.trim() as GameSlug,
      category: category as (typeof GameCategory.options)[number],
      logo: logo.trim() || undefined,
      banner: banner.trim() || undefined,
      isActive,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/ytta/game">
          <Button size="icon-sm" variant="ghost">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">Create Game</h1>
          <p className="text-muted-foreground">
            Add a new game to your catalog
          </p>
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
            <CardDescription>
              Enter the basic information for the new game
            </CardDescription>
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
                onChange={(e) => setSlug(e.target.value)}
                value={slug}
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
            <div className="flex justify-end gap-4 border-glass-border border-t pt-4">
              <Link to="/ytta/game">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                className="btn-gaming"
                disabled={createMutation.isPending}
                type="submit"
              >
                <SaveIcon className="mr-2 size-4" />
                {createMutation.isPending ? "Creating..." : "Create Game"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
