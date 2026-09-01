import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import { deletePhoto, togglePhotoFeatured, togglePhotoVisible } from "@/actions/photos";
import CreatePhotoForm from "./create-form";

export default async function PhotosPage() {
  const supabase = await createClient();

  const [{ data: photos }, { data: categories }, { data: albums }, { data: media }] = await Promise.all([
    supabase
      .from("photos")
      .select(
        "id, title, is_featured, is_visible, media:media_id(public_id), category:category_id(name), album:album_id(title)"
      )
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("albums").select("id, title").order("sort_order", { ascending: true }),
    supabase
      .from("media")
      .select("id, public_id, alt_text")
      .eq("resource_type", "image")
      .order("created_at", { ascending: false })
      .limit(300),
  ]);

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Photos</h1>

      <CreatePhotoForm categories={categories ?? []} albums={albums ?? []} mediaOptions={media ?? []} />

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {(photos ?? []).map((p: any) => (
          <div key={p.id} className="border border-neutral-800 rounded-sm overflow-hidden">
            <div className="aspect-square bg-neutral-900">
              {p.media?.public_id && (
                <img
                  src={cldImageUrl(p.media.public_id, { width: 300, height: 300, crop: "fill" })}
                  alt={p.title ?? ""}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs truncate">{p.title || "Untitled"}</p>
              <p className="text-[10px] text-neutral-500 truncate">
                {p.category?.name ?? "—"} {p.album?.title ? `· ${p.album.title}` : ""}
              </p>
              <div className="flex gap-1 flex-wrap">
                <form action={togglePhotoFeatured.bind(null, p.id, !p.is_featured)}>
                  <button
                    type="submit"
                    className={`text-[10px] uppercase px-1.5 py-0.5 border rounded-sm ${
                      p.is_featured ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                    }`}
                  >
                    Featured
                  </button>
                </form>
                <form action={togglePhotoVisible.bind(null, p.id, !p.is_visible)}>
                  <button
                    type="submit"
                    className={`text-[10px] uppercase px-1.5 py-0.5 border rounded-sm ${
                      p.is_visible ? "border-neutral-700 text-neutral-400" : "border-neutral-700 text-neutral-600"
                    }`}
                  >
                    {p.is_visible ? "Visible" : "Hidden"}
                  </button>
                </form>
                <form action={deletePhoto.bind(null, p.id)}>
                  <button type="submit" className="text-[10px] uppercase text-neutral-500 hover:text-red-400">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {(!photos || photos.length === 0) && (
          <p className="col-span-full text-sm text-neutral-500 py-6 text-center border border-neutral-800">
            No photos yet — upload to the Media Library, then attach one above.
          </p>
        )}
      </div>
    </div>
  );
}
