import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/public/breadcrumbs";

export const metadata: Metadata = { title: "About" };

const SECTION_LABELS: Record<string, string> = {
  journey: "Journey",
  experience: "Experience",
  skill: "Skills",
  equipment: "Equipment",
  award: "Awards",
  achievement: "Achievements",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const [profileResult, { data: items }] = await Promise.all([
    supabase.from("about_profile").select("intro, profile_media:profile_media_id(public_id, secure_url)").maybeSingle(),
    supabase.from("about_items").select("id, section, title, subtitle, description, is_demo").order("sort_order", { ascending: true }),
  ]);

const profile = profileResult.data as {
  intro: string | null;
  profile_media: {
    public_id: string;
    secure_url: string | null;
  } | null;
} | null;

  const grouped = (items ?? []).reduce<Record<string, typeof items>>((acc, item: any) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section]!.push(item);
    return acc;
  }, {} as any);

  return (
    <main className="pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
            {profile?.profile_media?.secure_url && (
  <img
    src={profile.profile_media.secure_url}
    alt="Himal Shrestha"
    className="h-full w-full object-cover"
  />
)}
          </div>
          <div>
            <h1 className="font-serif text-4xl mb-4">About Himal</h1>
            <p className="text-neutral-300 leading-relaxed">{profile?.intro ?? "Introduction coming soon."}</p>
          </div>
        </div>

        {Object.entries(SECTION_LABELS).map(([key, label]) => {
          const sectionItems = grouped[key];
          if (!sectionItems || sectionItems.length === 0) return null;
          return (
            <section key={key} className="mb-12">
              <h2 className="font-serif text-2xl mb-4">{label}</h2>
              <div className="space-y-3">
                {sectionItems.map((item: any) => (
                  <div key={item.id} className="border-b border-neutral-900 pb-3">
                    <p className="text-sm">
                      {item.title}
                      {item.is_demo && <span className="ml-2 text-[10px] uppercase text-neutral-600">Demo content</span>}
                    </p>
                    {item.subtitle && <p className="text-xs text-neutral-500">{item.subtitle}</p>}
                    {item.description && <p className="text-sm text-neutral-400 mt-1">{item.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
