import { redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidatePublicCatalog } from "@/lib/catalog-cache";
import { uniqueSlug } from "@/lib/admin/slug";
import {
  getFormFile,
  uploadErrorMessage,
  uploadSiteImage,
} from "@/lib/admin/upload";

export default async function NewCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  await requireAdmin();

  async function createCollection(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const sort_order = Number(formData.get("sort_order") ?? 0);
    const is_visible = formData.get("is_visible") === "on";

    if (!name) {
      redirect("/admin/collections/new?error=Name%20is%20required.");
    }

    let image_url = String(formData.get("image_url") ?? "").trim();
    const file = getFormFile(formData, "image_file");

    try {
      if (file) {
        image_url = await uploadSiteImage(s, file, "collections", name);
      }
    } catch (uploadError) {
      redirect(
        `/admin/collections/new?error=${encodeURIComponent(uploadErrorMessage(uploadError))}`,
      );
    }

    const slug = await uniqueSlug(s, "collections", name);

    const { error: saveError } = await s.from("collections").insert({
      name,
      slug,
      description: description || null,
      image_url: image_url || null,
      sort_order,
      is_visible,
    });

    if (saveError) {
      redirect(
        `/admin/collections/new?error=${encodeURIComponent(saveError.message)}`,
      );
    }

    revalidatePublicCatalog();
    redirect("/admin/collections");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold-on-light">Catalog</p>
      <h1 className="mt-4 font-display text-4xl text-ink">New collection</h1>

      <AdminNotice error={error} />

      <form action={createCollection} className="mt-10 max-w-2xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Name
          </label>
          <Input name="name" required className="mt-2" />
          <p className="mt-2 text-xs text-muted">
            The URL slug is generated from the name automatically.
          </p>
        </div>

        <ImageField
          label="Collection image"
          aspect="portrait"
          hint="Used on collection cards and the collection page header."
        />

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
