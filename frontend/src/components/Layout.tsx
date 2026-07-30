import { CarFront, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-600 p-2">
              <CarFront size={24} />
            </span>
            <div>
              <p className="text-lg font-black tracking-tight text-white">
                DriveStock
              </p>
              <p className="text-xs text-slate-400">Premium inventory</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white"
                }`
              }
            >
              Vehicles
            </NavLink>

            {user?.role === "ADMIN" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-white"
                  }`
                }
              >
                <ShieldCheck size={16} />
                Admin
              </NavLink>
            )}

            <button
              onClick={logout}
              className="ml-2 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
