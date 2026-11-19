import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import type { CollectionSummary, SiteSettings } from "@/lib/types";

const MOBILE_SECONDARY_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export type MobileMenuProps = {
  settings: SiteSettings;
  collections: CollectionSummary[];
};

export function MobileMenu({ settings, collections }: MobileMenuProps) {
  return (
    <div className="mobile-menu-panel flex h-full flex-col overflow-y-auto">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line">
        <Container size="lg" className="flex items-center justify-between">
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
            data-menu-close
            aria-label="Close menu"
            className="-mr-2 p-2 transition-opacity hover:opacity-60"
          >
            <X className="size-4" aria-hidden />
          </button>
        </Container>
      </div>

      <Container size="lg" className="flex flex-1 flex-col py-9">
        <Link href="/shop" className="group border-b border-line pb-7">
          <span className="font-display text-xl text-ink transition-colors group-hover:text-gold-on-light">
            Shop all
          </span>
        </Link>

        {collections.length > 0 ? (
          <div className="border-b border-line py-7">
            <p className="text-[10px] uppercase tracking-label text-gold-on-light">
              Collections
            </p>
            <ul className="mt-5 space-y-3">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="block text-[12px] uppercase tracking-label text-ink transition-colors hover:text-gold-on-light"
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <nav className="mt-7 flex flex-col gap-6" aria-label="More pages">
          {MOBILE_SECONDARY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <span className="font-display text-lg text-ink transition-colors group-hover:text-gold-on-light">
                {link.label}
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

          <MobileSocialLinks settings={settings} className="pt-1" />
        </div>
      </Container>
    </div>
  );
}

function MobileSocialLinks({
  settings,
  className,
}: {
  settings: SiteSettings;
  className?: string;
}) {
  const links = [
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
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
            aria-label={label}
            className="text-[11px] uppercase tracking-label transition-opacity hover:opacity-70"
          >
            {label}
          </a>
        ),
      )}
    </div>
  );
}
