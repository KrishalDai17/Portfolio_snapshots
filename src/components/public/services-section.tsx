import { createClient } from "@/lib/supabase/server";

export default async function ServicesSection() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, title, slug, description, price_label, show_price")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950">
      <h2 className="font-serif text-3xl mb-10 text-center">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {services.map((s) => (
          <div key={s.id} className="border border-neutral-800 p-6">
            <h3 className="font-serif text-xl mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-400">{s.description}</p>
            {s.show_price && s.price_label && (
              <p className="mt-4 text-[#c9a24b] text-sm">{s.price_label}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
