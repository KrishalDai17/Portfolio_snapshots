import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";

export default async function FilmsSection() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, thumbnail_media:thumbnail_media_id(public_id)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(4);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12">
      <h2 className="font-serif text-3xl mb-10 text-center">Featured Films</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((v: any) => (
          <div key={v.id} className="aspect-video bg-neutral-900 overflow-hidden relative">
            {v.thumbnail_media?.public_id && (
              <img
                src={cldImageUrl(v.thumbnail_media.public_id, { width: 800 })}
                alt={v.title}
                className="h-full w-full object-cover"
              />
            )}
            <p className="absolute bottom-3 left-3 font-serif">{v.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
