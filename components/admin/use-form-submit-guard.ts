"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Holds a form submit until any in-flight image optimization has finished, so
 * a fast click on "Save" never posts the original, unoptimized bytes.
 */
export function useFormSubmitGuard() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingRef = useRef(0);
  const queuedRef = useRef<{
    form: HTMLFormElement;
    submitter: HTMLElement | null;
  } | null>(null);

  const registerInput = useCallback((input: HTMLInputElement | null) => {
    if (input?.form) formRef.current = input.form;
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmit = (event: SubmitEvent) => {
      if (pendingRef.current === 0) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      queuedRef.current = {
        form,
        submitter: event.submitter as HTMLElement | null,
      };
    };

    form.addEventListener("submit", handleSubmit, true);
    return () => form.removeEventListener("submit", handleSubmit, true);
  }, []);

  const runWhileGuarding = useCallback(
    async <T,>(task: () => Promise<T>): Promise<T> => {
      pendingRef.current += 1;

      try {
        return await task();
      } finally {
        pendingRef.current -= 1;

        if (pendingRef.current === 0 && queuedRef.current) {
          const { form, submitter } = queuedRef.current;
          queuedRef.current = null;

          if (form.isConnected) {
            form.requestSubmit(submitter ?? undefined);
          }
        }
      }
    },
    [],
  );

  return { registerInput, runWhileGuarding };
}
