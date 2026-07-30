import { CarFront } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@dealer.com");
  const [password, setPassword] = useState("User@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex w-fit rounded-2xl bg-blue-600 p-3">
            <CarFront size={32} />
          </span>
          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="mt-2 text-slate-400">Sign in to explore inventory.</p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New customer?{" "}
          <Link to="/register" className="font-bold text-blue-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
