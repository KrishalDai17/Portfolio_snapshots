import { createClient } from "@/lib/supabase/server";
import { deleteAlbum, togglePublished, toggleHidden, toggleFeatured } from "@/actions/albums";
import { cldImageUrl } from "@/lib/cloudinary/url";
import CreateAlbumForm from "./create-form";

export default async function AlbumsPage() {
  const supabase = await createClient();

  const [{ data: albums }, { data: categories }, { data: media }] = await Promise.all([
    supabase
      .from("albums")
      .select(
        "id, title, slug, is_published, is_hidden, is_featured, event_date, category:category_id(name), cover_media:cover_media_id(public_id)"
      )
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("media").select("id, public_id, alt_text").eq("resource_type", "image").order("created_at", { ascending: false }).limit(200),
  ]);

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Albums</h1>

      <CreateAlbumForm categories={categories ?? []} mediaOptions={media ?? []} />

      <div className="mt-8 space-y-3">
        {(albums ?? []).map((a: any) => (
          <div key={a.id} className="border border-neutral-800 p-4 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 bg-neutral-900 overflow-hidden rounded-sm">
              {a.cover_media?.public_id && (
                <img
                  src={cldImageUrl(a.cover_media.public_id, { width: 128, height: 128, crop: "fill" })}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{a.title}</p>
              <p className="text-xs text-neutral-500">
                /{a.slug} {a.category?.name ? `· ${a.category.name}` : ""}
              </p>
            </div>

            <form action={togglePublished.bind(null, a.id, !a.is_published)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${
                  a.is_published ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {a.is_published ? "Published" : "Draft"}
              </button>
            </form>
            <form action={toggleHidden.bind(null, a.id, !a.is_hidden)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${
                  a.is_hidden ? "border-neutral-500 text-neutral-500" : "border-neutral-700 text-neutral-400"
                }`}
              >
                {a.is_hidden ? "Hidden" : "Shown"}
              </button>
            </form>
            <form action={toggleFeatured.bind(null, a.id, !a.is_featured)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${
                  a.is_featured ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {a.is_featured ? "Featured" : "Feature"}
              </button>
            </form>
            <form action={deleteAlbum.bind(null, a.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400">
                Delete
              </button>
            </form>
          </div>
        ))}
        {(!albums || albums.length === 0) && (
          <p className="text-sm text-neutral-500 py-6 text-center border border-neutral-800">
            No albums yet — create one above.
          </p>
        )}
      </div>
    </div>
  );
}
