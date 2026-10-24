"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/cn";

export type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  distance = 24,
  duration = 0.7,
  className,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
