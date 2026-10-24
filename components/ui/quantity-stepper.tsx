"use client";

import { cva } from "class-variance-authority";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";

const stepperVariants = cva(
  "inline-flex items-center border border-line bg-transparent",
  {
    variants: {
      size: {
        sm: "h-9",
        md: "h-11",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
  className,
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  const buttonClass =
    "flex h-full w-10 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:bg-transparent disabled:hover:text-muted/40";

  return (
    <div className={cn(stepperVariants({ size }), className)}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={buttonClass}
      >
        <Minus className="size-3.5" aria-hidden />
      </button>

      <span
        className="min-w-8 text-center text-sm tabular-nums text-ink"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={buttonClass}
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
