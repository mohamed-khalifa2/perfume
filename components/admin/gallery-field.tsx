"use client";

import { ImagePlus, Trash2, Undo2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  formatBytes,
  isWithinUploadLimit,
  optimizeImage,
  readSourceFiles,
  setFileInputFiles,
} from "@/lib/image-optimize";
import { ACCEPTED_IMAGE_TYPES, MAX_SOURCE_IMAGE_BYTES } from "@/lib/media";
import { useFormSubmitGuard } from "./use-form-submit-guard";

export type GalleryImage = {
  id: string;
  imageUrl: string;
};

type GalleryFieldProps = {
  existing?: GalleryImage[];
  fileFieldName?: string;
  removeFieldName?: string;
  label?: string;
};

type PendingFile = {
  key: string;
  file: File;
  previewUrl: string;
  originalBytes: number;
  optimizedBytes: number;
  converted: boolean;
};

export function GalleryField({
  existing = [],
  fileFieldName = "gallery_files",
  removeFieldName = "remove_images",
  label = "Gallery images",
}: GalleryFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<PendingFile[]>([]);
  const { registerInput, runWhileGuarding } = useFormSubmitGuard();

  const [pending, setPending] = useState<PendingFile[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePending = useCallback((next: PendingFile[]) => {
    pendingRef.current = next;
    setPending(next);

    if (inputRef.current) {
      setFileInputFiles(
        inputRef.current,
        next.map((item) => item.file),
      );
    }
  }, []);

  useEffect(() => {
    const files = pendingRef.current;

    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const selected = Array.from(input.files ?? []);
    if (selected.length === 0) return;

    const { accepted, problem } = readSourceFiles(selected);
    setError(problem);
    input.value = "";

    if (accepted.length === 0) return;

    setIsOptimizing(true);

    void runWhileGuarding(async () => {
      const results = await Promise.all(accepted.map(optimizeImage));
      const oversized = results.some(
        (result) => !isWithinUploadLimit(result.file),
      );

      const additions: PendingFile[] = results
        .filter((result) => isWithinUploadLimit(result.file))
        .map((result) => ({
        key: `${result.file.name}-${result.file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file: result.file,
        previewUrl: URL.createObjectURL(result.file),
        originalBytes: result.originalBytes,
        optimizedBytes: result.optimizedBytes,
        converted: result.converted,
      }));

      updatePending([...pendingRef.current, ...additions]);

      if (oversized) {
        setError(
          "Some images were still too large after optimization and were skipped.",
        );
      }
    }).finally(() => setIsOptimizing(false));
  };

  const removePending = (key: string) => {
    const target = pendingRef.current.find((item) => item.key === key);
    if (target) URL.revokeObjectURL(target.previewUrl);
    updatePending(pendingRef.current.filter((item) => item.key !== key));
  };

  const toggleExisting = (id: string) => {
    setRemoved((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const convertedCount = pending.filter((item) => item.converted).length;
  const bytesSaved = pending.reduce(
    (total, item) => total + (item.originalBytes - item.optimizedBytes),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-label text-muted">{label}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isOptimizing}
          className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-xs uppercase tracking-label text-ink transition-colors hover:border-ink disabled:cursor-wait disabled:opacity-60"
        >
          <ImagePlus className="size-4" aria-hidden />
          {isOptimizing ? "Optimizing…" : "Add images"}
        </button>
      </div>

      <input
        ref={(node) => {
          inputRef.current = node;
          registerInput(node);
        }}
        id={inputId}
        type="file"
        name={fileFieldName}
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        onChange={handleSelect}
        className="sr-only"
      />

      {removed.map((id) => (
        <input key={id} type="hidden" name={removeFieldName} value={id} />
      ))}

      {existing.length === 0 && pending.length === 0 ? (
        <p className="text-xs text-muted">
          No gallery images yet. PNG, JPG, WebP or AVIF · up to{" "}
          {Math.round(MAX_SOURCE_IMAGE_BYTES / (1024 * 1024))} MB each. Large
          images are converted to WebP automatically.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {existing.map((image) => {
            const isRemoved = removed.includes(image.id);

            return (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden border border-line bg-paper-deep"
              >
                <Image
                  src={image.imageUrl}
                  alt=""
                  fill
                  sizes="160px"
                  className={
                    isRemoved ? "object-cover opacity-30" : "object-cover"
                  }
                />
                <button
                  type="button"
                  onClick={() => toggleExisting(image.id)}
                  aria-label={isRemoved ? "Keep image" : "Remove image"}
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center bg-ink/80 text-cream transition-colors hover:bg-ink"
                >
                  {isRemoved ? (
                    <Undo2 className="size-3.5" aria-hidden />
                  ) : (
                    <Trash2 className="size-3.5" aria-hidden />
                  )}
                </button>
              </div>
            );
          })}

          {pending.map((item) => (
            <div
              key={item.key}
              title={`${formatBytes(item.originalBytes)} → ${formatBytes(item.optimizedBytes)}`}
              className="relative aspect-square overflow-hidden border border-gold/40 bg-paper-deep"
            >
              <Image
                src={item.previewUrl}
                alt=""
                fill
                sizes="160px"
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removePending(item.key)}
                aria-label="Discard this upload"
                className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center bg-ink/80 text-cream transition-colors hover:bg-ink"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      {convertedCount > 0 ? (
        <p className="text-xs text-muted">
          {convertedCount} image{convertedCount === 1 ? "" : "s"} optimized to
          WebP at full resolution · {formatBytes(bytesSaved)} saved
        </p>
      ) : null}

      {error ? (
        <p className="text-xs text-gold-muted" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
