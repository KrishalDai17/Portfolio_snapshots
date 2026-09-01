import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Link from "next/link";

export default async function StoriesSection() {
  const supabase = await createClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("id, title, slug, intro, cover_media:cover_media_id(public_id)")
    .eq("is_published", true)
    .order("story_date", { ascending: false })
    .limit(3);

  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 bg-neutral-950">
      <h2 className="font-serif text-3xl mb-10 text-center">Photography Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stories.map((s: any) => (
          <Link key={s.id} href={`/stories/${s.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden mb-3">
              {s.cover_media?.public_id && (
                <img
                  src={cldImageUrl(s.cover_media.public_id, { width: 600 })}
                  alt={s.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <h3 className="font-serif text-lg">{s.title}</h3>
            <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{s.intro}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
