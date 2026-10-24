import { requireAdmin } from "@/lib/admin/require-admin";
import { Button } from "@/components/ui/button";

export default async function AdminInquiriesPage() {
  const { supabase } = await requireAdmin();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  async function markRead(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const is_read = formData.get("is_read") === "on";
    await s.from("inquiries").update({ is_read: !is_read }).eq("id", id);
  }

  async function deleteInquiry(formData: FormData) {
    "use server";
    const { supabase: s } = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    await s.from("inquiries").delete().eq("id", id);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-label text-gold">Content</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Inquiries</h1>

      <div className="mt-10 space-y-6">
        {(inquiries ?? []).map((inquiry) => (
          <div
            key={inquiry.id}
            className="border border-line p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-ink">{inquiry.name}</p>
                <p className="mt-1 text-sm text-muted">{inquiry.email}</p>
                {inquiry.phone ? (
                  <p className="text-sm text-muted">{inquiry.phone}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted">
                  {new Date(inquiry.created_at).toLocaleString("en-EG")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={markRead}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <input type="hidden" name="is_read" value={inquiry.is_read ? "on" : ""} />
                  <Button type="submit" variant="ghost" className="text-xs">
                    {inquiry.is_read ? "Mark unread" : "Mark read"}
                  </Button>
                </form>
                <form action={deleteInquiry}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <Button type="submit" variant="ghost" className="text-xs">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {inquiry.message}
            </p>
            {!inquiry.is_read ? (
              <p className="mt-4 text-xs uppercase tracking-label text-gold">
                Unread
              </p>
            ) : null}
          </div>
        ))}
        {(inquiries ?? []).length === 0 ? (
          <p className="py-6 text-sm text-muted">No inquiries yet.</p>
        ) : null}
      </div>
    </div>
  );
}
