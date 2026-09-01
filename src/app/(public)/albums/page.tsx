import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = { title: "Albums" };

export default async function AlbumsIndexPage() {
  const supabase = await createClient();
  const { data: albums } = await supabase
    .from("albums")
    .select("id, title, slug, event_date, cover_media:cover_media_id(public_id)")
    .eq("is_published", true)
    .eq("is_hidden", false)
    .order("sort_order", { ascending: true });

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Albums" }]} />
      <h1 className="font-serif text-4xl text-center mb-12">Albums</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {(albums ?? []).map((a: any) => (
          <Link key={a.id} href={`/albums/${a.slug}`} data-cursor="OPEN" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
              {a.cover_media?.public_id && (
                <img
                  src={cldImageUrl(a.cover_media.public_id, { width: 800 })}
                  alt={a.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <p className="mt-3 font-serif text-lg">{a.title}</p>
            {a.event_date && <p className="text-xs text-neutral-500">{a.event_date}</p>}
          </Link>
        ))}
        {(!albums || albums.length === 0) && (
          <p className="col-span-full text-center text-neutral-500 py-16">No albums published yet.</p>
        )}
      </div>
    </main>
  );
}
