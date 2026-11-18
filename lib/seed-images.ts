/**
 * Curated fallback imagery for the storefront.
 *
 * These are real, fragrance-specific Pexels photographs chosen to match each
 * composition's name and notes. They are used when Supabase has no row yet
 * (fresh checkout, unreachable project, or admin has not uploaded an image).
 * The same images are written by `supabase/migration.sql` on a fresh seed.
 */

const photo = (id: number, width: number, height: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;

export const HERO_IMAGE = photo(11517300, 1920, 1080);
export const STORY_IMAGE = photo(8450466, 1920, 1080);
export const PLACEHOLDER_IMAGE = photo(10924522, 900, 1200);

export const COLLECTION_IMAGES: Record<string, string> = {
  men: photo(32645074, 1200, 1500),
  women: photo(32630385, 1200, 1500),
  unisex: photo(13875783, 1200, 1500),
  "best-sellers": photo(35930230, 1200, 1500),
};

export type SeedProductImages = {
  cover: string;
  gallery: [string, string, string];
};

export const PRODUCT_IMAGES: Record<string, SeedProductImages> = {
  "oud-noir": {
    cover: photo(11482468, 900, 1200),
    // Black oud bottle with roses, oud on dark backdrop, ornate oud close-up.
    gallery: [
      photo(30618765, 900, 1200),
      photo(15096784, 900, 1200),
      photo(38721543, 900, 1200),
    ],
  },
  "velours-rouge": {
    cover: photo(5994299, 900, 1200),
    // Red/black lacquer, red and white florals, crystal cap.
    gallery: [
      photo(12556542, 900, 1200),
      photo(35806941, 900, 1200),
      photo(4735908, 900, 1200),
    ],
  },
  "blanc-de-nuit": {
    cover: photo(12402366, 900, 1200),
    // White settings and clean glass, after-dark black backdrop.
    gallery: [
      photo(13875783, 900, 1200),
      photo(10688062, 900, 1200),
      photo(16239693, 900, 1200),
    ],
  },
  "amber-empress": {
    cover: photo(12456259, 900, 1200),
    // Amber vials with dried botanicals, warm wood, golden flacon.
    gallery: [
      photo(8450399, 900, 1200),
      photo(8450228, 900, 1200),
      photo(12456274, 900, 1200),
    ],
  },
  "desert-santal": {
    cover: photo(32817141, 900, 1200),
    // Rustic wood, wooden cap, sandy-toned bottles.
    gallery: [
      photo(15096784, 900, 1200),
      photo(34051737, 900, 1200),
      photo(4735929, 900, 1200),
    ],
  },
  "cairo-nights": {
    cover: photo(11216321, 900, 1200),
    // Black silk, satin noir, incense-dark glass.
    gallery: [
      photo(7850600, 900, 1200),
      photo(21926655, 900, 1200),
      photo(21926651, 900, 1200),
    ],
  },
  "tobacco-noir": {
    cover: photo(30981935, 900, 1200),
    // Spices and pinecones, warm wood, resinous amber.
    gallery: [
      photo(39179564, 900, 1200),
      photo(12456283, 900, 1200),
      photo(8450345, 900, 1200),
    ],
  },
  "fig-and-cedar": {
    cover: photo(33295344, 900, 1200),
    // Green-lit glass, dried flowers in vials, leaves in liquid.
    gallery: [
      photo(8450212, 900, 1200),
      photo(8450391, 900, 1200),
      photo(8450354, 900, 1200),
    ],
  },
  "rose-ivoire": {
    cover: photo(10786706, 900, 1200),
    // White roses, pink botanicals, pale glass.
    gallery: [
      photo(30405427, 900, 1200),
      photo(8450391, 900, 1200),
      photo(16266295, 900, 1200),
    ],
  },
  "myrrh-royale": {
    cover: photo(12456274, 900, 1200),
    // Resin-toned amber bottles, lab glass, gilded flacon.
    gallery: [
      photo(8450399, 900, 1200),
      photo(8450345, 900, 1200),
      photo(12456283, 900, 1200),
    ],
  },
  "bergamot-silk": {
    cover: photo(35658144, 900, 1200),
    // Citrus slices, bright citrus accents, colourful bokeh.
    gallery: [
      photo(35806942, 900, 1200),
      photo(35806939, 900, 1200),
      photo(230778, 900, 1200),
    ],
  },
  "leather-and-oud": {
    cover: photo(14490634, 900, 1200),
    // Black satin and leather tones, dark glass, textured backdrop.
    gallery: [
      photo(21926650, 900, 1200),
      photo(21926653, 900, 1200),
      photo(16239693, 900, 1200),
    ],
  },
  "jasmine-noir": {
    cover: photo(19954486, 900, 1200),
    // Black silk, pale florals, chain-detail noir bottle.
    gallery: [
      photo(7850600, 900, 1200),
      photo(8450391, 900, 1200),
      photo(21008941, 900, 1200),
    ],
  },
  "vetiver-smoke": {
    cover: photo(15190739, 900, 1200),
    // Dark backdrop, earthy botanicals, perfumer at work.
    gallery: [
      photo(33295344, 900, 1200),
      photo(8450207, 900, 1200),
      photo(8450219, 900, 1200),
    ],
  },
  "peche-sauvage": {
    cover: photo(38949831, 900, 1200),
    // Autumn leaves, peach-toned petals, red florals.
    gallery: [
      photo(38949832, 900, 1200),
      photo(35806941, 900, 1200),
      photo(1961786, 900, 1200),
    ],
  },
  "musk-imperial": {
    cover: photo(34051691, 900, 1200),
    // House signature: cut crystal, glass display, luxurious bottles.
    gallery: [
      photo(15097440, 900, 1200),
      photo(10924522, 900, 1200),
      photo(12402366, 900, 1200),
    ],
  },
};

/** `index` 0 is the cover, 1–3 are gallery images. */
export function productImageUrl(slug: string, index = 0): string {
  const entry = PRODUCT_IMAGES[slug];
  if (!entry) return PLACEHOLDER_IMAGE;
  if (index <= 0) return entry.cover;
  return entry.gallery[index - 1] ?? entry.cover;
}

export function collectionImageUrl(slug: string): string {
  return COLLECTION_IMAGES[slug] ?? PLACEHOLDER_IMAGE;
}

/** True only for the original random placeholders left in older DB rows. */
function isRandomPlaceholder(url: string | null | undefined): boolean {
  return !url || url.includes("picsum.photos");
}

/**
 * Resolves an image URL for display. Existing admin uploads are kept as-is;
 * only the old picsum seeds (or missing URLs) are replaced with curated art.
 */
export function displayProductImage(
  slug: string,
  url: string | null | undefined,
  index = 0,
): string {
  return isRandomPlaceholder(url) ? productImageUrl(slug, index) : url!;
}

/** Gallery images stay absent when an admin removes them, with no invented art. */
export function displayOptionalProductImage(
  slug: string,
  url: string | null | undefined,
  index = 0,
): string | null {
  if (url == null) return null;
  return isRandomPlaceholder(url) ? productImageUrl(slug, index) : url;
}

export function displayCollectionImage(
  slug: string,
  url: string | null | undefined,
): string {
  return isRandomPlaceholder(url) ? collectionImageUrl(slug) : url!;
}

export function displayHeroImage(url: string | null | undefined): string {
  return isRandomPlaceholder(url) ? HERO_IMAGE : url!;
}
