import { cva } from "class-variance-authority";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

export const textareaVariants = cva(
  "w-full resize-y border bg-transparent px-4 py-3 text-sm leading-relaxed text-ink transition-colors placeholder:text-muted/70 focus:border-ink focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        default: "min-h-32 border-line",
        invalid: "min-h-32 border-gold-muted",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, label, hint, error, id, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    return (
      <div className="flex w-full flex-col gap-2">
        {label ? (
          <label
            htmlFor={textareaId}
            className="text-[11px] uppercase tracking-label text-muted"
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            textareaVariants({ state: error ? "invalid" : "default" }),
            className,
          )}
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
  },
);
