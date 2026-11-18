"use server";

import { isPaymobConfigured, createPaymobIframe } from "@/lib/paymob";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateOrderResult,
  PaymentMethod,
} from "@/types/database";

export type CheckoutItem = {
  variantId: string;
  quantity: number;
};

export type CheckoutState = {
  status: "idle" | "success" | "error";
  message: string;
  order?: CreateOrderResult;
  iframeUrl?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-() ]{6,20}$/;

const ORDER_ERRORS: Record<string, string> = {
  CART_EMPTY: "Your bag is empty.",
  INVALID_QUANTITY: "One of the item quantities is invalid.",
  VARIANT_NOT_FOUND: "One of the items is no longer available.",
  PRODUCT_UNAVAILABLE: "One of the products is no longer available.",
  OUT_OF_STOCK: "One of the items is out of stock. Please update your bag.",
  INVALID_COUPON: "That coupon code is not valid.",
  COUPON_MIN_ORDER: "Your order does not meet the coupon minimum.",
  INVALID_GOVERNORATE: "We do not deliver to that governorate yet.",
  INVALID_PAYMENT_METHOD: "Please choose a valid payment method.",
  INVALID_CUSTOMER: "Please check your name, email and phone number.",
  INVALID_ADDRESS: "Please enter a delivery address.",
};

function friendlyOrderError(message: string): string {
  const code = message.split(":")[0]?.trim().toUpperCase() ?? "";
  return ORDER_ERRORS[code] ?? "We could not place your order. Please try again.";
}

async function markPaymobOrder(orderId: string, paymobOrderId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ paymob_order_id: paymobOrderId })
    .eq("id", orderId);

  if (error) {
    console.error("Could not store the Paymob order reference", error.message);
  }
}

export async function submitOrder(
  items: CheckoutItem[],
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const governorate = String(formData.get("governorate") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const couponCode = String(formData.get("coupon") ?? "").trim();
  const paymentMethod = String(
    formData.get("paymentMethod") ?? "cod",
  ).trim().toLowerCase() as PaymentMethod;

  if (!name || !EMAIL_PATTERN.test(email) || !PHONE_PATTERN.test(phone)) {
    return {
      status: "error",
      message: "Please enter your name, a valid email and a valid phone number.",
    };
  }

  if (!governorate || !address) {
    return {
      status: "error",
      message: "Please choose a governorate and enter a delivery address.",
    };
  }

  if (items.length === 0) {
    return { status: "error", message: "Your bag is empty." };
  }

  if (paymentMethod !== "cod" && paymentMethod !== "paymob") {
    return { status: "error", message: "Please choose a valid payment method." };
  }

  if (paymentMethod === "paymob" && !isPaymobConfigured()) {
    return {
      status: "error",
      message: "Card payment is not configured yet. Please choose cash on delivery.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_items: items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
    p_customer_name: name,
    p_email: email,
    p_phone: phone,
    p_governorate: governorate,
    p_city: city || null,
    p_address: address,
    p_notes: notes || null,
    p_coupon_code: couponCode || null,
    p_payment_method: paymentMethod,
  });

  if (error) {
    return { status: "error", message: friendlyOrderError(error.message) };
  }

  if (!data) {
    return {
      status: "error",
      message: "We could not place your order. Please try again.",
    };
  }

  const order = data as unknown as CreateOrderResult;

  if (paymentMethod === "cod") {
    return {
      status: "success",
      message: "Your order has been placed.",
      order,
    };
  }

  try {
    const session = await createPaymobIframe(order, {
      name,
      email,
      phone,
      address,
      city,
    });

    await markPaymobOrder(order.order_id, session.paymobOrderId);

    return {
      status: "success",
      message: "Your payment page is ready.",
      order,
      iframeUrl: session.iframeUrl,
    };
  } catch (paymobError) {
    console.error(
      "Paymob session failed",
      paymobError instanceof Error ? paymobError.message : paymobError,
    );

    return {
      status: "error",
      message:
        "Your order was created, but the payment page could not be loaded. Please contact us with your order number.",
      order,
    };
  }
}
