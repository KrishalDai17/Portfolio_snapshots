import { createClient } from "@/lib/supabase/server";

export default async function SocialSection() {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("social_links")
    .select("id, platform, label, url")
    .eq("is_enabled", true)
    .contains("placements", ["hero"])
    .order("sort_order", { ascending: true });

  if (!links || links.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 text-center border-t border-neutral-900">
      <div className="flex justify-center gap-6 flex-wrap">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#c9a24b] transition-colors"
          >
            {l.label ?? l.platform}
          </a>
        ))}
      </div>
    </section>
  );
}
