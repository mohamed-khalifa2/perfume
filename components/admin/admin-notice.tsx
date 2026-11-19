import { Check, TriangleAlert } from "lucide-react";

type AdminNoticeProps = {
  error?: string;
  saved?: boolean;
  savedMessage?: string;
};

export function AdminNotice({
  error,
  saved,
  savedMessage = "Changes saved.",
}: AdminNoticeProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="mt-6 flex items-start gap-3 border border-gold-muted/60 bg-gold/10 px-4 py-3 text-sm text-ink"
      >
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold-on-light" aria-hidden />
        <p>{error}</p>
      </div>
    );
  }

  if (saved) {
    return (
      <div
        role="status"
        className="mt-6 flex items-start gap-3 border border-line bg-cream-deep/60 px-4 py-3 text-sm text-ink"
      >
        <Check className="mt-0.5 size-4 shrink-0 text-gold-on-light" aria-hidden />
        <p>{savedMessage}</p>
      </div>
    );
  }

  return null;
}
