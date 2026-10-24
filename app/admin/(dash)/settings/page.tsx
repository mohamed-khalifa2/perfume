import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();

    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();

  async function updateSettings(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const store_name = String(formData.get("site_name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const instagram = String(formData.get("instagram") ?? "").trim();
    const facebook = String(formData.get("facebook") ?? "").trim();
    const tiktok = String(formData.get("tiktok") ?? "").trim();
    const footer_text = String(formData.get("footer_text") ?? "").trim();
    const free_shipping_threshold = formData.get("free_shipping_threshold")
      ? Number(formData.get("free_shipping_threshold"))
      : null;
    const seo_title = String(formData.get("seo_title") ?? "").trim();
    const seo_description = String(formData.get("seo_description") ?? "").trim();

    await s.from("site_settings").upsert({
      id: true as unknown as boolean,
      store_name,
      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      instagram: instagram || null,
      facebook: facebook || null,
      tiktok: tiktok || null,
      footer_text: footer_text || null,
      free_shipping_threshold,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
    });
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Settings</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Site Settings</h1>

      <form action={updateSettings} className="mt-10 max-w-3xl space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Site Name
            </label>
            <Input
              name="site_name"
              required
              defaultValue={settings?.store_name ?? "Maison Noir"}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Email
            </label>
            <Input
              name="email"
              type="email"
              defaultValue={settings?.email ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Phone
            </label>
            <Input
              name="phone"
              defaultValue={settings?.phone ?? ""}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              WhatsApp
            </label>
            <Input
              name="whatsapp"
              defaultValue={settings?.whatsapp ?? ""}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-label text-gold">Social</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input
              name="instagram"
              placeholder="Instagram URL"
              defaultValue={settings?.instagram ?? ""}
            />
            <Input
              name="facebook"
              placeholder="Facebook URL"
              defaultValue={settings?.facebook ?? ""}
            />
            <Input
              name="tiktok"
              placeholder="TikTok URL"
              defaultValue={settings?.tiktok ?? ""}
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-label text-muted">
            Footer Text
          </label>
          <Textarea
            name="footer_text"
            rows={3}
            defaultValue={settings?.footer_text ?? ""}
            className="mt-2"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Free Shipping Threshold (EGP)
            </label>
            <Input
              name="free_shipping_threshold"
              type="number"
              defaultValue={
                settings?.free_shipping_threshold != null
                  ? String(settings.free_shipping_threshold)
                  : "3000"
              }
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-label text-gold">SEO</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-label text-muted">
                SEO Title
              </label>
              <Input
                name="seo_title"
                defaultValue={settings?.seo_title ?? ""}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-label text-muted">
                SEO Description
              </label>
              <Textarea
                name="seo_description"
                rows={3}
                defaultValue={settings?.seo_description ?? ""}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
