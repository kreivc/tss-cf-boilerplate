import { useMutation } from "@tanstack/react-query";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/utils/orpc";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  folder?: "games" | "items";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  folder = "games",
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);

  // Update preview when value changes externally (e.g. from parent or initial load)
  if (value && value !== preview) {
    setPreview(value);
  }

  const presignMutation = useMutation(
    orpc.upload.getPresignedUrl.mutationOptions()
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get upload details from API
      // We expect the API to return the full public URL now.
      const { key, url, putUrl } = await presignMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        folder,
      });

      // 2. Upload to R2 using the presigned URL
      await fetch(putUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      const storedValue = url || key;
      onChange(storedValue);
      setPreview(url || URL.createObjectURL(file));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // clear input
      e.target.value = "";
    }
  };

  const clearImage = () => {
    onChange("");
    setPreview(undefined);
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-col gap-4">
        {/* URL Input and Upload Trigger Row */}
        <div className="flex gap-2">
          <Input
            className="flex-1 border-glass-border bg-background/50"
            disabled={isUploading}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://example.com/image.png"
            value={value || ""}
          />
        </div>

        {/* Preview or Upload Zone */}
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-background/50 md:w-64">
            <img
              alt="Preview"
              className="h-full w-full object-cover"
              height={150}
              onError={() => setPreview(undefined)}
              src={preview}
              width={300}
            />
            <Button
              className="absolute top-2 right-2 h-6 w-6"
              onClick={clearImage}
              size="icon"
              type="button"
              variant="destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="relative flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-background/50 p-4 transition-colors hover:bg-accent/50 md:w-64">
            <div className="pointer-events-none flex flex-col items-center justify-center gap-2 text-center text-muted-foreground text-sm">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8" />
                  <span>Drag & drop or click to upload</span>
                  <span className="text-xs">Max 5MB</span>
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
        )}
      </div>
    </div>
  );
}
