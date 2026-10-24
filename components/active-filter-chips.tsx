"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = {
  gender: "Gender",
  concentration: "Concentration",
  scent_family: "Scent family",
  collection: "Collection",
  size: "Size",
  sort: "Sort",
  q: "Search",
  in_stock: "In stock",
};

export function ActiveFilterChips() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chips: { key: string; label: string; href: string }[] = [];

  for (const [key, value] of searchParams.entries()) {
    if (key === "page") continue;

    const next = new URLSearchParams(searchParams.toString());
    const values = searchParams.getAll(key).filter((v) => v !== value);
    next.delete(key);
    for (const v of values) next.append(key, v);
    next.delete("page");
    const qs = next.toString();

    let label = value;
    if (key === "size") label = `${value} ml`;
    if (key === "gender") label = value === "men" ? "Men" : value === "women" ? "Women" : "Unisex";
    if (key === "collection") label = value;

    chips.push({
      key: `${key}-${value}`,
      label: `${LABELS[key] ?? key}: ${label}`,
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
