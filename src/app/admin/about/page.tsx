import { createClient } from "@/lib/supabase/server";
import { deleteAboutItem } from "@/actions/about";
import ProfileForm from "./profile-form";
import CreateItemForm from "./create-item-form";

const SECTIONS = [
  { key: "journey", label: "Journey" },
  { key: "experience", label: "Experience" },
  { key: "skill", label: "Skills" },
  { key: "equipment", label: "Equipment" },
  { key: "award", label: "Awards" },
  { key: "achievement", label: "Achievements" },
] as const;

export default async function AboutAdminPage() {
  const supabase = await createClient();

  const [profileResult, { data: items }, { data: media }] = await Promise.all([
    supabase.from("about_profile").select("intro, profile_media_id").maybeSingle(),
    supabase.from("about_items").select("id, section, title, subtitle, description, is_demo").order("sort_order", { ascending: true }),
    supabase.from("media").select("id, public_id, alt_text").eq("resource_type", "image").order("created_at", { ascending: false }).limit(200),
  ]);

  const profile = profileResult.data as { intro: string | null; profile_media_id: string | null } | null;
  const mediaOptions = media ?? [];
  const grouped = (items ?? []).reduce<Record<string, typeof items>>((acc, item: any) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section]!.push(item);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-xl font-serif mb-6">About Profile</h1>
        <ProfileForm intro={profile?.intro ?? ""} profileMediaId={profile?.profile_media_id ?? null} mediaOptions={mediaOptions} />
      </div>

      {SECTIONS.map(({ key, label }) => (
        <div key={key}>
          <h2 className="text-lg font-serif mb-4">{label}</h2>
          <CreateItemForm section={key} mediaOptions={mediaOptions} />
          <div className="mt-4 border border-neutral-800 divide-y divide-neutral-800">
            {(grouped[key] ?? []).map((item: any) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {item.title}
                    {item.is_demo && <span className="ml-2 text-[10px] uppercase text-neutral-600">Demo</span>}
                  </p>
                  {item.subtitle && <p className="text-xs text-neutral-500">{item.subtitle}</p>}
                </div>
                <form action={deleteAboutItem.bind(null, item.id)}>
                  <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400">
                    Delete
                  </button>
                </form>
              </div>
            ))}
            {(!grouped[key] || grouped[key].length === 0) && (
              <p className="p-4 text-sm text-neutral-500">Nothing here yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
