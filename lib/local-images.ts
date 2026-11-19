import { LOCAL_IMAGE_MAP } from "@/lib/generated/local-image-map";

/**
 * Returns the optimized local copy for a known image URL. Newly uploaded
 * images are not in the map yet, so they keep loading from their source URL.
 */
export function localImage<T extends string | null | undefined>(url: T): T | string {
  if (!url) return url;
  return LOCAL_IMAGE_MAP[url] ?? url;
}
