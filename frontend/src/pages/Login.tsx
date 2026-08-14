import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    (location.state as { from?: string } | null)?.from || "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Enter both your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to sign in. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <Navbar />

      <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-xl shadow-sky-100/40 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">SC</span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-semibold mb-2">
                Sahaja Connect
              </p>

              <h1 className="font-display text-3xl font-semibold text-[#0d2b45]">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-[#1a1f2e]/55">
                Sign in to continue your journey.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#1a1f2e]/65">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-sky-100 bg-[#fafbff] px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#1a1f2e]/65">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-sky-100 bg-[#fafbff] px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0d2b45] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a3f5c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#1a1f2e]/55">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1.5 font-semibold text-sky-600 hover:text-sky-500"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
