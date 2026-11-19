"use client";

import { ChevronDown, Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { formatEgp } from "@/components/ui/price";
import { selectItemCount, useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import type { CollectionSummary, SiteSettings } from "@/lib/types";
import { useUiStore } from "@/lib/ui-store";

export type HeaderShellProps = {
  settings: SiteSettings;
  collections: CollectionSummary[];
  children?: React.ReactNode;
};

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function HeaderShell({
  settings,
  collections,
  children,
}: HeaderShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDialogElement>(null);

  const itemCount = useCartStore(selectItemCount);
  const openCart = useUiStore((state) => state.openCart);

  const transparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCollectionsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const dialog = menuDialogRef.current;
    if (!dialog) return;

    if (menuOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("menu-scroll-locked");
    } else if (!menuOpen && dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (media.matches) setMenuOpen(false);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handlePopState = () => setMenuOpen(false);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(
    () => () => document.documentElement.classList.remove("menu-scroll-locked"),
    [],
  );

  const handleMenuClose = () => {
    setMenuOpen(false);
    document.documentElement.classList.remove("menu-scroll-locked");
    menuButtonRef.current?.focus();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (
      target === event.currentTarget ||
      target.closest("[data-menu-close]") ||
      target.closest("a[href]")
    ) {
      setMenuOpen(false);
    }
  };

  const freeShippingMessage =
    settings.free_shipping_threshold && settings.free_shipping_threshold > 0
      ? `Complimentary shipping over ${formatEgp(settings.free_shipping_threshold)}`
      : "Complimentary shipping on qualifying orders";

  return (
    <>
      <header
        id="site-header"
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
          transparent
            ? "bg-gradient-to-b from-ink/70 via-ink/25 to-transparent text-cream"
            : "border-b border-line bg-cream/90 text-ink backdrop-blur-md",
        )}
      >
        <div className="border-b border-ink bg-ink text-cream">
          <Container size="lg">
            <div className="flex h-9 items-center justify-center text-center text-[10px] uppercase tracking-label sm:text-[11px]">
              <p>{freeShippingMessage}</p>
            </div>
          </Container>
        </div>

        <div
          className={cn(
            "border-b",
            transparent ? "border-cream/15" : "border-transparent",
          )}
        >
          <Container size="lg">
            <div className="flex h-16 items-center justify-between gap-6 md:h-20">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-controls="site-menu"
                aria-expanded={menuOpen}
                className="-ml-2 p-2 transition-opacity hover:opacity-70 md:hidden"
              >
                <Menu className="size-5" aria-hidden />
              </button>

              <Link
                href="/"
                className="flex items-center gap-3 font-display text-base uppercase tracking-editorial transition-opacity hover:opacity-70 md:text-lg"
              >
                {settings.logo_url ? (
                  <Image
                    src={settings.logo_url}
                    alt={settings.store_name}
                    loading="eager"
                    width={160}
                    height={40}
                    className="h-8 w-auto object-contain md:h-9"
                  />
                ) : (
                  settings.store_name
                )}
              </Link>

              <nav className="hidden items-center gap-10 md:flex">
                {NAV_LINKS.slice(0, 1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11px] uppercase tracking-label transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                ))}

                {collections.length > 0 ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setCollectionsOpen(true)}
                    onMouseLeave={() => setCollectionsOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setCollectionsOpen((open) => !open)}
                      aria-expanded={collectionsOpen}
                      className="flex items-center gap-1.5 text-[11px] uppercase tracking-label transition-opacity hover:opacity-70"
                    >
                      Collections
                      <ChevronDown
                        className={cn(
                          "size-3 transition-transform duration-300",
                          collectionsOpen && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>

                    <div
                      aria-hidden={!collectionsOpen}
                      inert={!collectionsOpen}
                      className={cn(
                        "header-collections-menu absolute top-full left-0 w-56 border border-line bg-cream py-3 text-ink",
                        collectionsOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1.5 opacity-0",
                      )}
                    >
                      {collections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/collections/${collection.slug}`}
                          onClick={() => setCollectionsOpen(false)}
                          className="block px-5 py-2.5 text-[11px] uppercase tracking-label transition-colors hover:bg-cream-deep"
                        >
                          {collection.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {NAV_LINKS.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11px] uppercase tracking-label transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new Event("maison-noir:open-search"))
                  }
                  aria-label="Search the collection"
                  className="transition-opacity hover:opacity-70"
                >
                  <Search className="size-4" aria-hidden />
                </button>

                <button
                  type="button"
                  onClick={openCart}
                  aria-label={
                    itemCount > 0
                      ? `Open bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`
                      : "Open bag"
                  }
                  className="relative transition-opacity hover:opacity-70"
                >
                  <ShoppingBag className="size-5" aria-hidden />
                  {itemCount > 0 ? (
                    <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] leading-none text-ink tabular-nums">
                      {itemCount}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </Container>
        </div>
      </header>

      <dialog
        ref={menuDialogRef}
        id="site-menu"
        aria-label="Site menu"
        onClick={handleMenuClick}
        onClose={handleMenuClose}
        className="mobile-menu-dialog m-0 h-full max-h-none w-full max-w-none border-0 bg-cream p-0 text-ink md:hidden"
      >
        {children}
      </dialog>
    </>
  );
}
