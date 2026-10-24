import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/require-admin";
import { formatEgp } from "@/components/ui/price";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Sales</p>
      <h1 className="mt-4 font-display text-4xl text-ink">
        Order {order.order_number}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-ink">Customer</h2>
          <div className="mt-4 space-y-2 text-sm text-ink">
            <p>{order.customer_name}</p>
            <p className="text-muted">{order.email}</p>
            <p className="text-muted">{order.phone}</p>
            <p className="mt-4 text-muted">
              {order.governorate}
              {order.city ? `, ${order.city}` : ""}
            </p>
            <p className="text-muted">{order.address}</p>
            {order.notes ? <p className="mt-4 text-muted">Notes: {order.notes}</p> : null}
          </div>

          <h2 className="mt-10 font-display text-xl text-ink">Payment</h2>
          <div className="mt-4 space-y-2 text-sm text-ink">
            <p className="text-muted">Method: {order.payment_method}</p>
            <p className="text-muted">Status: {order.payment_status}</p>
            <p className="text-muted">Order status: {order.status}</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Items</h2>
          <div className="mt-4 border-t border-line">
            {(items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-line py-4"
              >
                <div>
                  <p className="text-ink">{item.product_name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.size_ml} ml · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-muted">
                  {formatEgp(Number(item.unit_price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatEgp(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{formatEgp(Number(order.shipping_fee))}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Discount</span>
              <span>-{formatEgp(Number(order.discount))}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-ink">
              <span>Total</span>
              <span>{formatEgp(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
