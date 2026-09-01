import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import { deleteStory, togglePublished } from "@/actions/stories";
import CreateStoryForm from "./create-form";

export default async function StoriesPage() {
  const supabase = await createClient();
  const [{ data: stories }, { data: media }] = await Promise.all([
    supabase
      .from("stories")
      .select("id, title, slug, intro, is_published, cover_media:cover_media_id(public_id)")
      .order("story_date", { ascending: false }),
    supabase.from("media").select("id, public_id, alt_text").eq("folder", "dr-dslr/stories").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Stories / Journal</h1>

      <CreateStoryForm mediaOptions={media ?? []} />

      <div className="mt-8 space-y-3">
        {(stories ?? []).map((s: any) => (
          <div key={s.id} className="border border-neutral-800 p-4 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 bg-neutral-900 overflow-hidden rounded-sm">
              {s.cover_media?.public_id && (
                <img src={cldImageUrl(s.cover_media.public_id, { width: 128, height: 128, crop: "fill" })} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{s.title}</p>
              <p className="text-xs text-neutral-500 truncate">/{s.slug}</p>
            </div>
            <form action={togglePublished.bind(null, s.id, !s.is_published)}>
              <button type="submit" className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${s.is_published ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"}`}>
                {s.is_published ? "Published" : "Draft"}
              </button>
            </form>
            <form action={deleteStory.bind(null, s.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400">Delete</button>
            </form>
          </div>
        ))}
        {(!stories || stories.length === 0) && (
          <p className="text-sm text-neutral-500 py-6 text-center border border-neutral-800">No stories yet — add one above.</p>
        )}
      </div>
    </div>
  );
}
