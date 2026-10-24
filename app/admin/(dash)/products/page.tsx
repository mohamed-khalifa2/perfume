import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { formatEgp } from "@/components/ui/price";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      brand,
      is_visible,
      is_featured,
      is_new,
      sort_order,
      product_variants (price, compare_at_price, stock)
    `,
    )
    .order("sort_order");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-label text-gold">
            Catalog
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink px-6 py-3 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
        >
          New product
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto border-t border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Product
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Brand
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Price range
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Status
              </th>
              <th className="py-4 text-right text-xs uppercase tracking-label text-muted">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => {
              const variants = (product.product_variants ?? []) as Array<{
                price: number;
                compare_at_price: number | null;
                stock: number;
              }>;
              const prices = variants.map((v) => v.price).filter((p) => typeof p === "number");
              const minPrice = prices.length ? Math.min(...prices) : null;
              const maxPrice = prices.length ? Math.max(...prices) : null;

              return (
                <tr key={product.id} className="border-b border-line">
                  <td className="py-4 pr-6">
                    <p className="text-ink">{product.name}</p>
                    <p className="mt-1 text-xs text-muted">{product.slug}</p>
                  </td>
                  <td className="py-4 pr-6 text-muted">{product.brand}</td>
                  <td className="py-4 pr-6 text-muted">
                    {minPrice !== null && maxPrice !== null
                      ? minPrice === maxPrice
                        ? formatEgp(minPrice)
                        : `${formatEgp(minPrice)} – ${formatEgp(maxPrice)}`
                      : "—"}
                  </td>
                  <td className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                    {product.is_visible ? "Visible" : "Hidden"}
                    {product.is_featured ? " · Featured" : ""}
                    {product.is_new ? " · New" : ""}
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(products ?? []).length === 0 ? (
          <p className="py-6 text-sm text-muted">No products found.</p>
        ) : null}
      </div>
    </div>
  );
}
