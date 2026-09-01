"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory, type CategoryFormState } from "@/actions/categories";

const initialState: CategoryFormState = { error: null };
const inputClass =
  "rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6] placeholder:text-neutral-600 focus:outline-none focus:border-[#c9a24b]";

export default function CreateCategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isPending && !state.error) formRef.current?.reset();
  }, [isPending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap gap-3 items-start">
      <input name="name" placeholder="Category name" required className={inputClass} />
      <input name="slug" placeholder="Slug (optional)" className={inputClass} />
      <input name="description" placeholder="Description (optional)" className={`${inputClass} flex-1 min-w-[200px]`} />
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#c9a24b] text-black text-xs uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-[#d8b566] disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add Category"}
      </button>
      {state.error && <p className="text-sm text-red-400 basis-full">{state.error}</p>}
    </form>
  );
}
