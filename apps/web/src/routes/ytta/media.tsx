import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCopyIcon,
  ImageIcon,
  Loader2Icon,
  Trash2Icon,
  UploadCloudIcon,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/ytta/media")({
  component: MediaPage,
});

function MediaPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const mediaQuery = useQuery(
    orpc.media.listMedia.queryOptions({ input: { maxKeys: 100 } })
  );

  const presignMutation = useMutation(
    orpc.upload.getPresignedUrl.mutationOptions()
  );

  const deleteMutation = useMutation(
    orpc.media.deleteMedia.mutationOptions({
      onSuccess: () => {
        toast.success("Media deleted successfully");
        mediaQuery.refetch();
        setDeleteItem(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete: ${error.message}`);
      },
    })
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const { putUrl } = await presignMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        folder: "media",
      });

      await fetch(putUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      toast.success("Image uploaded successfully");
      mediaQuery.refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderMediaContent = () => {
    if (mediaQuery.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-10 animate-spin text-gaming-primary" />
          <p>Loading media files...</p>
        </div>
      );
    }

    if (mediaQuery.isError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <ImageIcon className="size-16 opacity-50" />
          <p className="text-destructive">Failed to load media</p>
          <Button onClick={() => mediaQuery.refetch()} variant="outline">
            Retry
          </Button>
        </div>
      );
    }

    const items = mediaQuery.data?.items ?? [];
    type MediaItem = NonNullable<typeof mediaQuery.data>["items"][number];

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <ImageIcon className="size-16 opacity-50" />
          <p>No media files yet</p>
          <p className="text-sm">Upload your first image above</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item: MediaItem) => (
          <div
            className="group relative overflow-hidden rounded-lg border border-glass-border bg-background/50 transition-all hover:border-gaming-primary/50"
            key={item.key}
          >
            <div className="aspect-square">
              <img
                alt={item.key}
                className="h-full w-full object-cover"
                height={200}
                src={item.url}
                width={200}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
              <p className="truncate font-medium text-white text-xs">
                {item.key.split("/").pop()}
              </p>
              <p className="text-white/70 text-xs">
                {formatFileSize(item.size)}
              </p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                onClick={() => copyUrl(item.url)}
                size="icon-sm"
                title="Copy URL"
                variant="secondary"
              >
                <ClipboardCopyIcon className="size-3" />
              </Button>
              <Button
                onClick={() =>
                  setDeleteItem({
                    key: item.key,
                    name: item.key.split("/").pop() ?? item.key,
                  })
                }
                size="icon-sm"
                title="Delete"
                variant="destructive"
              >
                <Trash2Icon className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">
            <span className="text-gradient-gaming">Media</span> Library
          </h1>
          <p className="text-muted-foreground">
            Upload and manage reusable images for games and items
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloudIcon className="size-5 text-gaming-primary" />
            Upload Media
          </CardTitle>
          <CardDescription>
            Drag and drop or click to upload images to the media library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex h-40 flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-background/50 transition-colors hover:bg-accent/50">
            <div className="pointer-events-none flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              {isUploading ? (
                <>
                  <Loader2Icon className="size-10 animate-spin text-gaming-primary" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloudIcon className="size-10" />
                  <span>Drag & drop or click to upload</span>
                  <span className="text-xs">PNG, JPG, GIF, WebP (Max 5MB)</span>
                </>
              )}
            </div>
            <Input
              accept="image/*"
              aria-label="Upload image"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              disabled={isUploading}
              onChange={handleFileChange}
              type="file"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card className="gaming-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5 text-gaming-primary" />
            Media Files
          </CardTitle>
          <CardDescription>
            {mediaQuery.isLoading
              ? "Loading..."
              : `${mediaQuery.data?.items.length ?? 0} file(s) in media library`}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderMediaContent()}</CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        open={!!deleteItem}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteItem?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItem(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteItem) {
                  deleteMutation.mutate({ key: deleteItem.key });
                }
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
