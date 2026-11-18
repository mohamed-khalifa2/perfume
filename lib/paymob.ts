import "server-only";

import type { CreateOrderResult } from "@/types/database";

const PAYMOB_API = "https://accept.paymob.com/api";
const PAYMOB_IFRAME_HOST = "https://accept.paymobsolutions.com";

type PaymobBillingData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

type PaymobSession = {
  iframeUrl: string;
  paymobOrderId: string;
};

function isConfiguredValue(value: string | undefined): value is string {
  if (!value) return false;
  return !/placeholder|your-|xxx|change/i.test(value);
}

export function isPaymobConfigured(): boolean {
  return [
    process.env.PAYMOB_API_KEY,
    process.env.PAYMOB_HMAC_SECRET,
    process.env.PAYMOB_IFRAME_ID,
    process.env.PAYMOB_INTEGRATION_ID,
  ].every(isConfiguredValue);
}

export function paymobIframeOrigin(): string {
  return PAYMOB_IFRAME_HOST;
}

export async function createPaymobIframe(
  order: CreateOrderResult,
  billing: PaymobBillingData,
): Promise<PaymobSession> {
  if (!isPaymobConfigured()) {
    throw new Error("PAYMOB_NOT_CONFIGURED: Paymob credentials are missing.");
  }

  const apiKey = process.env.PAYMOB_API_KEY!;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID!;
  const iframeId = process.env.PAYMOB_IFRAME_ID!;
  const amountCents = Math.round(order.total * 100);

  const tokenResponse = await fetch(`${PAYMOB_API}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new Error("PAYMOB_AUTH: Could not start the payment session.");
  }

  const tokenData = (await tokenResponse.json()) as { token?: string };
  if (!tokenData.token) {
    throw new Error("PAYMOB_AUTH: Could not start the payment session.");
  }

  const orderResponse = await fetch(`${PAYMOB_API}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: tokenData.token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: order.order_number,
      items: [],
    }),
    cache: "no-store",
  });

  if (!orderResponse.ok) {
    throw new Error("PAYMOB_ORDER: Could not register the payment.");
  }

  const paymobOrder = (await orderResponse.json()) as { id?: number };
  if (!paymobOrder.id) {
    throw new Error("PAYMOB_ORDER: Could not register the payment.");
  }

  const [firstName, ...lastNameParts] = billing.name.trim().split(/\s+/);
  const billingData = {
    apartment: "N/A",
    building: "N/A",
    city: billing.city || "Cairo",
    country: "Egypt",
    email: billing.email,
    first_name: firstName || "Customer",
    floor: "N/A",
    last_name: lastNameParts.join(" ") || "Customer",
    phone: billing.phone,
    postal_code: "N/A",
    state: billing.city || "Cairo",
    street: billing.address,
  };

  const keyResponse = await fetch(`${PAYMOB_API}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: tokenData.token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrder.id,
      billing_data: billingData,
      currency: "EGP",
      integration_id: Number(integrationId),
    }),
    cache: "no-store",
  });

  if (!keyResponse.ok) {
    throw new Error("PAYMOB_KEY: Could not prepare the payment page.");
  }

  const keyData = (await keyResponse.json()) as { token?: string };
  if (!keyData.token) {
    throw new Error("PAYMOB_KEY: Could not prepare the payment page.");
  }

  return {
    iframeUrl: `${PAYMOB_IFRAME_HOST}/api/acceptance/iframes/${iframeId}?payment_token=${encodeURIComponent(keyData.token)}`,
    paymobOrderId: String(paymobOrder.id),
  };
}
