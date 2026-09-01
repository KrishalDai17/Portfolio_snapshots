import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MasonryGallery, { type GalleryPhoto } from "@/components/gallery/masonry-gallery";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = {
  title: "Work",
  description: "Photography portfolio by Himal Shrestha — DR DSLR.",
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, photosQuery] = await Promise.all([
    supabase.from("categories").select("id, name, slug").eq("is_visible", true).order("sort_order", { ascending: true }),
    (async () => {
      let query = supabase
        .from("photos")
        .select("id, title, caption, alt_text, sort_order, category:category_id(slug), media:media_id(public_id, width, height)")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      const { data } = await query;
      return data ?? [];
    })(),
  ]);

  const filtered = category
    ? photosQuery.filter((p: any) => p.category?.slug === category)
    : photosQuery;

  const photos: GalleryPhoto[] = filtered.map((p: any) => ({
    id: p.id,
    public_id: p.media?.public_id ?? "",
    title: p.title,
    caption: p.caption,
    alt_text: p.alt_text,
    width: p.media?.width ?? null,
    height: p.media?.height ?? null,
  })).filter((p) => p.public_id);

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
      <h1 className="font-serif text-4xl text-center mb-8">Work</h1>

      <div className="flex justify-center gap-2 flex-wrap mb-10">
        <a
          href="/work"
          className={`text-xs uppercase tracking-wider px-4 py-2 border rounded-sm ${!category ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-800 text-neutral-400"}`}
        >
          All
        </a>
        {(categories ?? []).map((c) => (
          <a
            key={c.id}
            href={`/work?category=${c.slug}`}
            className={`text-xs uppercase tracking-wider px-4 py-2 border rounded-sm ${category === c.slug ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-800 text-neutral-400"}`}
          >
            {c.name}
          </a>
        ))}
      </div>

      {photos.length > 0 ? (
        <MasonryGallery photos={photos} />
      ) : (
        <p className="text-center text-neutral-500 py-16">No photos in this category yet.</p>
      )}
    </main>
  );
}
