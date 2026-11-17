import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const TRANSLITERATIONS: Record<string, string> = {
  æ: "ae",
  œ: "oe",
  ø: "o",
  ß: "ss",
  đ: "d",
  ł: "l",
};

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[æœøßđł]/g, (character) => TRANSLITERATIONS[character] ?? character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

/**
 * Builds a URL-safe slug from the given name and guarantees it is unique for
 * the table, suffixing -2, -3, ... when a collision already exists.
 * Pass `ignoreId` when updating a row so it does not collide with itself.
 */
export async function uniqueSlug(
  supabase: SupabaseClient<Database>,
  table: "products" | "collections",
  name: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(name) || "item";

  let rows: Array<{ id: string; slug: string }> = [];

  if (table === "products") {
    const { data } = await supabase.from("products").select("id, slug");
    rows = data ?? [];
  } else {
    const { data } = await supabase.from("collections").select("id, slug");
    rows = data ?? [];
  }

  const taken = new Set(
    rows.filter((row) => row.id !== ignoreId).map((row) => row.slug),
  );

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}
