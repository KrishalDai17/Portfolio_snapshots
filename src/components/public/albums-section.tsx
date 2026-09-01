import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Link from "next/link";

export default async function AlbumsSection() {
  const supabase = await createClient();
  const { data: albums } = await supabase
    .from("albums")
    .select("id, title, slug, cover_media:cover_media_id(public_id)")
    .eq("is_published", true)
    .eq("is_hidden", false)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  if (!albums || albums.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950">
      <h2 className="font-serif text-3xl mb-10 text-center">Featured Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {albums.map((a: any) => (
          <Link key={a.id} href={`/albums/${a.slug}`} className="group block">
            <div className="aspect-[4/5] overflow-hidden">
              {a.cover_media?.public_id && (
                <img
                  src={cldImageUrl(a.cover_media.public_id, { width: 800 })}
                  alt={a.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <p className="mt-3 font-serif text-lg">{a.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
