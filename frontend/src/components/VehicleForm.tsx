import { FormEvent, useEffect, useState } from "react";
import { Vehicle, VehicleFormData } from "../types";

interface Props {
  initial?: Vehicle | null;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel?: () => void;
}

const emptyForm: VehicleFormData = {
  make: "",
  model: "",
  category: "SUV",
  price: 1,
  quantity: 0,
  year: new Date().getFullYear(),
  imageUrl: ""
};

export function VehicleForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<VehicleFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      initial
        ? {
            make: initial.make,
            model: initial.model,
            category: initial.category,
            price: initial.price,
            quantity: initial.quantity,
            year: initial.year,
            imageUrl: initial.imageUrl ?? ""
          }
        : emptyForm
    );
  }, [initial]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      if (!initial) setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }

  const update = (field: keyof VehicleFormData, value: string | number) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2"
    >
      <h2 className="md:col-span-2 text-2xl font-black text-white">
        {initial ? "Update vehicle" : "Add a vehicle"}
      </h2>

      {(["make", "model", "category"] as const).map((field) => (
        <label key={field} className="space-y-2">
          <span className="text-sm font-semibold capitalize text-slate-300">
            {field}
          </span>
          <input
            required
            value={form[field]}
            onChange={(event) => update(field, event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>
      ))}

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-300">Price</span>
        <input
          required
          type="number"
          min="1"
          step="0.01"
          value={form.price}
          onChange={(event) => update("price", Number(event.target.value))}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-300">Quantity</span>
        <input
          required
          type="number"
          min="0"
          value={form.quantity}
          onChange={(event) => update("quantity", Number(event.target.value))}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-300">Year</span>
        <input
          type="number"
          min="1900"
          max={new Date().getFullYear() + 2}
          value={form.year ?? ""}
          onChange={(event) => update("year", Number(event.target.value))}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-semibold text-slate-300">Image URL</span>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </label>

      <div className="flex gap-3 md:col-span-2">
        <button
          disabled={saving}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : initial ? "Save changes" : "Add vehicle"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-5 py-3 font-bold text-slate-300 hover:bg-white/10"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
