"use client";

import { Toaster as SonnerToaster } from "sonner";

export function AppToaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-ink !text-cream !border-cream/20 !rounded-none !font-sans !shadow-none",
          title: "!text-[11px] !uppercase !tracking-label !text-cream",
          description: "!text-xs !text-cream/70",
          actionButton: "!bg-gold !text-ink !rounded-none !text-[11px] !uppercase !tracking-label",
          cancelButton: "!bg-transparent !text-cream/70 !rounded-none !text-[11px] !uppercase !tracking-label",
          closeButton: "!text-cream/60",
        },
      }}
    />
  );
}
