import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import VideoPlayer from "@/components/public/video-player";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = { title: "Films" };

export default async function FilmsPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, description, source_type, external_url, media:media_id(public_id), thumbnail_media:thumbnail_media_id(public_id), category:category_id(name)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Films" }]} />
      <h1 className="font-serif text-4xl text-center mb-12">Films</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {(videos ?? []).map((v: any) => (
          <div key={v.id}>
            <div className="aspect-video bg-neutral-900 overflow-hidden">
              <VideoPlayer
                sourceType={v.source_type}
                publicId={v.media?.public_id}
                externalUrl={v.external_url}
                thumbnailPublicId={v.thumbnail_media?.public_id}
                title={v.title}
              />
            </div>
            <p className="font-serif text-lg mt-3">{v.title}</p>
            {v.category?.name && <p className="text-xs text-neutral-500">{v.category.name}</p>}
            {v.description && <p className="text-sm text-neutral-400 mt-1">{v.description}</p>}
          </div>
        ))}
        {(!videos || videos.length === 0) && (
          <p className="col-span-full text-center text-neutral-500 py-16">No films published yet.</p>
        )}
      </div>
    </main>
  );
}
