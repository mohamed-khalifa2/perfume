import Link from "next/link";

import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminCollectionsPage() {
  await requireAdmin();
  const { supabase } = await requireAdmin();

  const { data: collections } = await supabase
    .from("collections")
    .select("id, name, slug, is_visible, sort_order")
    .order("sort_order");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-label text-gold">
            Catalog
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink">Collections</h1>
        </div>
        <Link
          href="/admin/collections/new"
          className="bg-ink px-6 py-3 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold"
        >
          New collection
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto border-t border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Name
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Slug
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
            {(collections ?? []).map((collection) => (
              <tr key={collection.id} className="border-b border-line">
                <td className="py-4 pr-6 text-ink">{collection.name}</td>
                <td className="py-4 pr-6 text-muted">{collection.slug}</td>
                <td className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                  {collection.is_visible ? "Visible" : "Hidden"}
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`/admin/collections/${collection.id}`}
                    className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(collections ?? []).length === 0 ? (
          <p className="py-6 text-sm text-muted">No collections found.</p>
        ) : null}
      </div>
    </div>
  );
}
