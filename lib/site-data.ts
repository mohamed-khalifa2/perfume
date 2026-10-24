import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { CollectionSummary, SiteSettings } from "@/lib/types";

const FALLBACK_SETTINGS: SiteSettings = {
  id: true,
  store_name: "Maison Noir",
  tagline: "Fragrance, composed.",
  logo_url: null,
  email: null,
  phone: null,
  whatsapp: null,
  address: null,
  instagram: null,
  facebook: null,
  tiktok: null,
  footer_text: null,
  free_shipping_threshold: 0,
  seo_title: null,
  seo_description: null,
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .maybeSingle();

    return data ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
});

export const getVisibleCollections = cache(
  async (): Promise<CollectionSummary[]> => {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("collections")
        .select("id, name, slug, description, image_url, sort_order, is_visible")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });

      return data ?? [];
    } catch {
      return [];
    }
  },
);

export const getHero = cache(async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("hero").select("*").maybeSingle();
    return data;
  } catch {
    return null;
  }
});

export const getFeaturedProducts = cache(async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, brand, cover_image_url, is_featured, is_new, is_visible, sort_order",
      )
      .eq("is_visible", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(8);

    if (!data || data.length === 0) return [];

    const productIds = data.map((p) => p.id);
    const [{ data: variants }, { data: images }] = await Promise.all([
      supabase
        .from("product_variants")
        .select("id, product_id, price, compare_at_price, size_ml")
        .in("product_id", productIds)
        .order("price", { ascending: true }),
      supabase
        .from("product_images")
        .select("product_id, image_url, sort_order")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true }),
    ]);

    const variantMap = new Map<string, NonNullable<typeof variants>[number]>();
    for (const v of variants ?? []) {
      if (!variantMap.has(v.product_id)) variantMap.set(v.product_id, v);
    }

    const imageMap = new Map<string, string>();
    for (const img of images ?? []) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
    }

    return data.map((p) => ({
      ...p,
      price: variantMap.get(p.id)?.price ?? 0,
      compareAtPrice: variantMap.get(p.id)?.compare_at_price ?? null,
      galleryImage: imageMap.get(p.id) ?? null,
    }));
  } catch {
    return [];
  }
});

export const getNewArrivals = cache(async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, brand, cover_image_url, is_featured, is_new, is_visible, sort_order, created_at",
      )
      .eq("is_visible", true)
      .eq("is_new", true)
      .order("sort_order", { ascending: true })
      .limit(10);

    if (!data || data.length === 0) return [];

    const productIds = data.map((p) => p.id);
    const [{ data: variants }, { data: images }] = await Promise.all([
      supabase
        .from("product_variants")
        .select("id, product_id, price, compare_at_price, size_ml")
        .in("product_id", productIds)
        .order("price", { ascending: true }),
      supabase
        .from("product_images")
        .select("product_id, image_url, sort_order")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true }),
    ]);

    const variantMap = new Map<string, NonNullable<typeof variants>[number]>();
    for (const v of variants ?? []) {
      if (!variantMap.has(v.product_id)) variantMap.set(v.product_id, v);
    }

    const imageMap = new Map<string, string>();
    for (const img of images ?? []) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
    }

    return data.map((p) => ({
      ...p,
      price: variantMap.get(p.id)?.price ?? 0,
      compareAtPrice: variantMap.get(p.id)?.compare_at_price ?? null,
      galleryImage: imageMap.get(p.id) ?? null,
    }));
  } catch {
    return [];
  }
});
