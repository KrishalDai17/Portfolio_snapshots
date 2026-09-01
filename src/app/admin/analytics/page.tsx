import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [
    photosTotal,
    albumsPublished,
    albumsDraft,
    inquiriesByMonth,
    topCategories,
    featuredCount,
  ] = await Promise.all([
    supabase.from("photos").select("id", { count: "exact", head: true }),
    supabase.from("albums").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("albums").select("id", { count: "exact", head: true }).eq("is_published", false),
    supabase.from("inquiries").select("created_at").order("created_at", { ascending: false }).limit(200),
    supabase
      .from("categories")
      .select("id, name, photos:photos(count)")
      .order("sort_order", { ascending: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }).eq("is_featured", true),
  ]);

  const inquiriesThisMonth = (inquiriesByMonth.data ?? []).filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const cards = [
    { label: "Total Photos", value: photosTotal.count ?? 0 },
    { label: "Featured Photos", value: featuredCount.count ?? 0 },
    { label: "Published Albums", value: albumsPublished.count ?? 0 },
    { label: "Draft Albums", value: albumsDraft.count ?? 0 },
    { label: "Inquiries This Month", value: inquiriesThisMonth },
    { label: "Inquiries (all time, last 200)", value: (inquiriesByMonth.data ?? []).length },
  ];

  return (
    <div>
      <h1 className="text-xl font-serif mb-2">Analytics</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Content and inquiry stats from your database. Visitor traffic (page views, sources,
        devices, countries) is tracked by Vercel Analytics — view it in your Vercel project
        dashboard under the Analytics tab once deployed.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-2xl font-serif">{c.value}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm uppercase tracking-wider text-neutral-500 mb-3">Photos per Category</h2>
      <div className="border border-neutral-800 divide-y divide-neutral-800">
        {(topCategories.data ?? []).map((c: any) => (
          <div key={c.id} className="p-3 flex items-center justify-between text-sm">
            <span>{c.name}</span>
            <span className="text-neutral-500">{c.photos?.[0]?.count ?? 0}</span>
          </div>
        ))}
        {(!topCategories.data || topCategories.data.length === 0) && (
          <p className="p-4 text-sm text-neutral-500">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
