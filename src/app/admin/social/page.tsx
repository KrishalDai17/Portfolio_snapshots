import { createClient } from "@/lib/supabase/server";
import { deleteSocialLink, toggleSocialLinkEnabled } from "@/actions/social";
import CreateSocialLinkForm from "./create-form";

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("social_links")
    .select("id, platform, label, url, is_enabled, placements")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Social Media</h1>

      <CreateSocialLinkForm />

      <div className="mt-8 border border-neutral-800 divide-y divide-neutral-800">
        {(links ?? []).map((l) => (
          <div key={l.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm">{l.label || l.platform}</p>
              <p className="text-xs text-neutral-500 truncate">{l.url}</p>
              <p className="text-[10px] text-neutral-600">{l.placements.join(", ")}</p>
            </div>
            <form action={toggleSocialLinkEnabled.bind(null, l.id, !l.is_enabled)}>
              <button type="submit" className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm shrink-0 ${l.is_enabled ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"}`}>
                {l.is_enabled ? "Enabled" : "Disabled"}
              </button>
            </form>
            <form action={deleteSocialLink.bind(null, l.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400 shrink-0">Delete</button>
            </form>
          </div>
        ))}
        {(!links || links.length === 0) && <p className="p-6 text-sm text-neutral-500">No social links yet — add one above.</p>}
      </div>
    </div>
  );
}
