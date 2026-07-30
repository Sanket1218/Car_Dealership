import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/80 p-8">
        <h1 className="text-3xl font-black text-white">Create your account</h1>
        <p className="mt-2 text-slate-400">
          Register to browse and purchase vehicles.
        </p>

        {error && (
          <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {[
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["password", "Password", "password"],
            ["confirmPassword", "Confirm password", "password"]
          ].map(([field, label, type]) => (
            <label key={field} className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">
                {label}
              </span>
              <input
                required
                type={type}
                minLength={field.includes("password") ? 8 : undefined}
                value={form[field as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field]: event.target.value
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>
          ))}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
