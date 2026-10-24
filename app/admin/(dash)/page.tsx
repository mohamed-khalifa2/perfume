import Link from "next/link";

import { requireAdmin } from "@/lib/admin/require-admin";
import { formatEgp } from "@/components/ui/price";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const { supabase } = await requireAdmin();

  const [{ count: products }, { count: orders }, { count: inquiries }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
    ]);

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");

  const revenue = (revenueData ?? []).reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Admin</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Dashboard</h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Orders", value: orders ?? 0 },
          { label: "Revenue (Delivered)", value: formatEgp(revenue) },
          { label: "Products", value: products ?? 0 },
          { label: "Inquiries", value: inquiries ?? 0 },
        ].map((item) => (
          <div key={item.label} className="border-t border-line pt-6">
            <p className="text-xs uppercase tracking-label text-muted">
              {item.label}
            </p>
            <p className="mt-3 font-display text-3xl text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-between border-t border-line pt-8">
          <h2 className="font-display text-2xl text-ink">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
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
                <th className="py-4 text-right text-xs uppercase tracking-label text-muted">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).map((order) => (
                <tr key={order.id} className="border-b border-line">
                  <td className="py-4 pr-6 text-ink">{order.order_number}</td>
                  <td className="py-4 pr-6 text-muted">{order.customer_name}</td>
                  <td className="py-4 pr-6 text-muted">
                    {formatEgp(Number(order.total))}
                  </td>
                  <td className="py-4 pr-6 text-xs uppercase tracking-label text-muted">
                    {order.status}
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs uppercase tracking-label text-muted transition-colors hover:text-ink"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(recentOrders ?? []).length === 0 ? (
            <p className="py-6 text-sm text-muted">No orders yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
