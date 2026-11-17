export const IMAGE_BUCKET = "site-media";

/** Maximum size of a file stored in Supabase Storage. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Maximum size of a file picked from disk, before browser optimization. */
export const MAX_SOURCE_IMAGE_BYTES = 25 * 1024 * 1024;

/** Safe ceiling for a single file posted through a Server Action. */
export const MAX_UPLOAD_BODY_BYTES = 11 * 1024 * 1024;

export const WEBP_QUALITY = 0.9;

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
] as const;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export class ImageUploadError extends Error {}

/** Validates an image. Pass `maxBytes` to validate an unoptimized source file. */
export function validateImage(
  file: File,
  maxBytes = MAX_IMAGE_BYTES,
): string | null {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Unsupported format. Use PNG, JPG, WebP or AVIF.";
  }

  if (file.size > maxBytes) {
    return `Image is larger than ${Math.round(maxBytes / (1024 * 1024))} MB.`;
  }

  return null;
}
