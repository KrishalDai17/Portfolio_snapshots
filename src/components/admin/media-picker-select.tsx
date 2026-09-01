type MediaOption = { id: string; public_id: string; alt_text: string | null };

/** Plain presentational select — fetch options in the server page/component
 * that renders this and pass them down, so this stays usable inside client
 * forms without re-fetching. */
export default function MediaPickerSelect({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: string | null;
  options: MediaOption[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      className="rounded-sm bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-[#f5f0e6]"
    >
      <option value="">No image selected</option>
      {options.map((m) => (
        <option key={m.id} value={m.id}>
          {m.alt_text || m.public_id.split("/").pop()}
        </option>
      ))}
    </select>
  );
}
