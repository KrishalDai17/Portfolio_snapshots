import { createClient } from "@/lib/supabase/server";
import { cldImageUrl } from "@/lib/cloudinary/url";
import MediaUploader from "./uploader";
import DeleteMediaButton from "./delete-button";

const FOLDERS = [
  { key: "dr-dslr/portfolio", label: "Photos" },
  { key: "dr-dslr/videos", label: "Videos" },
  { key: "dr-dslr/profile", label: "Profile" },
  { key: "dr-dslr/hero", label: "Hero" },
  { key: "dr-dslr/stories", label: "Stories" },
  { key: "dr-dslr/services", label: "Services" },
  { key: "dr-dslr/testimonials", label: "Testimonials" },
] as const;

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { folder = FOLDERS[0].key } = await searchParams;
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select("id, public_id, secure_url, resource_type, folder, alt_text, bytes, created_at")
    .eq("folder", folder)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Media Library</h1>

      <div className="flex gap-1 mb-6 flex-wrap">
        {FOLDERS.map((f) => (
          <a
            key={f.key}
            href={`/admin/media?folder=${encodeURIComponent(f.key)}`}
            className={`text-xs uppercase tracking-wider px-3 py-2 rounded-sm ${
              folder === f.key ? "bg-[#c9a24b] text-black" : "text-neutral-400 hover:bg-neutral-900"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <MediaUploader folder={folder as any} />

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {(media ?? []).map((m) => (
          <div key={m.id} className="group relative aspect-square bg-neutral-900 overflow-hidden rounded-sm">
            {m.resource_type === "image" ? (
              <img
                src={cldImageUrl(m.public_id, { width: 300, height: 300, crop: "fill" })}
                alt={m.alt_text ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <video src={m.secure_url} className="h-full w-full object-cover" muted />
            )}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <DeleteMediaButton id={m.id} publicId={m.public_id} resourceType={m.resource_type} />
            </div>
          </div>
        ))}
        {(!media || media.length === 0) && (
          <p className="col-span-full text-sm text-neutral-500 py-8 text-center">
            No media in this folder yet.
          </p>
        )}
      </div>
    </div>
  );
}
