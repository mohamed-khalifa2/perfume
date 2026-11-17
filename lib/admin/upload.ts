import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  IMAGE_BUCKET,
  IMAGE_EXTENSIONS,
  ImageUploadError,
  validateImage,
} from "@/lib/media";
import type { Database } from "@/types/database";
import { slugify } from "./slug";

/**
 * Uploads a single image to the public `site-media` bucket and returns its
 * public URL. Files are namespaced by folder and named from the hint so that
 * the storage browser stays readable.
 */
export async function uploadSiteImage(
  supabase: SupabaseClient<Database>,
  file: File,
  folder: string,
  nameHint?: string,
): Promise<string> {
  const problem = validateImage(file);
  if (problem) throw new ImageUploadError(problem);

  const extension = IMAGE_EXTENSIONS[file.type] ?? "jpg";
  const base = slugify(nameHint || file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${folder}/${base}-${Date.now().toString(36)}.${extension}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new ImageUploadError(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function getFormFile(formData: FormData, name: string): File | null {
  const value = formData.get(name);

  if (value instanceof File && value.size > 0) {
    return value;
  }

  return null;
}

export function getFormFiles(formData: FormData, name: string): File[] {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

/** Returns a message suitable for ?error= when an upload fails. */
export function uploadErrorMessage(error: unknown): string {
  if (error instanceof ImageUploadError) return error.message;
  if (error instanceof Error) return error.message;
  return "The image could not be uploaded. Please try again.";
}
