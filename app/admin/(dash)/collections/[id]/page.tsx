import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!collection) {
    notFound();
  }

  async function updateCollection(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const description = String(formData.get("description") ?? "").trim();
    const image_url = String(formData.get("image_url") ?? "").trim();
    const sort_order = Number(formData.get("sort_order") ?? 0);
    const is_visible = formData.get("is_visible") === "on";

    await s
      .from("collections")
      .update({
        name,
        slug,
        description: description || null,
        image_url: image_url || null,
        sort_order,
        is_visible,
      })
      .eq("id", id);

    redirect("/admin/collections");
  }

  async function deleteCollection() {
    "use server";
    const { supabase: s } = await requireAdmin();
    await s.from("collections").delete().eq("id", id);
    redirect("/admin/collections");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Catalog</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Edit collection</h1>

      <form action={updateCollection} className="mt-10 max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Name
            </label>
            <Input name="name" required defaultValue={collection.name} className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Slug
            </label>
            <Input name="slug" required defaultValue={collection.slug} className="mt-2" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Image URL
          </label>
          <Input name="image_url" defaultValue={collection.image_url ?? ""} className="mt-2" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Description
          </label>
          <Textarea name="description" rows={4} defaultValue={collection.description ?? ""} className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Sort order
            </label>
            <Input name="sort_order" type="number" defaultValue={String(collection.sort_order)} className="mt-2" />
          </div>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="is_visible" defaultChecked={collection.is_visible} />
            Visible
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save changes</Button>
          <Button formAction={deleteCollection} variant="outline">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
