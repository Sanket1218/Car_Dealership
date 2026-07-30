import { Gauge, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  onPurchase: (vehicle: Vehicle, quantity: number) => Promise<void>;
}

export function VehicleCard({ vehicle, onPurchase }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const stockLabel =
    vehicle.quantity === 0
      ? "Out of stock"
      : vehicle.quantity <= 3
        ? "Low stock"
        : "In stock";

  async function purchase() {
    setLoading(true);
    try {
      await onPurchase(vehicle, quantity);
      setQuantity(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
      <div className="relative h-52 overflow-hidden bg-slate-800">
        <img
          src={
            vehicle.imageUrl ||
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
          }
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold backdrop-blur">
          {vehicle.category}
        </span>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm text-blue-400">{vehicle.year ?? "Latest"}</p>
          <h2 className="text-2xl font-black text-white">
            {vehicle.make} {vehicle.model}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-black text-white">
            ${vehicle.price.toLocaleString()}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              vehicle.quantity === 0
                ? "bg-red-500/15 text-red-300"
                : vehicle.quantity <= 3
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {stockLabel}: {vehicle.quantity}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3">
            <Gauge size={17} className="text-slate-400" />
            <input
              aria-label="Purchase quantity"
              type="number"
              min={1}
              max={Math.max(1, vehicle.quantity)}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value)))
              }
              className="w-full bg-transparent py-3 text-white outline-none"
            />
          </label>

          <button
            onClick={purchase}
            disabled={
              loading ||
              vehicle.quantity === 0 ||
              quantity > vehicle.quantity
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            <ShoppingCart size={18} />
            {loading ? "Buying..." : "Purchase"}
          </button>
        </div>
      </div>
    </article>
  );
}
