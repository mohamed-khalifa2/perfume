export type ToastPayload = {
  title: string;
  description?: string;
};

const TOAST_STACK_CLASS =
  "toast-stack fixed right-4 bottom-4 z-60 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2";

function getToastStack(): HTMLDivElement {
  const existing = document.querySelector<HTMLDivElement>(".toast-stack");
  if (existing) return existing;

  const stack = document.createElement("div");
  stack.className = TOAST_STACK_CLASS;
  document.body.appendChild(stack);
  return stack;
}

export function showToast({ title, description }: ToastPayload) {
  if (typeof window === "undefined") return;

  const stack = getToastStack();
  const item = document.createElement("div");
  item.className =
    "toast-item flex items-start gap-3 border border-cream/20 bg-ink px-4 py-3 text-cream shadow-none";
  item.setAttribute("role", "status");
  item.setAttribute("aria-live", "polite");

  const content = document.createElement("div");
  content.className = "min-w-0 flex-1";

  const titleElement = document.createElement("p");
  titleElement.className = "text-[11px] uppercase tracking-label text-cream";
  titleElement.textContent = title;
  content.appendChild(titleElement);

  if (description) {
    const descriptionElement = document.createElement("p");
    descriptionElement.className = "mt-1 text-xs text-cream/70";
    descriptionElement.textContent = description;
    content.appendChild(descriptionElement);
  }

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.setAttribute("aria-label", "Dismiss notification");
  dismiss.className =
    "-mr-1 -mt-1 p-1 text-cream/60 transition-colors hover:text-cream";
  dismiss.textContent = "×";

  let timer = 0;
  const remove = () => {
    window.clearTimeout(timer);
    item.remove();
    if (stack.childElementCount === 0) stack.remove();
  };

  dismiss.addEventListener("click", remove);
  item.append(content, dismiss);
  stack.appendChild(item);
  timer = window.setTimeout(remove, 4000);
}
