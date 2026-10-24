"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/client";
import { formatEgp } from "@/components/ui/price";

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  cover_image_url: string | null;
};

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("maison-noir:open-search", handler);
    return () => window.removeEventListener("maison-noir:open-search", handler);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      const timeout = setTimeout(() => {
        setResults([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timeout);
    }

    let cancelled = false;
    const startTimeout = setTimeout(() => setLoading(true), 0);

    const timer = setTimeout(async () => {
      try {
        const supabase = createClient();
        const pattern = `%${debouncedQuery.replace(/[%_]/g, "\\$&")}%`;

        const [{ data: products }, { data: variants }] = await Promise.all([
          supabase
            .from("products")
            .select("id, name, slug, brand, cover_image_url")
            .eq("is_visible", true)
            .or(`name.ilike.${pattern},brand.ilike.${pattern}`)
            .order("name")
            .limit(12),
          supabase
            .from("product_variants")
            .select("product_id, price")
            .order("price", { ascending: true }),
        ]);

        if (cancelled) return;

        const priceMap = new Map<string, number>();
        for (const v of variants ?? []) {
          if (!priceMap.has(v.product_id)) priceMap.set(v.product_id, v.price);
        }

        const mapped =
          products?.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            brand: p.brand,
            price: priceMap.get(p.id) ?? 0,
            cover_image_url: p.cover_image_url,
          })) ?? [];

        setResults(mapped);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      clearTimeout(timer);
    };
  }, [debouncedQuery]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-cream"
        >
          <div className="flex h-16 items-center border-b border-line">
            <Container size="lg" className="flex items-center gap-4">
              <Search className="size-4 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or brand..."
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="-mr-2 p-2 text-ink"
              >
                <X className="size-5" aria-hidden />
              </button>
            </Container>
          </div>

          <Container size="lg">
            <div className="py-10">
              {debouncedQuery.length < 2 ? (
                <p className="text-sm text-muted">Type at least two characters to search.</p>
              ) : loading ? (
                <p className="text-sm text-muted">Searching...</p>
              ) : results.length === 0 ? (
                <p className="text-sm text-muted">No results for “{debouncedQuery}”.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        href={`/shop/${result.slug}`}
                        onClick={close}
                        className="flex items-center gap-6 py-5 transition-opacity hover:opacity-70"
                      >
                        <div className="relative h-20 w-16 overflow-hidden bg-cream-deep">
                          {result.cover_image_url ? (
                            <Image
                              src={result.cover_image_url}
                              alt={result.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          {result.brand ? (
                            <p className="text-[11px] uppercase tracking-label text-muted">
                              {result.brand}
                            </p>
                          ) : null}
                          <p className="font-display text-lg text-ink">{result.name}</p>
                        </div>
                        <p className="text-sm text-ink">{formatEgp(result.price)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Container>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
