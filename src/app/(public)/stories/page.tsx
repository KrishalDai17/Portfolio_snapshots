import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = { title: "Stories" };

export default async function StoriesIndexPage() {
  const supabase = await createClient();
  const { data: stories } = await supabase
    .from("stories")
    .select("id, title, slug, intro, story_date, cover_media:cover_media_id(public_id)")
    .eq("is_published", true)
    .order("story_date", { ascending: false });

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stories" }]} />
      <h1 className="font-serif text-4xl text-center mb-12">Photography Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {(stories ?? []).map((s: any) => (
          <Link key={s.id} href={`/stories/${s.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-3">
              {s.cover_media?.public_id && (
                <img
                  src={cldImageUrl(s.cover_media.public_id, { width: 700 })}
                  alt={s.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <h2 className="font-serif text-lg">{s.title}</h2>
            {s.story_date && <p className="text-xs text-neutral-500">{s.story_date}</p>}
            {s.intro && <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{s.intro}</p>}
          </Link>
        ))}
        {(!stories || stories.length === 0) && (
          <p className="col-span-full text-center text-neutral-500 py-16">No stories published yet.</p>
        )}
      </div>
    </main>
  );
}
