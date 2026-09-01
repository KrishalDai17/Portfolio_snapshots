import { createClient } from "@/lib/supabase/server";
import { deleteTestimonial, togglePublished } from "@/actions/testimonials";
import CreateTestimonialForm from "./create-form";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, client_name, review, rating, event_type, is_published")
    .order("sort_order", { ascending: true });

  const rows = testimonials ?? [];

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Testimonials</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Admin-only — visitors cannot submit testimonials themselves.
      </p>

      <CreateTestimonialForm />

      <div className="mt-8 border border-neutral-800 divide-y divide-neutral-800">
        {rows.map((t) => (
          <div key={t.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm">{t.client_name} {t.rating ? `· ${"★".repeat(t.rating)}` : ""}</p>
              <p className="text-xs text-neutral-500 truncate">{t.review}</p>
            </div>
            <form action={togglePublished.bind(null, t.id, !t.is_published)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm shrink-0 ${
                  t.is_published ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {t.is_published ? "Published" : "Draft"}
              </button>
            </form>
            <form action={deleteTestimonial.bind(null, t.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400 shrink-0">
                Delete
              </button>
            </form>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-sm text-neutral-500">No testimonials yet.</p>}
      </div>
    </div>
  );
}
