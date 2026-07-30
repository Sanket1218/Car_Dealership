import { Pencil, PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../api";
import { VehicleForm } from "../components/VehicleForm";
import { Vehicle, VehicleFormData } from "../types";

export function AdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(data: VehicleFormData) {
    try {
      if (editing) {
        await api.put(`/vehicles/${editing.id}`, data);
        setMessage("Vehicle updated.");
        setEditing(null);
      } else {
        await api.post("/vehicles", data);
        setMessage("Vehicle added.");
      }
      await load();
    } catch (error) {
      setMessage(errorMessage(error));
      throw error;
    }
  }

  async function remove(vehicle: Vehicle) {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    try {
      await api.delete(`/vehicles/${vehicle.id}`);
      setMessage("Vehicle deleted.");
      await load();
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  async function restock(vehicle: Vehicle) {
    const input = window.prompt("How many vehicles should be added?", "1");
    if (input === null) return;
    const quantity = Number(input);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setMessage("Enter a positive whole number.");
      return;
    }

    try {
      await api.post(`/vehicles/${vehicle.id}/restock`, { quantity });
      setMessage("Vehicle restocked.");
      await load();
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          <PlusCircle size={18} />
          Inventory management
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">Admin dashboard</h1>
      </section>

      {message && (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200">
          {message}
        </p>
      )}

      <VehicleForm
        initial={editing}
        onSubmit={save}
        onCancel={() => setEditing(null)}
      />

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-950/70 text-sm text-slate-400">
              <tr>
                <th className="px-5 py-4">Vehicle</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-white/5">
                  <td className="px-5 py-4 font-bold text-white">
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {vehicle.category}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    ${vehicle.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {vehicle.quantity}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => restock(vehicle)}
                        title="Restock"
                        className="rounded-lg border border-white/10 p-2 text-emerald-300 hover:bg-white/10"
                      >
                        <RefreshCw size={17} />
                      </button>
                      <button
                        onClick={() => setEditing(vehicle)}
                        title="Edit"
                        className="rounded-lg border border-white/10 p-2 text-blue-300 hover:bg-white/10"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        onClick={() => remove(vehicle)}
                        title="Delete"
                        className="rounded-lg border border-white/10 p-2 text-red-300 hover:bg-white/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
