import { createClient } from "@/lib/supabase/server";
import CreateHeroSlideForm from "./create-hero-slide-form";
import SectionsList from "./sections-list";
import HeroSlidesList from "./hero-slides-list";

export default async function HomepageCmsPage() {
  const supabase = await createClient();

  const [{ data: sections }, { data: slides }, { data: media }] = await Promise.all([
    supabase.from("homepage_sections").select("id, section_key, is_enabled, sort_order").order("sort_order", { ascending: true }),
    supabase
      .from("hero_slides")
      .select("id, heading, subtitle, is_enabled, duration_ms, media:media_id(public_id, secure_url)")
      .order("sort_order", { ascending: true }),
    supabase.from("media").select("id, public_id, alt_text").eq("folder", "dr-dslr/hero").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-xl font-serif mb-2">Homepage Sections</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Drag ⠿ to reorder. Changes reflect on the public site immediately.
        </p>
        <SectionsList sections={sections ?? []} />
      </div>

      <div>
        <h2 className="text-xl font-serif mb-2">Hero Slides</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Upload hero images to the &ldquo;Hero&rdquo; folder in the Media Library first, then add slides here. Drag ⠿ to reorder.
        </p>
        <CreateHeroSlideForm mediaOptions={media ?? []} />
        <div className="mt-6">
          <HeroSlidesList slides={(slides ?? []) as any} />
        </div>
      </div>
    </div>
  );
}
