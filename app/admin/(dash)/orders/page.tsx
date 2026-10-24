import { requireAdmin } from "@/lib/admin/require-admin";
import { Button } from "@/components/ui/button";
import { formatEgp } from "@/components/ui/price";

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, email, phone, status, payment_status, payment_method, total, created_at",
    )
    .order("created_at", { ascending: false });

  async function updateStatus(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as
      | "new"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled";
    await s.from("orders").update({ status }).eq("id", id);
  }

  async function updatePayment(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const payment_status = String(formData.get("payment_status") ?? "") as
      | "pending"
      | "paid"
      | "failed"
      | "refunded";
    await s.from("orders").update({ payment_status }).eq("id", id);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Sales</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Orders</h1>

      <div className="mt-10 overflow-x-auto border-t border-line">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Order
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Customer
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Total
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Status
              </th>
              <th className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                Payment
              </th>
              <th className="py-4 text-right text-xs uppercase tracking-label text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-line">
                <td className="py-4 pr-6">
                  <p className="text-ink">{order.order_number}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString("en-EG")}
                  </p>
                </td>
                <td className="py-4 pr-6">
                  <p className="text-ink">{order.customer_name}</p>
                  <p className="mt-1 text-xs text-muted">{order.email}</p>
                  <p className="text-xs text-muted">{order.phone}</p>
                </td>
                <td className="py-4 pr-6 text-muted">
                  {formatEgp(Number(order.total))}
                </td>
                <td className="py-4 pr-6">
                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="h-9 border border-line bg-paper px-2 text-xs uppercase tracking-label"
                    >
                      {["new", "confirmed", "shipped", "delivered", "cancelled"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                    <Button type="submit" variant="ghost" className="h-9 px-3 text-xs">
                      Update
                    </Button>
                  </form>
                </td>
                <td className="py-4 pr-6">
                  <form action={updatePayment} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="payment_status"
                      defaultValue={order.payment_status}
                      className="h-9 border border-line bg-paper px-2 text-xs uppercase tracking-label"
                    >
                      {["pending", "paid", "failed", "refunded"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="ghost" className="h-9 px-3 text-xs">
                      Update
                    </Button>
                  </form>
                </td>
                <td className="py-4 text-right">
                  <a
                    href={`/admin/orders/${order.id}`}
                    className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(orders ?? []).length === 0 ? (
          <p className="py-6 text-sm text-muted">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
