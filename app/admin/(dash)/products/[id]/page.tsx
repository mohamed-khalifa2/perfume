import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { GalleryField } from "@/components/admin/gallery-field";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin/require-admin";
import { uniqueSlug } from "@/lib/admin/slug";
import {
  getFormFile,
  getFormFiles,
  uploadErrorMessage,
  uploadSiteImage,
} from "@/lib/admin/upload";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();

  const [
    { data: product },
    { data: collections },
    { data: productCollections },
    { data: gallery },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("collections").select("id, name").order("sort_order"),
    supabase.from("product_collections").select("collection_id").eq("product_id", id),
    supabase
      .from("product_images")
      .select("id, image_url, sort_order")
      .eq("product_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  const selected = new Set((productCollections ?? []).map((pc) => pc.collection_id));

  async function updateProduct(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
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

    if (!name) {
      redirect(`/admin/products/${id}?error=Name%20is%20required.`);
    }

    let cover_image_url = String(formData.get("cover_image_url") ?? "").trim();
    const coverFile = getFormFile(formData, "cover_image_file");
    const galleryFiles = getFormFiles(formData, "gallery_files");
    const removeImageIds = formData
      .getAll("remove_images")
      .map((value) => String(value))
      .filter(Boolean);

    const galleryUrls: string[] = [];

    try {
      if (coverFile) {
        cover_image_url = await uploadSiteImage(s, coverFile, "products", name);
      }

      for (const [index, file] of galleryFiles.entries()) {
        const url = await uploadSiteImage(
          s,
          file,
          "products",
          `${name}-${index + 1}`,
        );
        galleryUrls.push(url);
      }
    } catch (uploadError) {
      redirect(
        `/admin/products/${id}?error=${encodeURIComponent(uploadErrorMessage(uploadError))}`,
      );
    }

    const slug = await uniqueSlug(s, "products", name, id);

    const { error: saveError } = await s
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

    if (saveError) {
      redirect(
        `/admin/products/${id}?error=${encodeURIComponent(saveError.message)}`,
      );
    }

    if (removeImageIds.length) {
      await s
        .from("product_images")
        .delete()
        .eq("product_id", id)
        .in("id", removeImageIds);
    }

    if (galleryUrls.length) {
      const { data: remaining } = await s
        .from("product_images")
        .select("sort_order")
        .eq("product_id", id)
        .order("sort_order", { ascending: false })
        .limit(1);

      const startOrder = (remaining?.[0]?.sort_order ?? 0) + 1;

      await s.from("product_images").insert(
        galleryUrls.map((url, index) => ({
          product_id: id,
          image_url: url,
          sort_order: startOrder + index,
        })),
      );
    }

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

    redirect(`/admin/products/${id}?saved=1`);
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

      <AdminNotice error={error} saved={saved === "1"} />

      <form action={updateProduct} className="mt-10 max-w-3xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Name
          </label>
          <Input name="name" required defaultValue={product.name} className="mt-2" />
          <p className="mt-2 text-xs text-muted">
            Slug: <span className="text-ink">{product.slug}</span> · updated
            automatically when the name changes.
          </p>
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

        <ImageField
          label="Cover image"
          urlName="cover_image_url"
          fileName="cover_image_file"
          aspect="portrait"
          defaultValue={product.cover_image_url ?? ""}
          hint="Used on product cards and as the first image on the product page."
        />

        <GalleryField
          label="Gallery images"
          existing={(gallery ?? []).map((image) => ({
            id: image.id,
            imageUrl: image.image_url,
          }))}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Scent Family
            </label>
            <Input name="scent_family" defaultValue={product.scent_family ?? ""} className="mt-2" />
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
