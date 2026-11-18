import "server-only";

import { cache } from "react";

import {
  displayCollectionImage,
  displayHeroImage,
  displayOptionalProductImage,
  displayProductImage,
} from "@/lib/seed-images";
import {
  cheapestVariant,
  type ProductVariantOption,
} from "@/lib/product-variants";
import { getSeedProduct, SEED_PRODUCTS } from "@/lib/seed-catalog";
import { createClient } from "@/lib/supabase/server";
import type { CollectionSummary, SiteSettings } from "@/lib/types";

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  gender: string;
  concentration: string;
  scentFamily: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  images: string[];
  variants: ProductVariantOption[];
};

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

      return (data ?? []).map((collection) => ({
        ...collection,
        image_url: displayCollectionImage(collection.slug, collection.image_url),
      }));
    } catch {
      return [];
    }
  },
);

export const getHero = cache(async () => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("hero").select("*").maybeSingle();
    if (!data) return null;
    return { ...data, image_url: displayHeroImage(data.image_url) };
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
        .select("id, product_id, size_ml, price, compare_at_price, stock")
        .in("product_id", productIds)
        .order("price", { ascending: true }),
      supabase
        .from("product_images")
        .select("product_id, image_url, sort_order")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true }),
    ]);

    const variantMap = new Map<string, NonNullable<typeof variants>[number]>();
    const variantsByProduct = new Map<string, ProductVariantOption[]>();
    for (const v of variants ?? []) {
      if (!variantMap.has(v.product_id)) variantMap.set(v.product_id, v);
      const list = variantsByProduct.get(v.product_id) ?? [];
      list.push({
        id: v.id,
        sizeMl: v.size_ml,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        stock: v.stock,
      });
      variantsByProduct.set(v.product_id, list);
    }

    const imageMap = new Map<string, string>();
    for (const img of images ?? []) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
    }

    return data.map((p) => ({
      ...p,
      cover_image_url: displayProductImage(p.slug, p.cover_image_url),
      price: variantMap.get(p.id)?.price ?? 0,
      compareAtPrice: variantMap.get(p.id)?.compare_at_price ?? null,
      galleryImage: displayOptionalProductImage(p.slug, imageMap.get(p.id), 1),
      variants: variantsByProduct.get(p.id) ?? getSeedProduct(p.slug)?.variants ?? [],
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
        .select("id, product_id, size_ml, price, compare_at_price, stock")
        .in("product_id", productIds)
        .order("price", { ascending: true }),
      supabase
        .from("product_images")
        .select("product_id, image_url, sort_order")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true }),
    ]);

    const variantMap = new Map<string, NonNullable<typeof variants>[number]>();
    const variantsByProduct = new Map<string, ProductVariantOption[]>();
    for (const v of variants ?? []) {
      if (!variantMap.has(v.product_id)) variantMap.set(v.product_id, v);
      const list = variantsByProduct.get(v.product_id) ?? [];
      list.push({
        id: v.id,
        sizeMl: v.size_ml,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        stock: v.stock,
      });
      variantsByProduct.set(v.product_id, list);
    }

    const imageMap = new Map<string, string>();
    for (const img of images ?? []) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
    }

    return data.map((p) => ({
      ...p,
      cover_image_url: displayProductImage(p.slug, p.cover_image_url),
      price: variantMap.get(p.id)?.price ?? 0,
      compareAtPrice: variantMap.get(p.id)?.compare_at_price ?? null,
      galleryImage: displayOptionalProductImage(p.slug, imageMap.get(p.id), 1),
      variants: variantsByProduct.get(p.id) ?? getSeedProduct(p.slug)?.variants ?? [],
    }));
  } catch {
    return [];
  }
});

export const getVisibleProductSlugs = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) return data.map((p) => p.slug);
  } catch {
    // fall through to the seeded catalog
  }

  return SEED_PRODUCTS.map((product) => product.slug);
});

/**
 * Loads one product with every variant and gallery image. Falls back to the
 * full seeded catalog so a product link never 404s just because Supabase is
 * empty or temporarily unreachable.
 */
