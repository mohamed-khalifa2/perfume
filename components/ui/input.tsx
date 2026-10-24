import { cva } from "class-variance-authority";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "w-full border bg-transparent px-4 text-sm text-ink transition-colors placeholder:text-muted/70 focus:border-ink focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "h-11 border-line",
        invalid: "h-11 border-gold-muted",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-[11px] uppercase tracking-label text-muted"
        >
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(inputVariants({ state: error ? "invalid" : "default" }), className)}
        {...props}
      />

      {error ? (
        <p id={messageId} className="text-xs text-gold-muted">
          {error}
        </p>
      ) : null}

      {!error && hint ? (
        <p id={messageId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
