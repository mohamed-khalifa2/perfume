import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getSiteSettings, getVisibleCollections } from "@/lib/site-data";

export async function SiteFooter() {
  const [settings, collections] = await Promise.all([
    getSiteSettings(),
    getVisibleCollections(),
  ]);

  const shopLinks = [
    { href: "/shop", label: "All fragrances" },
    ...collections.map((collection) => ({
      href: `/collections/${collection.slug}`,
      label: collection.name,
    })),
    { href: "/cart", label: "Cart" },
  ];

  const helpLinks = [
    { href: "/orders/track", label: "Track order" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  const socials = [
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
    { href: settings.tiktok, label: "TikTok", Icon: null },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="mt-auto bg-ink text-cream">
      <Container size="lg">
        <div className="grid gap-14 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-5">
            <p className="font-display text-4xl leading-none lg:text-5xl">
              {settings.store_name}
            </p>

            {settings.tagline ? (
              <p className="mt-5 text-xs uppercase tracking-label text-cream/60">
                {settings.tagline}
              </p>
            ) : null}

            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-4 border border-cream/25 px-7 py-4 text-[11px] uppercase tracking-label transition-colors hover:bg-cream hover:text-ink"
            >
              Join the list — new compositions by email
            </Link>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-4">
            <div>
              <p className="text-[11px] uppercase tracking-label text-gold">
                Shop
              </p>
              <ul className="mt-6 space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-label text-gold">
                Help
              </p>
              <ul className="mt-6 space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] uppercase tracking-label text-gold">
              Contact
            </p>

            <ul className="mt-6 space-y-4 text-sm text-cream/70">
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3 transition-colors hover:text-cream"
                  >
                    <Phone className="size-4 shrink-0" aria-hidden />
                    {settings.phone}
                  </a>
                </li>
              ) : null}

              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 transition-colors hover:text-cream"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden />
                    {settings.email}
                  </a>
                </li>
              ) : null}

              {settings.address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {settings.address}
                </li>
              ) : null}
            </ul>

            {socials.length > 0 ? (
              <div className="mt-8 flex items-center gap-6">
                {socials.map(({ href, label, Icon }) =>
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
            ) : null}
          </div>
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container size="lg">
          <div className="flex flex-col gap-3 py-7 text-[11px] uppercase tracking-label text-cream/50 md:flex-row md:items-center md:justify-between">
            <span>
              © {new Date().getFullYear()} {settings.store_name}
              {settings.footer_text ? ` — ${settings.footer_text}` : ""}
            </span>
            <span>Cash on delivery · Visa · Mastercard</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
