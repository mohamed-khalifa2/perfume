"use client";

import { useEffect } from "react";

const FADE_SELECTOR = '.fade-in[data-visible="false"]';

export function FadeInObserver() {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const supported = typeof IntersectionObserver !== "undefined";

    const observer = supported
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const element = entry.target as HTMLElement;
              element.dataset.visible = "true";
              observer?.unobserve(element);
            }
          },
          { threshold: 0.25 },
        )
      : null;

    const watch = (element: HTMLElement) => {
      if (observed.has(element)) return;
      observed.add(element);

      if (observer) {
        observer.observe(element);
      } else {
        element.dataset.visible = "true";
      }
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(FADE_SELECTOR)) {
        watch(root);
      }
      for (const element of root.querySelectorAll<HTMLElement>(FADE_SELECTOR)) {
        watch(element);
      }
    };

    scan(document);

    // Client navigation replaces page content after this effect has already run.
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          scan(node);
        }
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
