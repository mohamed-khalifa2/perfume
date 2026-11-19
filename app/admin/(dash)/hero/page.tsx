import { redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidatePublicCatalog } from "@/lib/catalog-cache";
import {
  getFormFile,
  uploadErrorMessage,
  uploadSiteImage,
} from "@/lib/admin/upload";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();

  const { data: hero } = await supabase
    .from("hero")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  async function updateHero(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const headline = String(formData.get("headline") ?? "").trim();
    const subheadline = String(formData.get("subheadline") ?? "").trim();
    const cta_label = String(formData.get("cta_label") ?? "").trim();
    const cta_link = String(formData.get("cta_link") ?? "").trim();

    if (!headline) {
      redirect("/admin/hero?error=Headline%20is%20required.");
    }

    let image_url = String(formData.get("image_url") ?? "").trim();
    const file = getFormFile(formData, "image_file");

    try {
      if (file) {
        image_url = await uploadSiteImage(s, file, "hero", headline);
      }
    } catch (uploadError) {
      redirect(
        `/admin/hero?error=${encodeURIComponent(uploadErrorMessage(uploadError))}`,
      );
    }

    await s.from("hero").upsert({
      id: true,
      headline,
      subheadline: subheadline || null,
      image_url: image_url || null,
      cta_label: cta_label || null,
      cta_link: cta_link || null,
    });

    revalidatePublicCatalog();
    redirect("/admin/hero?saved=1");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold-on-light">Content</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Hero</h1>

      <AdminNotice error={error} saved={saved === "1"} />

      <form action={updateHero} className="mt-10 max-w-2xl space-y-6">
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Headline
          </label>
          <Input
            name="headline"
            required
            defaultValue={hero?.headline ?? ""}
            className="mt-2"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Subheadline
          </label>
          <Textarea
            name="subheadline"
            rows={3}
            defaultValue={hero?.subheadline ?? ""}
            className="mt-2"
          />
        </div>

        <ImageField
          label="Hero image"
          aspect="wide"
          defaultValue={hero?.image_url ?? ""}
          hint="Landscape images work best. Uploaded files replace the URL above."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              CTA Label
            </label>
            <Input
              name="cta_label"
              defaultValue={hero?.cta_label ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              CTA Link
            </label>
            <Input
              name="cta_link"
              defaultValue={hero?.cta_link ?? ""}
              className="mt-2"
            />
          </div>
        </div>
        <Button type="submit">Save hero</Button>
      </form>
    </div>
  );
}
