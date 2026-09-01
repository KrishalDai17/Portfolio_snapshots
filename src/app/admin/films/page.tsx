import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import { deleteVideo, togglePublished, toggleFeatured } from "@/actions/films";
import CreateVideoForm from "./create-form";

export default async function FilmsPage() {
  const supabase = await createClient();

  const [{ data: videos }, { data: categories }, { data: media }] = await Promise.all([
    supabase
      .from("videos")
      .select("id, title, source_type, is_published, is_featured, thumbnail_media:thumbnail_media_id(public_id), category:category_id(name)")
      .order("sort_order", { ascending: true }),
    supabase.from("video_categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("media").select("id, public_id, alt_text, resource_type").order("created_at", { ascending: false }).limit(300),
  ]);

  const videoMedia = (media ?? []).filter((m) => m.resource_type === "video");
  const imageMedia = (media ?? []).filter((m) => m.resource_type === "image");

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Films</h1>

      <CreateVideoForm categories={categories ?? []} videoMedia={videoMedia} imageMedia={imageMedia} />

      <div className="mt-8 space-y-3">
        {(videos ?? []).map((v: any) => (
          <div key={v.id} className="border border-neutral-800 p-4 flex items-center gap-4">
            <div className="w-20 h-12 shrink-0 bg-neutral-900 overflow-hidden rounded-sm">
              {v.thumbnail_media?.public_id && (
                <img src={cldImageUrl(v.thumbnail_media.public_id, { width: 160, height: 96, crop: "fill" })} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{v.title}</p>
              <p className="text-xs text-neutral-500">
                {v.source_type} {v.category?.name ? `· ${v.category.name}` : ""}
              </p>
            </div>
            <form action={togglePublished.bind(null, v.id, !v.is_published)}>
              <button type="submit" className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${v.is_published ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"}`}>
                {v.is_published ? "Published" : "Draft"}
              </button>
            </form>
            <form action={toggleFeatured.bind(null, v.id, !v.is_featured)}>
              <button type="submit" className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${v.is_featured ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"}`}>
                {v.is_featured ? "Featured" : "Feature"}
              </button>
            </form>
            <form action={deleteVideo.bind(null, v.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400">Delete</button>
            </form>
          </div>
        ))}
        {(!videos || videos.length === 0) && (
          <p className="text-sm text-neutral-500 py-6 text-center border border-neutral-800">No films yet — add one above.</p>
        )}
      </div>
    </div>
  );
}
