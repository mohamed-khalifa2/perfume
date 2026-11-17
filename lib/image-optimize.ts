import {
  MAX_SOURCE_IMAGE_BYTES,
  MAX_UPLOAD_BODY_BYTES,
  WEBP_QUALITY,
  validateImage,
} from "@/lib/media";

/** Guard against decoding absurd images and exhausting browser memory. */
const MAX_PIXELS = 80_000_000;

export type OptimizationResult = {
  file: File;
  originalBytes: number;
  optimizedBytes: number;
  converted: boolean;
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function canEncodeWebp(): boolean {
  if (typeof document === "undefined" || typeof createImageBitmap !== "function") {
    return false;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

/** Reads all selected source files and validates them against the source cap. */
export function readSourceFiles(
  files: File[],
): { accepted: File[]; problem: string | null } {
  const accepted: File[] = [];
  let problem: string | null = null;

  // Without WebP encoding the original bytes are posted as-is, so stay below
  // the Server Action body limit instead of letting the request fail with 413.
  const maxBytes = canEncodeWebp()
    ? MAX_SOURCE_IMAGE_BYTES
    : MAX_UPLOAD_BODY_BYTES;

  for (const file of files) {
    const message = validateImage(file, maxBytes);
    if (message) {
      problem = `${file.name}: ${message}`;
      continue;
    }
    accepted.push(file);
  }

  return { accepted, problem };
}

/**
 * Re-encodes an image as WebP at the original pixel dimensions. If the browser
 * cannot encode WebP, the result is not smaller, or anything fails, the
 * original file is returned untouched so an upload is never blocked.
 */
export async function optimizeImage(file: File): Promise<OptimizationResult> {
  const fallback: OptimizationResult = {
    file,
    originalBytes: file.size,
    optimizedBytes: file.size,
    converted: false,
  };

  try {
    if (!canEncodeWebp()) return fallback;

    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const width = bitmap.width;
    const height = bitmap.height;

    if (!width || !height || width * height > MAX_PIXELS) {
      bitmap.close();
      return fallback;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      bitmap.close();
      canvas.width = 0;
      canvas.height = 0;
      return fallback;
    }

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
    });

    canvas.width = 0;
    canvas.height = 0;

    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) {
      return fallback;
    }

    const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;

    return {
      file: new File([blob], name, {
        type: "image/webp",
        lastModified: Date.now(),
      }),
      originalBytes: file.size,
      optimizedBytes: blob.size,
      converted: true,
    };
  } catch {
    return fallback;
  }
}

export function isWithinUploadLimit(file: File): boolean {
  return file.size <= MAX_UPLOAD_BODY_BYTES;
}

/** Replaces a file input's files. Used so the optimized bytes are what get posted. */
export function setFileInputFiles(input: HTMLInputElement, files: File[]): void {
  if (typeof DataTransfer === "undefined") return;

  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}
