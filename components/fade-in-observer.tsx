"use client";

import { useEffect } from "react";

export function FadeInObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.fade-in[data-visible="false"]'),
    );
    if (elements.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      for (const element of elements) element.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.dataset.visible = "true";
          observer.unobserve(element);
        }
      },
      { threshold: 0.25 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return null;
}
