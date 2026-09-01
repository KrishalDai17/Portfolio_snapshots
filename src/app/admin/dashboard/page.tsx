import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();

  const [photos, albums, categories, featuredPhotos, unreadInquiries] = await Promise.all([
    supabase.from("photos").select("id", { count: "exact", head: true }),
    supabase.from("albums").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return {
    photos: photos.count ?? 0,
    albums: albums.count ?? 0,
    categories: categories.count ?? 0,
    featuredPhotos: featuredPhotos.count ?? 0,
    unreadInquiries: unreadInquiries.count ?? 0,
  };
}

export default async function DashboardPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Total Photos", value: counts.photos },
    { label: "Total Albums", value: counts.albums },
    { label: "Categories", value: counts.categories },
    { label: "Featured Photos", value: counts.featuredPhotos },
    { label: "Unread Inquiries", value: counts.unreadInquiries },
  ];

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-neutral-800 bg-neutral-950 p-5">
            <p className="text-2xl font-serif">{c.value}</p>
            <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-500 mt-8">
        Connect your Supabase project (see README) to see live data here. Once
        env vars are set, these counts, recent uploads, and recent inquiries
        pull directly from the database.
      </p>
    </div>
  );
}
