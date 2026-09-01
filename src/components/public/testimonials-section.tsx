import { createClient } from "@/lib/supabase/server";

export default async function TestimonialsSection() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, client_name, review, event_type")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12">
      <h2 className="font-serif text-3xl mb-10 text-center">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
        {testimonials.map((t) => (
          <div key={t.id}>
            <p className="text-neutral-300 italic leading-relaxed">&ldquo;{t.review}&rdquo;</p>
            <p className="mt-4 text-sm uppercase tracking-wider text-[#c9a24b]">{t.client_name}</p>
            {t.event_type && <p className="text-xs text-neutral-500">{t.event_type}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
