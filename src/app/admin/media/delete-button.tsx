"use client";

import { useTransition, useState } from "react";
import { deleteMedia } from "@/actions/media";

export default function DeleteMediaButton({
  id,
  publicId,
  resourceType,
}: {
  id: string;
  publicId: string;
  resourceType: "image" | "video";
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this media permanently? This cannot be undone.")) return;
          startTransition(async () => {
            const result = await deleteMedia(id, publicId, resourceType);
            setError(result.error);
          });
        }}
        className="text-xs text-white hover:text-red-400 uppercase tracking-wider"
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
