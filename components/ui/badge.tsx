import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap font-sans uppercase tracking-label leading-none",
  {
    variants: {
      variant: {
        solid: "bg-ink text-cream",
        gold: "bg-gold text-ink",
        outline: "border border-ink text-ink",
        soft: "bg-cream-deep text-ink",
        muted: "bg-ink/5 text-muted",
      },
      size: {
        sm: "px-2 py-1 text-[10px]",
        md: "px-3 py-1.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
