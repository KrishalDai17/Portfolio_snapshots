import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/public/hero-section";
import SelectedWorksSection from "@/components/public/selected-works-section";
import AlbumsSection from "@/components/public/albums-section";
import AboutSection from "@/components/public/about-section";
import ServicesSection from "@/components/public/services-section";
import FilmsSection from "@/components/public/films-section";
import StoriesSection from "@/components/public/stories-section";
import TestimonialsSection from "@/components/public/testimonials-section";
import SocialSection from "@/components/public/social-section";
import ContactSection from "@/components/public/contact-section";

// Maps a homepage_sections.section_key to its renderer. This is the whole
// point of the CMS: admin reorders/enables rows in this table and the
// homepage updates with zero code changes.
const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  hero: HeroSection,
  selected_works: SelectedWorksSection,
  albums: AlbumsSection,
  about: AboutSection,
  services: ServicesSection,
  films: FilmsSection,
  stories: StoriesSection,
  testimonials: TestimonialsSection,
  social: SocialSection,
  contact: ContactSection,
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: sections }, { data: settings }] = await Promise.all([
    supabase
      .from("homepage_sections")
      .select("section_key, is_enabled, sort_order")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("brand_name, tagline, contact_location, contact_email").maybeSingle(),
  ]);

  const orderedSections = sections ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Photographer",
    name: "Himal Shrestha",
    alternateName: settings?.brand_name ?? "DR DSLR",
    description: settings?.tagline ?? "Capturing Moments Beyond Vision",
    ...(settings?.contact_location ? { address: settings.contact_location } : {}),
    ...(settings?.contact_email ? { email: settings.contact_email } : {}),
  };

  return (
    <main>
      {/* Admin-controlled fields only, not user input — safe to serialize directly. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {orderedSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.section_key as string];
        if (!Component) return null;
        return <Component key={section.section_key as string} />;
      })}
    </main>
  );
}
