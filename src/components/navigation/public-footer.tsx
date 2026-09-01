import { createClient } from "@/lib/supabase/server";

export default async function PublicFooter() {
  const supabase = await createClient();
  const [{ data: settings }, { data: links }] = await Promise.all([
    supabase.from("site_settings").select("brand_name, tagline, contact_email, contact_location").maybeSingle(),
    supabase
      .from("social_links")
      .select("id, platform, label, url")
      .eq("is_enabled", true)
      .contains("placements", ["footer"])
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <footer className="border-t border-neutral-900 px-6 md:px-12 py-12 text-center">
      <p className="font-serif text-lg">{settings?.brand_name ?? "DR DSLR"}</p>
      <p className="text-xs text-neutral-500 mt-1">{settings?.tagline}</p>

      {(links ?? []).length > 0 && (
        <div className="flex justify-center gap-5 mt-6 flex-wrap">
          {links!.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-neutral-500 hover:text-[#c9a24b]"
            >
              {l.label ?? l.platform}
            </a>
          ))}
        </div>
      )}

      <p className="text-[10px] text-neutral-700 mt-8">
        © {new Date().getFullYear()} {settings?.brand_name ?? "DR DSLR"}
        {settings?.contact_location ? ` · ${settings.contact_location}` : ""}
      </p>
    </footer>
  );
}
