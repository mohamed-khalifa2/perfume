import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occurred",
  "gateway_integration_id",
  "is_3d_secure",
  "integration_id",
  "order_id",
  "payment_id",
  "payment_method",
  "payment_status",
  "pending",
  "ref_id",
  "reserved_order_id",
  "success",
] as const;

function valueAsString(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value[0] ?? "";
  return String(value);
}

function parsePayload(raw: string, contentType: string): Record<string, unknown> {
  if (contentType.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  }

  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

function isValidHmac(payload: Record<string, unknown>, secret: string): boolean {
  const received = valueAsString(payload.hmac);
  if (!received) return false;

  const data = HMAC_FIELDS.map((field) => valueAsString(payload[field])).join("");
  const expected = createHmac("sha512", secret).update(data).digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret || /placeholder|your-|xxx|change/i.test(secret)) {
    return NextResponse.json({ received: false }, { status: 503 });
  }

  const raw = await request.text();
  const payload = parsePayload(raw, request.headers.get("content-type") ?? "");

  if (!isValidHmac(payload, secret)) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const paymobOrderId = valueAsString(payload.order_id);
  if (!paymobOrderId) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const success =
    valueAsString(payload.success) === "true" ||
    valueAsString(payload.payment_status) === "successful";

  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ payment_status: success ? "paid" : "failed" })
    .eq("paymob_order_id", paymobOrderId);

  if (error) {
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