export const getProductDetail = cache(
  async (slug: string): Promise<ProductDetail | null> => {
    const seed = getSeedProduct(slug);

    try {
      const supabase = await createClient();
      const { data: product } = await supabase
        .from("products")
        .select(
          "id, name, slug, brand, description, gender, concentration, top_notes, heart_notes, base_notes, scent_family, cover_image_url, is_visible",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (product) {
        if (!product.is_visible) return null;

        const [{ data: variantRows }, { data: imageRows }] = await Promise.all([
          supabase
            .from("product_variants")
            .select("id, size_ml, price, compare_at_price, stock")
            .eq("product_id", product.id)
            .order("price", { ascending: true }),
          supabase
            .from("product_images")
            .select("image_url, sort_order")
            .eq("product_id", product.id)
            .order("sort_order", { ascending: true }),
        ]);

        const variants: ProductVariantOption[] = (variantRows ?? []).map((v) => ({
          id: v.id,
          sizeMl: v.size_ml,
          price: v.price,
          compareAtPrice: v.compare_at_price,
          stock: v.stock,
        }));

        const gallery = (imageRows ?? [])
          .map((img, index) =>
            displayOptionalProductImage(product.slug, img.image_url, index + 1),
          )
          .filter((url): url is string => Boolean(url));

        const images = [
          displayProductImage(product.slug, product.cover_image_url),
          ...gallery,
        ];

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand ?? "Maison Noir",
          description: product.description ?? "",
          gender: product.gender,
          concentration: product.concentration,
          scentFamily: product.scent_family,
          topNotes: product.top_notes ?? [],
          heartNotes: product.heart_notes ?? [],
          baseNotes: product.base_notes ?? [],
          images: images.length > 1 ? images : (seed?.images ?? images),
          variants: variants.length > 0 ? variants : (seed?.variants ?? []),
        };
      }
    } catch {
      // fall through to the seeded catalog
    }

    if (!seed) return null;

    return {
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      brand: seed.brand,
      description: seed.description,
      gender: seed.gender,
      concentration: seed.concentration,
      scentFamily: seed.scentFamily,
      topNotes: seed.topNotes,
      heartNotes: seed.heartNotes,
      baseNotes: seed.baseNotes,
      images: seed.images,
      variants: seed.variants,
    };
  },
);

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  gender: string;
  concentration: string;
  scent_family: string | null;
  collectionSlugs: string[];
  cover_image_url: string;
  galleryImage: string | null;
  price: number;
  compareAtPrice: number | null;
  is_new: boolean;
  variants: ProductVariantOption[];
};

function seedShopProducts(): ShopProduct[] {
  return SEED_PRODUCTS.map((product) => {
    const priceVariant =
      cheapestVariant(product.variants, true) ??
      cheapestVariant(product.variants, false);
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      gender: product.gender,
      concentration: product.concentration,
      scent_family: product.scentFamily,
      collectionSlugs: Array.from(
        new Set([product.gender, ...(product.isNew ? ["best-sellers"] : [])]),
      ),
      cover_image_url: product.images[0],
      galleryImage: product.images[1] ?? null,
      price: priceVariant?.price ?? 0,
      compareAtPrice: priceVariant?.compareAtPrice ?? null,
      is_new: product.isNew,
      variants: product.variants,
    };
  });
}

/** All visible products with live variant stock, for grids and quick-add. */
export const getShopProducts = cache(async (): Promise<ShopProduct[]> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, brand, gender, concentration, scent_family, cover_image_url, is_new",
      )
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (!data || data.length === 0) return seedShopProducts();

    const productIds = data.map((p) => p.id);
    const [{ data: variants }, { data: images }, { data: collectionLinks }, { data: collections }] =
      await Promise.all([
        supabase
          .from("product_variants")
          .select("id, product_id, size_ml, price, compare_at_price, stock")
          .in("product_id", productIds)
          .order("price", { ascending: true }),
        supabase
          .from("product_images")
          .select("product_id, image_url, sort_order")
          .in("product_id", productIds)
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_collections")
          .select("product_id, collection_id")
          .in("product_id", productIds),
        supabase.from("collections").select("id, slug"),
      ]);

    const variantsByProduct = new Map<string, ProductVariantOption[]>();
    for (const v of variants ?? []) {
      const list = variantsByProduct.get(v.product_id) ?? [];
      list.push({
        id: v.id,
        sizeMl: v.size_ml,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        stock: v.stock,
      });
      variantsByProduct.set(v.product_id, list);
    }

    const imageMap = new Map<string, string>();
    for (const img of images ?? []) {
      if (!imageMap.has(img.product_id)) imageMap.set(img.product_id, img.image_url);
    }

    const collectionSlugById = new Map(
      (collections ?? []).map((collection) => [collection.id, collection.slug]),
    );
    const collectionSlugsByProduct = new Map<string, string[]>();
    for (const link of collectionLinks ?? []) {
      const slug = collectionSlugById.get(link.collection_id);
      if (!slug) continue;
      const list = collectionSlugsByProduct.get(link.product_id) ?? [];
      if (!list.includes(slug)) list.push(slug);
      collectionSlugsByProduct.set(link.product_id, list);
    }

    return data.map((p) => {
      const productVariants = variantsByProduct.get(p.id) ?? getSeedProduct(p.slug)?.variants ?? [];
      const priceVariant =
        cheapestVariant(productVariants, true) ??
        cheapestVariant(productVariants, false);
      const fallbackSlugs = Array.from(
        new Set([p.gender, ...(p.is_new ? ["best-sellers"] : [])]),
      );
      return {
        ...p,
        brand: p.brand ?? "Maison Noir",
        collectionSlugs: collectionSlugsByProduct.get(p.id) ?? fallbackSlugs,
        cover_image_url: displayProductImage(p.slug, p.cover_image_url),
        galleryImage: displayOptionalProductImage(p.slug, imageMap.get(p.id), 1),
        price: priceVariant?.price ?? 0,
        compareAtPrice: priceVariant?.compareAtPrice ?? null,
        variants: productVariants,
      };
    });
  } catch {
    return seedShopProducts();
  }
});
