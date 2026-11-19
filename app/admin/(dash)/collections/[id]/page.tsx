import { notFound, redirect } from "next/navigation";

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

export default async function EditCollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
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
    const description = String(formData.get("description") ?? "").trim();
    const sort_order = Number(formData.get("sort_order") ?? 0);
    const is_visible = formData.get("is_visible") === "on";

    if (!name) {
      redirect(`/admin/collections/${id}?error=Name%20is%20required.`);
    }

    let image_url = String(formData.get("image_url") ?? "").trim();
    const file = getFormFile(formData, "image_file");

    try {
      if (file) {
        image_url = await uploadSiteImage(s, file, "collections", name);
      }
    } catch (uploadError) {
      redirect(
        `/admin/collections/${id}?error=${encodeURIComponent(uploadErrorMessage(uploadError))}`,
      );
    }

    const slug = await uniqueSlug(s, "collections", name, id);

    const { error: saveError } = await s
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

    if (saveError) {
      redirect(
        `/admin/collections/${id}?error=${encodeURIComponent(saveError.message)}`,
      );
    }

    revalidatePublicCatalog();
    redirect(`/admin/collections/${id}?saved=1`);
  }

  async function deleteCollection() {
    "use server";
    const { supabase: s } = await requireAdmin();
    await s.from("collections").delete().eq("id", id);
    revalidatePublicCatalog();
    redirect("/admin/collections");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold-on-light">Catalog</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Edit collection</h1>

      <AdminNotice error={error} saved={saved === "1"} />

      <form action={updateCollection} className="mt-10 max-w-2xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Name
          </label>
          <Input name="name" required defaultValue={collection.name} className="mt-2" />
          <p className="mt-2 text-xs text-muted">
            Slug: <span className="text-ink">{collection.slug}</span> · updated
            automatically when the name changes.
          </p>
        </div>

        <ImageField
          label="Collection image"
          aspect="portrait"
          defaultValue={collection.image_url ?? ""}
          hint="Used on collection cards and the collection page header."
        />

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
