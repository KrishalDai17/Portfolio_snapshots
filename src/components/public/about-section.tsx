import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import Link from "next/link";

export default async function AboutSection() {
  const supabase = await createClient();
  const { data: profile } = (await supabase
    .from("about_profile")
    .select("intro, profile_media:profile_media_id(public_id)")
    .maybeSingle()) as { data: { intro: string | null; profile_media: { public_id: string } | null } | null };

  return (
    <section className="py-24 px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
      <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
        {(profile as any)?.profile_media?.public_id && (
          <img
            src={cldImageUrl((profile as any).profile_media.public_id, { width: 800 })}
            alt="Himal Shrestha"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div>
        <h2 className="font-serif text-3xl mb-4">About Himal</h2>
        <p className="text-neutral-300 leading-relaxed">
          {profile?.intro ?? "Introduction coming soon."}
        </p>
        <Link href="/about" className="inline-block mt-6 text-xs uppercase tracking-[0.2em] text-[#c9a24b] border-b border-[#c9a24b] pb-1">
          Read More
        </Link>
      </div>
    </section>
  );
}
