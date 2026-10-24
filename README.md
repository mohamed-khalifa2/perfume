# Maison Noir — Luxury Perfume House

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Supabase · Paymob (cards + cash on delivery) · Currency: EGP

> Read [`PROJECT_RULES.md`](./PROJECT_RULES.md) before every task. It is the source of truth for styling, routing and data rules.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in real values
npm run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Runs `check:styles` then ESLint |
| `npm run check:styles` | Fails if `style={{`, `<style>` or `styled-jsx` appear in `app/`, `components/`, `lib/` |

## Environment

See `.env.local.example`. Only `NEXT_PUBLIC_*` variables reach the browser.
`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be imported into client code.

## Styling

Tailwind utilities only. `app/globals.css` is the single stylesheet: Tailwind import, `@theme` tokens, minimal base styles.

- `lib/cn.ts` — `clsx` + `tailwind-merge` helper for conditional classes.
- `class-variance-authority` for component variants.
- Inline `style` props are lint errors (`react/forbid-dom-props`, `react/forbid-component-props`).
- Theme tokens: `ink` (#0A0A0A), `paper` (#F5F2ED), `gold` (accent), `line` (1px dividers), `muted`; fonts `font-display` (Playfair Display) and `font-sans` (Inter); label tracking via `tracking-label` / `tracking-editorial`.

## Supabase

- `lib/supabase/client.ts` — browser client.
- `lib/supabase/server.ts` — server client (Server Components, Route Handlers, Server Actions).
- `lib/supabase/middleware.ts` — session refresh + admin route guard, wired through `proxy.ts` (Next 16 name for the middleware convention).

Prices, totals and discounts are always recalculated on the server from the database — client-supplied values are never trusted.

## Routes

Public: `/`, `/shop`, `/shop/[slug]`, `/collections/[slug]`, `/cart`, `/checkout`, `/checkout/success`, `/orders/track`, `/about`, `/contact`, `/privacy`, `/terms`, `/shipping-returns`, `sitemap.xml`, `robots.txt`.

Admin: `/admin/login`, `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/collections`, `/admin/orders`, `/admin/orders/[id]`, `/admin/coupons`, `/admin/shipping`, `/admin/hero`, `/admin/settings`, `/admin/inquiries`.

## Placeholder images

`https://picsum.photos/seed/<unique-seed>/<w>/<h>` — product `900/1200`, hero `1920/1080`, collection `1200/1500`.
