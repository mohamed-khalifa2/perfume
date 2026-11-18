"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type TrackedOrderItem = {
  productName: string;
  sizeMl: number;
  quantity: number;
  unitPrice: number;
};

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: TrackedOrderItem[];
};

export type TrackOrderState = {
  status: "idle" | "success" | "error";
  message: string;
  order?: TrackedOrder;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function trackOrder(
  _previous: TrackOrderState,
  formData: FormData,
): Promise<TrackOrderState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!orderNumber || !EMAIL_PATTERN.test(email)) {
    return {
      status: "error",
      message: "Enter your order number and the email used at checkout.",
    };
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, payment_status, total, created_at, email",
    )
    .ilike("order_number", orderNumber)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return {
      status: "error",
      message: "We could not look up that order right now. Please try again.",
    };
  }

  if (!order) {
    return {
      status: "error",
      message: "No order was found with those details.",
    };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, size_ml, quantity, unit_price")
    .eq("order_id", order.id);

  return {
    status: "success",
    message: "Order found.",
    order: {
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      total: Number(order.total),
      createdAt: order.created_at,
      items: (items ?? []).map((item) => ({
        productName: item.product_name,
        sizeMl: Number(item.size_ml),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
      })),
    },
  };
}
