import { requireAdmin } from "@/lib/admin/require-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEgp } from "@/components/ui/price";

export default async function AdminCouponsPage() {
  const { supabase } = await requireAdmin();

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  async function addCoupon(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();

    const code = String(formData.get("code") ?? "")
      .trim()
      .toUpperCase();
    const type = String(formData.get("type") ?? "percent") as "percent" | "fixed";
    const value = Number(formData.get("value") ?? 0);
    const min_order = Number(formData.get("min_order") ?? 0);
    const max_uses = formData.get("max_uses")
      ? Number(formData.get("max_uses"))
      : null;
    const is_active = formData.get("is_active") === "on";

    await s.from("coupons").insert({
      code,
      type,
      value,
      min_order,
      max_uses,
      used_count: 0,
      is_active,
    });
  }

  async function toggleCoupon(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const is_active = formData.get("is_active") === "on";
    await s.from("coupons").update({ is_active: !is_active }).eq("id", id);
  }

  async function deleteCoupon(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    await s.from("coupons").delete().eq("id", id);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Sales</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Coupons</h1>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink">Add coupon</h2>
        <form
          action={addCoupon}
          className="mt-4 grid gap-4 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div className="lg:col-span-2">
            <label className="text-xs uppercase tracking-label text-muted">
              Code
            </label>
            <Input name="code" required className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Type
            </label>
            <select
              name="type"
              className="mt-2 h-11 w-full border border-line bg-paper px-3 text-sm"
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Value
            </label>
            <Input name="value" type="number" required className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Min Order
            </label>
            <Input name="min_order" type="number" defaultValue="0" className="mt-2" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-label text-muted">
              Max Uses
            </label>
            <Input name="max_uses" type="number" className="mt-2" />
          </div>
          <label className="flex items-center gap-2 pb-3 text-sm text-ink sm:col-span-2 lg:col-span-6">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <div className="sm:col-span-2 lg:col-span-6">
            <Button type="submit">Add coupon</Button>
          </div>
        </form>
      </div>

      <div className="mt-12 overflow-x-auto border-t border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Code
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Type / Value
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Min Order
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Uses
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
            {(coupons ?? []).map((coupon) => (
              <tr key={coupon.id} className="border-b border-line">
                <td className="py-4 pr-6 text-ink">{coupon.code}</td>
                <td className="py-4 pr-6 text-muted">
                  {coupon.type === "percent"
                    ? `${coupon.value}%`
                    : formatEgp(Number(coupon.value))}
                </td>
                <td className="py-4 pr-6 text-muted">
                  {formatEgp(Number(coupon.min_order))}
                </td>
                <td className="py-4 pr-6 text-muted">
                  {coupon.used_count}
                  {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                </td>
                <td className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                  {coupon.is_active ? "Active" : "Inactive"}
                </td>
                <td className="py-4 text-right">
                  <form action={toggleCoupon} className="inline">
                    <input type="hidden" name="id" value={coupon.id} />
                    <input type="hidden" name="is_active" value={coupon.is_active ? "on" : ""} />
                    <button
                      type="submit"
                      className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                    >
                      {coupon.is_active ? "Disable" : "Enable"}
                    </button>
                  </form>
                  <form action={deleteCoupon} className="ml-3 inline">
                    <input type="hidden" name="id" value={coupon.id} />
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
