import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans uppercase tracking-label transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-ink text-cream hover:bg-ink-900",
        outline: "border border-ink text-ink hover:bg-ink hover:text-cream",
        ghost: "text-ink hover:bg-ink/5",
        link: "text-ink underline decoration-line underline-offset-4 hover:decoration-ink",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-6 text-xs",
        lg: "h-14 px-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

const linkSizes: Record<ButtonSize, string> = {
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
};

export type ButtonProps = Omit<
  React.ComponentProps<"button">,
  "variant" | "size"
> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant = "solid",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isLink = variant === "link";

  return (
    <button
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size: isLink ? undefined : size }),
        isLink && "h-auto px-0 py-0",
        isLink && linkSizes[size ?? "md"],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
