import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Link from "next/link";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, title, description, price_label, show_price, cta_label, cta_url, media:media_id(public_id)")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <h1 className="font-serif text-4xl text-center mb-12">Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {(services ?? []).map((s: any) => (
          <div key={s.id} className="border border-neutral-800">
            <div className="aspect-[4/3] bg-neutral-900 overflow-hidden">
              {s.media?.public_id && (
                <img src={cldImageUrl(s.media.public_id, { width: 700 })} alt={s.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-6">
              <h2 className="font-serif text-xl mb-2">{s.title}</h2>
              <p className="text-sm text-neutral-400">{s.description}</p>
              {s.show_price && s.price_label && <p className="text-sm text-[#c9a24b] mt-3">{s.price_label}</p>}
              <Link
                href={s.cta_url || "/contact"}
                className="inline-block mt-4 text-xs uppercase tracking-wider text-[#c9a24b] border-b border-[#c9a24b] pb-1"
              >
                {s.cta_label || "Request a Quote"}
              </Link>
            </div>
          </div>
        ))}
        {(!services || services.length === 0) && (
          <p className="col-span-full text-center text-neutral-500 py-16">No services listed yet.</p>
        )}
      </div>
    </main>
  );
}
