import { createClient } from "@/lib/supabase/server";
import { markInquiryRead, deleteInquiry } from "@/actions/inquiries/manage";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, phone, whatsapp, event_type, event_date, location, budget, message, is_read, created_at")
    .order("created_at", { ascending: false });

  const rows = inquiries ?? [];

  return (
    <div>
      <h1 className="text-xl font-serif mb-2">Inquiries</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {rows.filter((r) => !r.is_read).length} unread of {rows.length} total.
      </p>

      <div className="space-y-3">
        {rows.map((i) => (
          <div key={i.id} className={`border p-4 ${i.is_read ? "border-neutral-800" : "border-[#c9a24b]/50 bg-neutral-950"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  {i.name} {!i.is_read && <span className="ml-2 text-[10px] text-[#c9a24b] uppercase">New</span>}
                </p>
                <p className="text-xs text-neutral-500">
                  {i.email} {i.phone ? `· ${i.phone}` : ""} {i.whatsapp ? `· WhatsApp: ${i.whatsapp}` : ""}
                </p>
              </div>
              <p className="text-xs text-neutral-600 shrink-0">
                {new Date(i.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
              {i.event_type && <span>Event: {i.event_type}</span>}
              {i.event_date && <span>Date: {i.event_date}</span>}
              {i.location && <span>Location: {i.location}</span>}
              {i.budget && <span>Budget: {i.budget}</span>}
            </div>

            {i.message && <p className="mt-2 text-sm text-neutral-300">{i.message}</p>}

            <div className="mt-3 flex gap-3">
              <form action={markInquiryRead.bind(null, i.id, !i.is_read)}>
                <button type="submit" className="text-xs uppercase tracking-wider text-neutral-400 hover:text-[#c9a24b]">
                  Mark {i.is_read ? "unread" : "read"}
                </button>
              </form>
              <form action={deleteInquiry.bind(null, i.id)}>
                <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-neutral-500 py-6 text-center border border-neutral-800">
            No inquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}
