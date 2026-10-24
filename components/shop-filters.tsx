"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

const CONCENTRATIONS = [
  { value: "EDP", label: "Eau de Parfum" },
  { value: "EDT", label: "Eau de Toilette" },
  { value: "Parfum", label: "Parfum" },
  { value: "Extrait", label: "Extrait" },
];

const SIZES = [30, 50, 100];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
];

export type FilterOption = {
  value: string;
  label: string;
};

export type ShopFiltersProps = {
  collections: { slug: string; name: string }[];
  scentFamilies: string[];
  activeCount: number;
  className?: string;
};

function toggleParam(
  params: URLSearchParams,
  key: string,
  value: string,
) {
  const current = params.getAll(key);
  const next = new URLSearchParams(params.toString());

  if (current.includes(value)) {
    next.delete(key);
    for (const item of current.filter((v) => v !== value)) {
      next.append(key, item);
    }
  } else {
    next.append(key, value);
  }

  next.delete("page");
  return next;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-line py-6">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between text-[11px] uppercase tracking-label text-ink"
      >
        {title}
        <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} aria-hidden />
      </button>
      {isOpen ? <div className="mt-4 flex flex-col gap-2.5">{children}</div> : null}
    </div>
  );
}

export function ShopFilters({
  collections,
  scentFamilies,
  activeCount,
  className,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [lastSync, setLastSync] = useState(initialQuery);

  if (initialQuery !== lastSync) {
    setLastSync(initialQuery);
    setQuery(initialQuery);
  }

  const apply = (params: URLSearchParams) => {
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const toggle = (key: string, value: string) => {
    const params = toggleParam(new URLSearchParams(searchParams.toString()), key, value);
    apply(params);
  };

  const setSingle = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    apply(params);
  };

  const applySearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("page");
    apply(params);
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const content = (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-label text-ink">Filters</p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-label text-muted">Search</p>
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            applySearch(query);
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or brand"
            aria-label="Search products"
            className="w-full h-11 border border-line px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </form>
      </div>

      <FilterSection title="Gender">
        {GENDERS.map((gender) => {
          const active = searchParams.getAll("gender").includes(gender.value);
          return (
            <button
              key={gender.value}
              type="button"
              onClick={() => toggle("gender", gender.value)}
              className={cn(
                "flex items-center justify-between text-sm",
                active ? "text-ink" : "text-muted transition-colors hover:text-ink",
              )}
            >
              {gender.label}
              {active ? <X className="size-3" aria-hidden /> : null}
            </button>
          );
        })}
      </FilterSection>

      <FilterSection title="Concentration">
        {CONCENTRATIONS.map((item) => {
          const active = searchParams.getAll("concentration").includes(item.value);
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => toggle("concentration", item.value)}
              className={cn(
                "flex items-center justify-between text-sm",
                active ? "text-ink" : "text-muted transition-colors hover:text-ink",
              )}
            >
              {item.label}
              {active ? <X className="size-3" aria-hidden /> : null}
            </button>
          );
        })}
      </FilterSection>

      {collections.length > 0 ? (
        <FilterSection title="Collection">
          {collections.map((collection) => {
            const active = searchParams.get("collection") === collection.slug;
            return (
              <button
                key={collection.slug}
                type="button"
                onClick={() => setSingle("collection", active ? null : collection.slug)}
                className={cn(
                  "flex items-center justify-between text-sm",
                  active ? "text-ink" : "text-muted transition-colors hover:text-ink",
                )}
              >
                {collection.name}
                {active ? <X className="size-3" aria-hidden /> : null}
              </button>
            );
          })}
        </FilterSection>
      ) : null}

      {scentFamilies.length > 0 ? (
        <FilterSection title="Scent family">
          {scentFamilies.map((family) => {
            const active = searchParams.getAll("scent_family").includes(family);
            return (
              <button
                key={family}
                type="button"
                onClick={() => toggle("scent_family", family)}
                className={cn(
                  "flex items-center justify-between text-sm",
                  active ? "text-ink" : "text-muted transition-colors hover:text-ink",
                )}
              >
                {family}
                {active ? <X className="size-3" aria-hidden /> : null}
              </button>
            );
          })}
        </FilterSection>
      ) : null}

      <FilterSection title="Size">
        {SIZES.map((size) => {
          const active = searchParams.getAll("size").includes(String(size));
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggle("size", String(size))}
              className={cn(
                "flex items-center justify-between text-sm",
                active ? "text-ink" : "text-muted transition-colors hover:text-ink",
              )}
            >
              {size} ml
              {active ? <X className="size-3" aria-hidden /> : null}
            </button>
          );
        })}
      </FilterSection>

      <FilterSection title="Sort">
        {SORT_OPTIONS.map((option) => {
          const active = (searchParams.get("sort") ?? "featured") === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSingle("sort", active && option.value !== "featured" ? null : option.value === "featured" ? null : option.value)}
              className={cn(
                "flex items-center justify-between text-sm",
                active ? "text-ink" : "text-muted transition-colors hover:text-ink",
              )}
            >
              {option.label}
              {active && option.value !== "featured" ? <X className="size-3" aria-hidden /> : null}
            </button>
          );
        })}
      </FilterSection>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
        >
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        {open ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/40"
            />
            <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-cream">
              <div className="flex h-16 items-center justify-between border-b border-line px-6">
                <p className="text-[11px] uppercase tracking-label text-ink">
                  Filters
                  {activeCount > 0 ? ` (${activeCount})` : ""}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close filters"
                  className="-mr-2 p-2 text-ink"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">{content}</div>
              <div className="border-t border-line px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    clearAll();
                    setOpen(false);
                  }}
                  className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isPending ? (
        <div className="fixed right-6 bottom-6 border border-line bg-cream px-4 py-2 text-[11px] uppercase tracking-label text-muted">
          Updating
        </div>
      ) : null}
    </>
  );
}
