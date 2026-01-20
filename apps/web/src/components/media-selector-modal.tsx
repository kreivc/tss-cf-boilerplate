import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, ImageIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/utils/orpc";

interface MediaSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function MediaSelectorModal({
  open,
  onOpenChange,
  onSelect,
}: MediaSelectorModalProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const mediaQuery = useSuspenseQuery(
    orpc.media.listMedia.queryOptions({
      input: { maxKeys: 100 },
    })
  );

  const filteredItems = mediaQuery.data.items.filter((item) =>
    item.key.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
      setSelectedUrl(null);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="size-5 text-gaming-primary" />
            Select from Media Library
          </DialogTitle>
          <DialogDescription>
            Choose an image from your media library
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="border-glass-border bg-background/50 pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            value={search}
          />
        </div>

        {/* Media Grid */}
        <ScrollArea className="h-[400px]">
          {filteredItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <ImageIcon className="size-12 opacity-50" />
              <p>No media found</p>
              <p className="text-sm">
                Upload images in the Media Library first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 p-1 sm:grid-cols-4">
              {filteredItems.map((item) => (
                <button
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 bg-background/50 transition-all hover:border-gaming-primary/50 ${
                    selectedUrl === item.url
                      ? "border-gaming-primary ring-2 ring-gaming-primary/20"
                      : "border-glass-border"
                  }`}
                  key={item.key}
                  onClick={() => setSelectedUrl(item.url)}
                  type="button"
                >
                  <img
                    alt={item.key}
                    className="h-full w-full object-cover"
                    height={150}
                    src={item.url}
                    width={150}
                  />
                  {selectedUrl === item.url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gaming-primary/20">
                      <div className="rounded-full bg-gaming-primary p-2">
                        <CheckIcon className="size-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate text-white text-xs">
                      {item.key.split("/").pop()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            className="btn-gaming"
            disabled={!selectedUrl}
            onClick={handleSelect}
          >
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper with Suspense for lazy loading
import { Suspense } from "react";

export function MediaSelectorModalWrapper(props: MediaSelectorModalProps) {
  if (!props.open) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <Dialog onOpenChange={props.onOpenChange} open={props.open}>
          <DialogContent className="max-w-3xl">
            <div className="flex h-[500px] items-center justify-center">
              <Loader2Icon className="size-8 animate-spin text-gaming-primary" />
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <MediaSelectorModal {...props} />
    </Suspense>
  );
}
