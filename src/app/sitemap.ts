import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/albums`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/films`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/stories`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const [{ data: albums }, { data: stories }] = await Promise.all([
    supabase.from("albums").select("slug, updated_at").eq("is_published", true).eq("is_hidden", false),
    supabase.from("stories").select("slug, updated_at").eq("is_published", true),
  ]);

  const albumRoutes: MetadataRoute.Sitemap = (albums ?? []).map((a) => ({
    url: `${base}/albums/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const storyRoutes: MetadataRoute.Sitemap = (stories ?? []).map((s) => ({
    url: `${base}/stories/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...albumRoutes, ...storyRoutes];
}
