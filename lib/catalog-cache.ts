import { revalidateTag } from "next/cache";

export const PUBLIC_CATALOG_TAG = "public-catalog";

/** Call after an admin mutation that changes public storefront data. */
export function revalidatePublicCatalog() {
  revalidateTag(PUBLIC_CATALOG_TAG, { expire: 0 });
}
