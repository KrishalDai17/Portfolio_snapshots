import { createClient } from "@/lib/supabase/server";
import CreateServiceForm from "./create-form";
import ServicesList from "./services-list";

export default async function ServicesPage() {
  const supabase = await createClient();
  const [{ data: services }, { data: media }] = await Promise.all([
    supabase
      .from("services")
      .select("id, title, description, price_label, show_price, is_visible")
      .order("sort_order", { ascending: true }),
    supabase.from("media").select("id, public_id, alt_text").eq("folder", "dr-dslr/services").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-serif mb-6">Services</h1>
      <CreateServiceForm mediaOptions={media ?? []} />
      <div className="mt-8">
        <p className="text-xs text-neutral-500 mb-2">Drag ⠿ to reorder.</p>
        <ServicesList services={services ?? []} />
      </div>
    </div>
  );
}
