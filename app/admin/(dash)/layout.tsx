import Link from "next/link";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-deep">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/admin"
            className="font-display text-base uppercase tracking-editorial text-ink"
          >
            Maison Noir — Admin
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            View store
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:px-10">
        <nav className="lg:w-56 lg:shrink-0">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-0">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-1 text-xs uppercase tracking-label text-muted transition-colors hover:text-ink lg:py-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
