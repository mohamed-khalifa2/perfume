"use server";

import { createClient } from "@/lib/supabase/server";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Please enter your name, email address and message.",
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  if (message.length > 5000) {
    return {
      status: "error",
      message: "Your message is too long. Please keep it under 5,000 characters.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    return {
      status: "error",
      message:
        "Your inquiry could not be sent right now. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Thank you for reaching out. We'll be in touch with you shortly.",
  };
}
