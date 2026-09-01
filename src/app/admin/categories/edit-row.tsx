"use client";

import { useState, useTransition } from "react";
import { updateCategory } from "@/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function EditCategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex-1 text-left min-w-0"
      >
        <p className="text-sm">{category.name}</p>
        <p className="text-xs text-neutral-500">/{category.slug}</p>
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await updateCategory(category.id, formData);
          if (result.error) setError(result.error);
          else {
            setError(null);
            setEditing(false);
          }
        });
      }}
      className="flex-1 flex flex-wrap gap-2 min-w-0"
    >
      <input
        name="name"
        defaultValue={category.name}
        className="rounded-sm bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm"
      />
      <input
        name="slug"
        defaultValue={category.slug}
        className="rounded-sm bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm"
      />
      <input
        name="description"
        defaultValue={category.description ?? ""}
        className="rounded-sm bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm flex-1 min-w-[120px]"
      />
      <button type="submit" disabled={isPending} className="text-xs text-[#c9a24b]">
        Save
      </button>
      <button type="button" onClick={() => setEditing(false)} className="text-xs text-neutral-500">
        Cancel
      </button>
      {error && <p className="text-xs text-red-400 basis-full">{error}</p>}
    </form>
  );
}
