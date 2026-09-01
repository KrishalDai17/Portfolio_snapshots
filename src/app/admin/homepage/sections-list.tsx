"use client";

import DragReorderList from "@/components/admin/drag-reorder-list";
import { toggleSectionEnabled } from "@/actions/homepage";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Slider",
  selected_works: "Selected Works",
  albums: "Featured Albums",
  about: "About Himal",
  services: "Services",
  films: "Featured Films",
  stories: "Photography Stories",
  testimonials: "Testimonials",
  social: "Social Media",
  contact: "Contact CTA",
};

type Section = { id: string; section_key: string; is_enabled: boolean };

export default function SectionsList({ sections }: { sections: Section[] }) {
  return (
    <div className="border border-neutral-800 divide-y divide-neutral-800">
      <DragReorderList
        table="homepage_sections"
        items={sections}
        revalidatePaths={["/admin/homepage", "/"]}
        renderItem={(s, dragHandle) => (
          <div className="p-4 flex items-center gap-4">
            <span {...dragHandle} className="text-neutral-600 hover:text-[#c9a24b] cursor-grab select-none">
              ⠿
            </span>
            <p className="flex-1 text-sm">{SECTION_LABELS[s.section_key] ?? s.section_key}</p>
            <form action={toggleSectionEnabled.bind(null, s.id, !s.is_enabled)}>
              <button
                type="submit"
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border rounded-sm ${
                  s.is_enabled ? "border-[#c9a24b] text-[#c9a24b]" : "border-neutral-700 text-neutral-500"
                }`}
              >
                {s.is_enabled ? "Enabled" : "Disabled"}
              </button>
            </form>
          </div>
        )}
      />
    </div>
  );
}
