import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/site-data";

function whatsappHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const socials = [
    { href: settings.instagram, label: "Instagram", Icon: Instagram },
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
  ].filter(
    (social): social is { href: string; label: string; Icon: LucideIcon } =>
      Boolean(social.href),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <p className="text-xs uppercase tracking-label text-gold">Contact</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Contact us
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <ContactForm />

        <div className="border-t border-line pt-8 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="text-xs uppercase tracking-label text-gold">
            Visit or write to us
          </p>
          <p className="mt-5 max-w-md leading-relaxed">
            Have a question about a fragrance, an order or a collaboration?
            Send us a note and our team will get back to you.
          </p>

          <ul className="mt-10 space-y-5">
            {settings.email ? (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-ink"
                >
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden />
                  {settings.email}
                </a>
              </li>
            ) : null}

            {settings.phone ? (
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 transition-colors hover:text-ink"
                >
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden />
                  {settings.phone}
                </a>
              </li>
            ) : null}

            {settings.whatsapp ? (
              <li>
                <a
                  href={whatsappHref(settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-ink"
                >
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden />
                  Chat on WhatsApp
                </a>
              </li>
            ) : null}

            {settings.address ? (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                {settings.address}
              </li>
            ) : null}
          </ul>

          {!settings.email && !settings.phone && !settings.whatsapp && !settings.address ? (
            <p className="mt-10 leading-relaxed">
              Our contact details are being updated. In the meantime, please use
              the form and we&apos;ll make sure your message reaches the right
              person.
            </p>
          ) : null}

          {socials.length > 0 ? (
            <div className="mt-10 flex items-center gap-6">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="transition-opacity hover:opacity-70"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
