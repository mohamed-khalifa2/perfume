"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = {
  concentration: "Concentration",
  scent_family: "Scent family",
  collection: "Collection",
  size: "Size",
  sort: "Sort",
  q: "Search",
  in_stock: "In stock",
};

const FILTER_KEYS = new Set(Object.keys(LABELS));

const CONCENTRATION_LABELS: Record<string, string> = {
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  Parfum: "Parfum",
  Extrait: "Extrait",
};

const SORT_LABELS: Record<string, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

type ActiveFilterChipsProps = {
  collections?: { slug: string; name: string }[];
};

export function ActiveFilterChips({ collections = [] }: ActiveFilterChipsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collectionNames = new Map(collections.map((collection) => [collection.slug, collection.name]));
  const chips: { key: string; label: string; href: string }[] = [];

  for (const [key, value] of searchParams.entries()) {
    if (!FILTER_KEYS.has(key)) continue;

    const next = new URLSearchParams(searchParams.toString());
    const values = searchParams.getAll(key).filter((v) => v !== value);
    next.delete(key);
    for (const v of values) next.append(key, v);
    next.delete("page");
    const qs = next.toString();

    let label = value;
    if (key === "size") label = `${value} ml`;
    if (key === "concentration") label = CONCENTRATION_LABELS[value] ?? value;
    if (key === "collection") label = collectionNames.get(value) ?? value;
    if (key === "sort") label = SORT_LABELS[value] ?? value;

    chips.push({
      key: `${key}-${value}`,
      label: key === "in_stock" ? "In stock" : `${LABELS[key]}: ${label}`,
      href: qs ? `${pathname}?${qs}` : pathname,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className={cn(
            "inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[11px] uppercase tracking-label text-muted transition-colors hover:border-ink hover:text-ink",
          )}
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}
