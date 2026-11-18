"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { formatEgp } from "@/components/ui/price";
import { selectItemCount, useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import type { CollectionSummary, SiteSettings } from "@/lib/types";
import { useUiStore } from "@/lib/ui-store";

export type HeaderShellProps = {
  settings: SiteSettings;
  collections: CollectionSummary[];
};

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MOBILE_SECONDARY_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export function HeaderShell({ settings, collections }: HeaderShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

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
      setMenuOpen(false);
      setCollectionsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const freeShippingMessage =
    settings.free_shipping_threshold && settings.free_shipping_threshold > 0
      ? `Complimentary shipping over ${formatEgp(settings.free_shipping_threshold)}`
      : "Complimentary shipping on qualifying orders";

  return (
    <>
      <header
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
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
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

                    <AnimatePresence>
                      {collectionsOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 w-56 border border-line bg-cream py-3 text-ink"
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
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
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
                  onClick={() => window.dispatchEvent(new Event("maison-noir:open-search"))}
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

      <AnimatePresence>
        {menuOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              key="mobile-menu-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 size-full bg-ink/60 backdrop-blur-sm"
            />

            <motion.aside
              key="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full w-[86vw] max-w-sm flex-col overflow-y-auto border-r border-line bg-cream text-ink shadow-2xl"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
                <span className="font-display text-sm uppercase tracking-editorial">
                  {settings.logo_url ? (
                    <Image
                      src={settings.logo_url}
                      alt={settings.store_name}
                      loading="eager"
                      width={160}
                      height={40}
                      className="h-7 w-auto object-contain"
                    />
                  ) : (
                    settings.store_name
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 p-2 transition-opacity hover:opacity-60"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="flex flex-1 flex-col px-6 py-9">
                <div className="h-px w-10 bg-gold" />

                <Link
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="group mt-8 flex items-center justify-between gap-4 border-b border-line pb-7"
                >
                  <span className="font-display text-xl text-ink transition-colors group-hover:text-gold-muted">
                    Shop all
                  </span>
                  <span className="text-[10px] uppercase tracking-label text-gold">
                    01
                  </span>
                </Link>

                {collections.length > 0 ? (
                  <div className="border-b border-line py-7">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] uppercase tracking-label text-gold">
                        Collections
                      </p>
                      <span className="text-[10px] uppercase tracking-label text-muted">
                        02
                      </span>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {collections.map((collection) => (
                        <li key={collection.id}>
                          <Link
                            href={`/collections/${collection.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block text-[12px] uppercase tracking-label text-ink transition-colors hover:text-gold-muted"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <nav className="mt-7 flex flex-col gap-6" aria-label="More pages">
                  {MOBILE_SECONDARY_LINKS.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between gap-4"
                    >
                      <span className="font-display text-lg text-ink transition-colors group-hover:text-gold-muted">
                        {link.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-label text-gold">
                        {String(index + 3).padStart(2, "0")}
                      </span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-3 border-t border-line pt-8">
                  {settings.phone ? (
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-label text-muted"
                    >
                      <Phone className="size-3" aria-hidden />
                      {settings.phone}
                    </a>
                  ) : null}

                  {settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-label text-muted"
                    >
                      <Mail className="size-3" aria-hidden />
                      {settings.email}
                    </a>
                  ) : null}

                  <SocialLinks settings={settings} className="pt-1" />
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SocialLinks({
  settings,
  className,
}: {
  settings: SiteSettings;
  className?: string;
}) {
  const links = [
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
    { href: settings.tiktok, label: "TikTok", Icon: null },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      {links.map(({ href, label, Icon }) =>
        Icon ? (
          <a
            key={label}
            href={href!}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="transition-opacity hover:opacity-70"
          >
            <Icon className="size-4" aria-hidden />
          </a>
        ) : (
          <a
            key={label}
            href={href!}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-label transition-opacity hover:opacity-70"
          >
            {label}
          </a>
        ),
      )}
    </div>
  );
}
