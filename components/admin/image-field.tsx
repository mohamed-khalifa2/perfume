"use client";

import { ImagePlus, Link2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";

import {
  formatBytes,
  isWithinUploadLimit,
  optimizeImage,
  readSourceFiles,
  setFileInputFiles,
} from "@/lib/image-optimize";
import { ACCEPTED_IMAGE_TYPES, MAX_SOURCE_IMAGE_BYTES } from "@/lib/media";
import { cn } from "@/lib/cn";
import { useFormSubmitGuard } from "./use-form-submit-guard";

const ASPECT_CLASSES = {
  square: "aspect-square",
  wide: "aspect-video",
  portrait: "aspect-3/4",
} as const;

export type ImageFieldProps = {
  /** Name of the text input that carries an existing/pasted image URL. */
  urlName?: string;
  /** Name of the file input read by the server action. */
  fileName?: string;
  label?: string;
  hint?: string;
  defaultValue?: string | null;
  aspect?: keyof typeof ASPECT_CLASSES;
  className?: string;
};

export function ImageField({
  urlName = "image_url",
  fileName = "image_file",
  label = "Image",
  hint,
  defaultValue,
  aspect = "portrait",
  className,
}: ImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const selectionRef = useRef(0);
  const { registerInput, runWhileGuarding } = useFormSubmitGuard();

  const [url, setUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [optimizationNote, setOptimizationNote] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const selected = input.files?.[0] ?? null;
    const selection = ++selectionRef.current;

    setError(null);

    if (!selected) {
      clearObjectUrl();
      setFileLabel(null);
      setOptimizationNote(null);
      setPreview(url || null);
      return;
    }

    const { problem } = readSourceFiles([selected]);
    if (problem) {
      input.value = "";
      setError(problem);
      setFileLabel(null);
      setOptimizationNote(null);
      return;
    }

    setFileLabel(selected.name);
    setOptimizationNote("Optimizing image…");
    setIsOptimizing(true);

    void runWhileGuarding(async () => {
      const result = await optimizeImage(selected);
      if (selection !== selectionRef.current) return;

      if (!isWithinUploadLimit(result.file)) {
        setError(
          `Still ${formatBytes(result.file.size)} after optimization. Please choose a smaller image.`,
        );
        setFileLabel(null);
        setOptimizationNote(null);
        return;
      }

      setFileInputFiles(input, [result.file]);

      clearObjectUrl();
      const objectUrl = URL.createObjectURL(result.file);
      objectUrlRef.current = objectUrl;
      setPreview(objectUrl);
      setFileLabel(result.file.name);
      setOptimizationNote(
        result.converted
          ? `${formatBytes(result.originalBytes)} → ${formatBytes(result.optimizedBytes)} WebP · full resolution`
          : `Original kept · ${formatBytes(result.originalBytes)} (already optimal)`,
      );
    }).finally(() => {
      if (selection === selectionRef.current) setIsOptimizing(false);
    });
  };

  const clear = () => {
    selectionRef.current += 1;
    clearObjectUrl();
    setPreview(null);
    setUrl("");
    setFileLabel(null);
    setOptimizationNote(null);
    setIsOptimizing(false);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={`${inputId}-file`}
          className="text-xs uppercase tracking-label text-muted"
        >
          {label}
        </label>
        {fileLabel || url ? (
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-1.5 text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            <Trash2 className="size-3" aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          className={cn(
            "relative w-36 shrink-0 overflow-hidden border border-line bg-paper-deep",
            ASPECT_CLASSES[aspect],
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt=""
              fill
              sizes="144px"
              unoptimized={preview.startsWith("blob:")}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <ImagePlus className="size-6" aria-hidden />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <input
              ref={(node) => {
                fileRef.current = node;
                registerInput(node);
              }}
              id={`${inputId}-file`}
              type="file"
              name={fileName}
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleFile}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isOptimizing}
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-xs uppercase tracking-label text-ink transition-colors hover:border-ink disabled:cursor-wait disabled:opacity-60"
            >
              <ImagePlus className="size-4" aria-hidden />
              {isOptimizing
                ? "Optimizing…"
                : fileLabel
                  ? "Replace image"
                  : "Upload image"}
            </button>
            <p className="mt-2 truncate text-xs text-muted">
              {optimizationNote ??
                fileLabel ??
                `PNG, JPG, WebP or AVIF · up to ${Math.round(MAX_SOURCE_IMAGE_BYTES / (1024 * 1024))} MB`}
            </p>
          </div>

          <div className="relative">
            <Link2
              className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted"
              aria-hidden
            />
            <input
              type="url"
              name={urlName}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                if (!fileLabel) setPreview(event.target.value || null);
              }}
              placeholder="or paste an image URL"
              className="h-11 w-full border border-line bg-transparent pr-4 pl-10 text-sm text-ink transition-colors placeholder:text-muted/70 focus:border-ink focus:outline-none"
            />
          </div>

          {error ? (
            <p className="text-xs text-gold-on-light" role="alert">
              {error}
            </p>
          ) : null}

          {hint ? <p className="text-xs text-muted">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
