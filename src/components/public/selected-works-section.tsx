import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Link from "next/link";

export default async function SelectedWorksSection() {
  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("id, title, alt_text, media:media_id(public_id)")
    .eq("is_featured", true)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .limit(8);

  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12">
      <h2 className="font-serif text-3xl mb-10 text-center">Selected Works</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((p: any) => (
          <Link key={p.id} href="/work" data-cursor="VIEW" className="block aspect-[3/4] overflow-hidden group">
            {p.media?.public_id && (
              <img
                src={cldImageUrl(p.media.public_id, { width: 600, height: 800, crop: "fill" })}
                alt={p.alt_text ?? p.title ?? "Photograph"}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
