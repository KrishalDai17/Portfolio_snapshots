import { createClient } from "@/lib/supabase/server";
import CreateCategoryForm from "./create-form";
import CategoriesList from "./categories-list";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_visible, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Categories</h1>
      <CreateCategoryForm />
      <div className="mt-8">
        <p className="text-xs text-neutral-500 mb-2">Drag ⠿ to reorder.</p>
        <CategoriesList categories={categories ?? []} />
      </div>
    </div>
  );
}
