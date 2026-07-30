import { Search, SlidersHorizontal } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../api";
import { VehicleCard } from "../components/VehicleCard";
import { useAuth } from "../context/AuthContext";
import { Vehicle } from "../types";

export function DashboardPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  async function search(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );
      const response = await api.get("/vehicles/search", { params });
      setVehicles(response.data.vehicles);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function purchase(vehicle: Vehicle, quantity: number) {
    const total = vehicle.price * quantity;
    if (
      !window.confirm(
        `Purchase ${quantity} × ${vehicle.make} ${vehicle.model} for $${total.toLocaleString()}?`
      )
    ) {
      return;
    }

    try {
      const response = await api.post(`/vehicles/${vehicle.id}/purchase`, {
        quantity
      });
      setVehicles((current) =>
        current.map((item) =>
          item.id === vehicle.id ? response.data.vehicle : item
        )
      );
      setMessage("Purchase completed successfully.");
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
          Welcome, {user?.name}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
          Find a vehicle built for your next journey.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Search live dealership inventory and purchase securely.
        </p>
      </section>

      <form
        onSubmit={search}
        className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-5 md:grid-cols-6"
      >
        <div className="flex items-center gap-2 text-slate-300 md:col-span-6">
          <SlidersHorizontal size={18} />
          <span className="font-bold">Search filters</span>
        </div>

        {(["make", "model", "category"] as const).map((field) => (
          <input
            key={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={filters[field]}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                [field]: event.target.value
              }))
            }
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        ))}

        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              minPrice: event.target.value
            }))
          }
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              maxPrice: event.target.value
            }))
          }
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-500">
            <Search size={18} />
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({
                make: "",
                model: "",
                category: "",
                minPrice: "",
                maxPrice: ""
              });
              void loadVehicles();
            }}
            className="rounded-xl border border-white/10 px-4 py-3 font-bold text-slate-300 hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </form>

      {message && (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200">
          {message}
        </p>
      )}

      {loading ? (
        <p className="py-20 text-center text-slate-400">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="py-20 text-center text-slate-400">No vehicles found.</p>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={purchase}
            />
          ))}
        </section>
      )}
    </div>
  );
}
