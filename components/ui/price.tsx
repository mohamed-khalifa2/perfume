import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatEgp(amount: number) {
  return `EGP ${numberFormatter.format(amount)}`;
}

const priceVariants = cva("inline-flex items-baseline gap-2", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type PriceProps = {
  amount: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  prefix?: string;
  className?: string;
};

export function Price({
  amount,
  compareAt,
  size = "md",
  prefix,
  className,
}: PriceProps) {
  const showCompareAt =
    typeof compareAt === "number" && compareAt > 0 && compareAt > amount;

  return (
    <span className={cn(priceVariants({ size }), className)}>
      {prefix ? <span className="text-muted">{prefix}</span> : null}
      <span className="text-ink">{formatEgp(amount)}</span>
      {showCompareAt ? (
        <span className="text-muted line-through">{formatEgp(compareAt)}</span>
      ) : null}
    </span>
  );
}
