import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Breadcrumbs from "@/components/public/breadcrumbs";

async function getStory(slug: string) {
  const supabase = await createClient();
  const { data: story } = (await supabase
    .from("stories")
    .select(
      "id, title, intro, content_richtext, location, story_date, tags, seo_title, seo_description, cover_media:cover_media_id(public_id)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle()) as {
    data: {
      id: string;
      title: string;
      intro: string | null;
      content_richtext: string | null;
      location: string | null;
      story_date: string | null;
      tags: string[];
      seo_title: string | null;
      seo_description: string | null;
      cover_media: { public_id: string } | null;
    } | null;
  };
  return story;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};
  return {
    title: story.seo_title || story.title,
    description: story.seo_description || story.intro || undefined,
    openGraph: story.cover_media?.public_id
      ? { images: [{ url: cldImageUrl(story.cover_media.public_id, { width: 1200, height: 630, crop: "fill" }) }] }
      : undefined,
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const cover = story.cover_media?.public_id;

  return (
    <main className="pt-32 pb-24 px-6">
      <article className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stories", href: "/stories" }, { label: story.title }]} />
          <h1 className="font-serif text-4xl leading-tight">{story.title}</h1>
          <p className="text-xs text-neutral-500 mt-3 uppercase tracking-wider">
            {story.story_date} {story.location ? `· ${story.location}` : ""}
          </p>
          {story.intro && <p className="text-neutral-400 mt-4">{story.intro}</p>}
        </header>

        {cover && (
          <div className="aspect-[16/9] overflow-hidden mb-10 -mx-6 md:mx-0">
            <img src={cldImageUrl(cover, { width: 1400 })} alt={story.title} className="h-full w-full object-cover" />
          </div>
        )}

        {story.content_richtext && (
          // Admin-authored HTML — the only writer is the single verified
          // admin (enforced by RLS), so this isn't public user content.
          <div
            className="prose prose-invert prose-p:text-neutral-300 prose-headings:font-serif max-w-none"
            dangerouslySetInnerHTML={{ __html: story.content_richtext }}
          />
        )}

        {story.tags && story.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-10">
            {story.tags.map((t: string) => (
              <span key={t} className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-800 px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
