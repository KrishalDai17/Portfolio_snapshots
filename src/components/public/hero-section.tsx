import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import HeroSlider from "./hero-slider";

export default async function HeroSection() {
  const supabase = await createClient();

  const { data: slides } = await supabase
    .from("hero_slides")
    .select("id, heading, subtitle, cta_label, cta_url, duration_ms, media_id, media:media_id(public_id, alt_text)")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  const resolvedSlides = (slides ?? []).map((s: any) => ({
    id: s.id as string,
    heading: (s.heading as string | null) ?? "DR DSLR",
    subtitle: (s.subtitle as string | null) ?? "by Himal Shrestha",
    ctaLabel: (s.cta_label as string | null) ?? "Explore Work",
    ctaUrl: (s.cta_url as string | null) ?? "/work",
    durationMs: (s.duration_ms as number | null) ?? 6000,
    imageUrl: s.media?.public_id ? cldImageUrl(s.media.public_id, { width: 1920 }) : null,
    alt: s.media?.alt_text ?? s.heading ?? "DR DSLR photography",
  }));

  // Fallback slide so the hero never renders empty before the admin adds
  // slides through the CMS.
  const fallback = [
    {
      id: "fallback",
      heading: "DR DSLR",
      subtitle: "by Himal Shrestha — Capturing Moments Beyond Vision",
      ctaLabel: "Explore Work",
      ctaUrl: "/work",
      durationMs: 6000,
      imageUrl: null,
      alt: "DR DSLR photography",
    },
  ];

  return <HeroSlider slides={resolvedSlides.length ? resolvedSlides : fallback} />;
}
