# PROJECT_RULES.md

> **MANDATORY:** Re-read this entire file before starting every task. These rules are absolute.
> Do only the task requested. Do not refactor unrelated files.

---

## STACK

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (`strict: true`)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage, RPC)
- **Supabase client:** `@supabase/ssr`
- **Payments:** Paymob for card payments, plus Cash on Delivery
- **Currency:** EGP

---

## STYLING RULES (strict)

- Tailwind utility classes **ONLY**, applied via `className`.
- **NEVER use:**
  - `style={{...}}` attributes
  - `<style>` tags
  - styled-jsx
  - CSS-in-JS
  - CSS modules
  - any extra `.css` files
- The **only** CSS file is `app/globals.css`. It contains exactly:
  1. The Tailwind import
  2. Theme tokens (colors, fonts, spacing) via Tailwind's theme config / `@theme`
  3. Minimal base styles
- **Dynamic / conditional styling:** use `className` with `clsx` + `tailwind-merge` (helper at `lib/cn.ts`) and `class-variance-authority` for component variants. Never compute pixel values into style props.
- **Images:** `next/image` with `fill` + `sizes` + `object-cover`, inside a Tailwind aspect-ratio wrapper.
- **Animations:** framer-motion props (not CSS strings), or Tailwind `animate-*` / `transition-*` utilities.
- **Arbitrary values** like `w-[37px]` only when no scale value fits.

---

## DESIGN

Luxury perfume house. Editorial.

| Token | Value |
| --- | --- |
| Near-black | `#0A0A0A` |
| Warm off-white | `#F5F2ED` |
| Muted gold accent | accent token in `@theme` |

- **Headings:** Playfair Display (serif)
- **Body:** Inter (clean sans)
- Uppercase tracked labels
- Sharp corners (no rounded corners unless tiny/subtle)
- Thin `1px` dividers
- Lots of whitespace
- Big photography
- Subtle motion only

---

## ROUTES

All routes below **must exist** — no dead links.

**Public**

- `/`
- `/shop`
- `/shop/[slug]`
- `/collections/[slug]`
- `/cart`
- `/checkout`
- `/checkout/success`
- `/orders/track`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/shipping-returns`
- not-found page
- `sitemap.xml`
- `robots.txt`

**Admin**

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/collections`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/coupons`
- `/admin/shipping`
- `/admin/hero`
- `/admin/settings`
- `/admin/inquiries`

---

## RULES

- All content comes from Supabase. Nothing hardcoded except UI labels (headings, button text, field labels, placeholder copy).
- **Prices are always recalculated on the server from the database.** Never trust prices, totals, or discounts sent by the client.
- **Never use the service-role key in client code.** Server-only (`server-only` / `serverComponent` boundaries), passed to the Supabase client used in Server Components, Route Handlers, and Server Actions only.
- **Placeholder images:** `https://picsum.photos/seed/<unique-seed>/<w>/<h>`
  - product → `900/1200`
  - hero → `1920/1080`
  - collection → `1200/1500`
- **After every task:** run `npm run lint` and `npm run build` and fix all errors before reporting done.
- Do only the task requested. Do not refactor unrelated files.

---

## CHECKLIST (before reporting done)

- [ ] Re-read this file
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No `style={{ }}`, `<style>`, CSS modules, or extra `.css` files added
- [ ] Dynamic styles use `cn()` / CVA
- [ ] Images use `next/image` with `fill` + `sizes`
- [ ] Server recalculates all prices
- [ ] Service-role key never referenced in client code
- [ ] No dead links / all listed routes exist
