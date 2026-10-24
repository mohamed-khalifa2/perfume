import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function AdminHeroPage() {
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
    const image_url = String(formData.get("image_url") ?? "").trim();
    const cta_label = String(formData.get("cta_label") ?? "").trim();
    const cta_link = String(formData.get("cta_link") ?? "").trim();

    await s.from("hero").upsert({
      id: true,
      headline,
      subheadline: subheadline || null,
      image_url: image_url || null,
      cta_label: cta_label || null,
      cta_link: cta_link || null,
    });
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Content</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Hero</h1>

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
        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Image URL
          </label>
          <Input
            name="image_url"
            defaultValue={hero?.image_url ?? ""}
            className="mt-2"
          />
        </div>
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
