import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: product }, { data: collections }, { data: productCollections }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).maybeSingle(),
      supabase.from("collections").select("id, name").order("sort_order"),
      supabase.from("product_collections").select("collection_id").eq("product_id", id),
    ]);

  if (!product) {
    notFound();
  }

  const selected = new Set((productCollections ?? []).map((pc) => pc.collection_id));

  async function updateProduct(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const brand = String(formData.get("brand") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const gender = String(formData.get("gender") ?? "unisex") as
      | "men"
      | "women"
      | "unisex";
    const concentration = String(formData.get("concentration") ?? "EDP") as
      | "EDT"
      | "EDP"
      | "Parfum"
      | "Extrait";
    const scent_family = String(formData.get("scent_family") ?? "").trim();
    const cover_image_url = String(formData.get("cover_image_url") ?? "").trim();
    const top_notes = String(formData.get("top_notes") ?? "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const heart_notes = String(formData.get("heart_notes") ?? "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const base_notes = String(formData.get("base_notes") ?? "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const is_featured = formData.get("is_featured") === "on";
    const is_new = formData.get("is_new") === "on";
    const is_visible = formData.get("is_visible") === "on";
    const sort_order = Number(formData.get("sort_order") ?? 0);

    await s
      .from("products")
      .update({
        name,
        slug,
        brand: brand || null,
        description: description || null,
        gender,
        concentration,
        scent_family: scent_family || null,
        cover_image_url: cover_image_url || null,
        top_notes,
        heart_notes,
        base_notes,
        is_featured,
        is_new,
        is_visible,
        sort_order,
      })
      .eq("id", id);

    await s.from("product_collections").delete().eq("product_id", id);
    const collectionIds = formData.getAll("collections");
    if (collectionIds.length) {
      await s.from("product_collections").insert(
        collectionIds.map((cid) => ({
          product_id: id,
          collection_id: String(cid),
        })),
      );
    }

    redirect("/admin/products");
  }

  async function deleteProduct() {
    "use server";
    const { supabase: s } = await requireAdmin();
    await s.from("products").delete().eq("id", id);
    redirect("/admin/products");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Catalog</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Edit product</h1>

      <form action={updateProduct} className="mt-10 max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Name
            </label>
            <Input name="name" required defaultValue={product.name} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Slug
            </label>
            <Input name="slug" required defaultValue={product.slug} className="mt-2" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Brand
            </label>
            <Input name="brand" defaultValue={product.brand ?? ""} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Gender
            </label>
            <select
              name="gender"
              defaultValue={product.gender}
              className="mt-2 h-11 w-full border border-line bg-paper px-3 text-sm"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Concentration
            </label>
            <select
              name="concentration"
              defaultValue={product.concentration}
              className="mt-2 h-11 w-full border border-line bg-paper px-3 text-sm"
            >
              <option value="EDT">EDT</option>
              <option value="EDP">EDP</option>
              <option value="Parfum">Parfum</option>
              <option value="Extrait">Extrait</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Scent Family
            </label>
            <Input name="scent_family" defaultValue={product.scent_family ?? ""} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Cover Image URL
            </label>
            <Input name="cover_image_url" defaultValue={product.cover_image_url ?? ""} className="mt-2" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Description
          </label>
          <Textarea name="description" rows={5} defaultValue={product.description ?? ""} className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Top Notes (comma separated)
            </label>
            <Input name="top_notes" defaultValue={(product.top_notes ?? []).join(", ")} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Heart Notes (comma separated)
            </label>
            <Input name="heart_notes" defaultValue={(product.heart_notes ?? []).join(", ")} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Base Notes (comma separated)
            </label>
            <Input name="base_notes" defaultValue={(product.base_notes ?? []).join(", ")} className="mt-2" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-label text-muted">Collections</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {(collections ?? []).map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="collections"
                  value={c.id}
                  defaultChecked={selected.has(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_new" defaultChecked={product.is_new} />
            New
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_visible" defaultChecked={product.is_visible} />
            Visible
          </label>
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Sort Order
          </label>
          <Input name="sort_order" type="number" defaultValue={String(product.sort_order)} className="mt-2 w-32" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save changes</Button>
          <Button formAction={deleteProduct} variant="outline">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
