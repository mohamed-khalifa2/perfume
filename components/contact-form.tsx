"use client";

import { Check, TriangleAlert } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

import { sendInquiry } from "@/app/(site)/contact/actions";

const INITIAL_STATE = {
  status: "idle",
  message: "",
} as const;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const lastSuccessRef = useRef<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    sendInquiry,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status !== "success" || state.message === lastSuccessRef.current) {
      return;
    }

    lastSuccessRef.current = state.message;
    formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="contact-name"
          className="text-xs uppercase tracking-label text-ink"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={120}
          className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-xs uppercase tracking-label text-ink"
        >
          Email address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="text-xs uppercase tracking-label text-ink"
        >
          Phone number <span className="text-muted">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          maxLength={40}
          className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-xs uppercase tracking-label text-ink"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      {state.status !== "idle" ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`flex items-start gap-2 text-sm ${
            state.status === "error" ? "text-gold-on-light" : "text-ink"
          }`}
        >
          {state.status === "error" ? (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          ) : (
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
          )}
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-8 py-4 text-xs uppercase tracking-label text-paper transition-colors hover:bg-gold disabled:cursor-wait disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
