import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

export const selectVariants = cva(
  "w-full appearance-none border bg-transparent px-4 pr-10 text-sm text-ink transition-colors focus:border-ink focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
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

export type SelectProps = React.ComponentProps<"select"> & {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, error, placeholder, id, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-[11px] uppercase tracking-label text-muted"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            selectVariants({ state: error ? "invalid" : "default" }),
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>

        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>

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
