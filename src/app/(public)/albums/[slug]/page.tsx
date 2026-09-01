import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import MasonryGallery, { type GalleryPhoto } from "@/components/gallery/masonry-gallery";
import Breadcrumbs from "@/components/public/breadcrumbs";

async function getAlbum(slug: string) {
  const supabase = await createClient();
  const { data: album } = (await supabase
    .from("albums")
    .select(
      "id, title, description, event_date, seo_title, seo_description, cover_media:cover_media_id(public_id), og_image:og_image_id(public_id)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_hidden", false)
    .maybeSingle()) as {
    data: {
      id: string;
      title: string;
      description: string | null;
      event_date: string | null;
      seo_title: string | null;
      seo_description: string | null;
      cover_media: { public_id: string } | null;
      og_image: { public_id: string } | null;
    } | null;
  };
  return album;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return {};

  const ogPublicId = album.og_image?.public_id ?? album.cover_media?.public_id;

  return {
    title: album.seo_title || album.title,
    description: album.seo_description || album.description || undefined,
    openGraph: ogPublicId ? { images: [{ url: cldImageUrl(ogPublicId, { width: 1200, height: 630, crop: "fill" }) }] } : undefined,
  };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();

  const supabase = await createClient();
  const { data: photosData } = await supabase
    .from("photos")
    .select("id, title, caption, alt_text, media:media_id(public_id, width, height)")
    .eq("album_id", album.id)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  const photos: GalleryPhoto[] = (photosData ?? [])
    .map((p: any) => ({
      id: p.id,
      public_id: p.media?.public_id ?? "",
      title: p.title,
      caption: p.caption,
      alt_text: p.alt_text,
      width: p.media?.width ?? null,
      height: p.media?.height ?? null,
    }))
    .filter((p) => p.public_id);

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <div className="text-center mb-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Albums", href: "/albums" }, { label: album.title }]} />
        <h1 className="font-serif text-4xl">{album.title}</h1>
        {album.event_date && <p className="text-sm text-neutral-500 mt-2">{album.event_date}</p>}
        {album.description && <p className="text-neutral-400 max-w-xl mx-auto mt-4">{album.description}</p>}
      </div>

      {photos.length > 0 ? (
        <MasonryGallery photos={photos} />
      ) : (
        <p className="text-center text-neutral-500 py-16">No photos in this album yet.</p>
      )}
    </main>
  );
}
