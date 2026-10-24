import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEgp } from "@/components/ui/price";

export default async function AdminShippingPage() {
  const { supabase } = await requireAdmin();

  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("governorate");

  async function addZone(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const governorate = String(formData.get("governorate") ?? "").trim();
    const fee = Number(formData.get("fee") ?? 0);
    const is_active = formData.get("is_active") === "on";

    await s.from("shipping_zones").insert({
      governorate,
      fee,
      is_active,
    });
  }

  async function updateZone(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const id = String(formData.get("id") ?? "");
    const governorate = String(formData.get("governorate") ?? "").trim();
    const fee = Number(formData.get("fee") ?? 0);
    const is_active = formData.get("is_active") === "on";

    await s
      .from("shipping_zones")
      .update({ governorate, fee, is_active })
      .eq("id", id);
  }

  async function deleteZone(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    await s.from("shipping_zones").delete().eq("id", id);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Settings</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Shipping Zones</h1>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">Add zone</h2>
        <form
          action={addZone}
          className="mt-4 flex flex-wrap items-end gap-4 border-t border-line pt-6"
        >
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Governorate
            </label>
            <Input name="governorate" required className="mt-2 w-64" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Fee (EGP)
            </label>
            <Input name="fee" type="number" required className="mt-2 w-40" />
          </div>
          <label className="flex items-center gap-2 pb-3 text-sm text-ink">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <Button type="submit" className="mb-0">
            Add
          </Button>
        </form>
      </div>

      <div className="mt-12 overflow-x-auto border-t border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Governorate
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Fee
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Status
              </th>
              <th className="py-4 text-right text-xs uppercase tracking-label text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(zones ?? []).map((zone) => (
              <tr key={zone.id} className="border-b border-line">
                <td className="py-4 pr-6 text-ink">{zone.governorate}</td>
                <td className="py-4 pr-6 text-muted">
                  {formatEgp(Number(zone.fee))}
                </td>
                <td className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                  {zone.is_active ? "Active" : "Inactive"}
                </td>
                <td className="py-4 text-right">
                  <form action={updateZone} className="inline-flex items-center gap-3">
                    <input type="hidden" name="id" value={zone.id} />
                    <input type="hidden" name="governorate" value={zone.governorate} />
                    <input type="hidden" name="fee" value={String(zone.fee)} />
                    <input type="hidden" name="is_active" value={zone.is_active ? "on" : ""} />
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                    >
                      Toggle
                    </button>
                  </form>
                  <form action={deleteZone} className="ml-3 inline">
                    <input type="hidden" name="id" value={zone.id} />
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
