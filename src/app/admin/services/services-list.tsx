"use client";

import DragReorderList from "@/components/admin/drag-reorder-list";
import { deleteService, toggleServiceVisible } from "@/actions/services";

type Service = {
  id: string;
  title: string;
  description: string | null;
  price_label: string | null;
  show_price: boolean;
  is_visible: boolean;
};

export default function ServicesList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return <p className="p-6 text-sm text-neutral-500 border border-neutral-800">No services yet — add one above.</p>;
  }

  return (
    <div className="border border-neutral-800 divide-y divide-neutral-800">
      <DragReorderList
        table="services"
        items={services}
        revalidatePaths={["/admin/services", "/"]}
        renderItem={(s, dragHandle) => (
          <div className="p-4 flex items-center gap-4">
            <span {...dragHandle} className="text-neutral-600 hover:text-[#c9a24b] cursor-grab shrink-0 select-none">
              ⠿
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{s.title}</p>
              <p className="text-xs text-neutral-500 truncate">{s.description}</p>
              {s.show_price && s.price_label && <p className="text-xs text-[#c9a24b]">{s.price_label}</p>}
            </div>
            <form action={toggleServiceVisible.bind(null, s.id, !s.is_visible)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm shrink-0 ${
                  s.is_visible ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {s.is_visible ? "Visible" : "Hidden"}
              </button>
            </form>
            <form action={deleteService.bind(null, s.id)}>
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
