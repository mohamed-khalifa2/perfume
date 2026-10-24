import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function NewCollectionPage() {
  await requireAdmin();

  async function createCollection(formData: FormData) {
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

    await s.from("collections").insert({
      name,
      slug,
      description: description || null,
      image_url: image_url || null,
      sort_order,
      is_visible,
    });

    redirect("/admin/collections");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Catalog</p>
      <h1 className="mt-4 font-display text-4xl text-ink">New collection</h1>

      <form action={createCollection} className="mt-10 max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Name
            </label>
            <Input name="name" required className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Slug
            </label>
            <Input name="slug" required className="mt-2" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Image URL
          </label>
          <Input name="image_url" className="mt-2" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Description
          </label>
          <Textarea name="description" rows={4} className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Sort order
            </label>
            <Input name="sort_order" type="number" defaultValue="0" className="mt-2" />
          </div>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" name="is_visible" defaultChecked />
            Visible
          </label>
        </div>
        <Button type="submit">Create collection</Button>
      </form>
    </div>
  );
}
