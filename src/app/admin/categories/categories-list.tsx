"use client";

import DragReorderList from "@/components/admin/drag-reorder-list";
import { deleteCategory, toggleCategoryVisibility } from "@/actions/categories";
import EditCategoryRow from "./edit-row";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_visible: boolean;
};

export default function CategoriesList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return <p className="p-6 text-sm text-neutral-500 border border-neutral-800">No categories yet — add one above.</p>;
  }

  return (
    <div className="border border-neutral-800 divide-y divide-neutral-800">
      <DragReorderList
        table="categories"
        items={categories}
        revalidatePaths={["/admin/categories", "/"]}
        renderItem={(c, dragHandle) => (
          <div className="p-4 flex items-center gap-4">
            <span {...dragHandle} className="text-neutral-600 hover:text-[#c9a24b] cursor-grab shrink-0 select-none">
              ⠿
            </span>

            <EditCategoryRow category={c} />

            <form action={toggleCategoryVisibility.bind(null, c.id, !c.is_visible)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm shrink-0 ${
                  c.is_visible ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {c.is_visible ? "Visible" : "Hidden"}
              </button>
            </form>

            <form action={deleteCategory.bind(null, c.id)}>
              <button type="submit" className="text-xs uppercase tracking-wider text-neutral-500 hover:text-red-400 shrink-0">
                Delete
              </button>
            </form>
          </div>
        )}
      />
    </div>
  );
}
