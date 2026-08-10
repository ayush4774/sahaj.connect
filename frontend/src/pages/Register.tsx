import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError("Complete all fields before creating your account.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        form.name.trim(),
        form.username.trim(),
        form.email.trim(),
        form.password
      );

      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your account. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <Navbar />

      <main className="min-h-screen pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-xl shadow-sky-100/40 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">SC</span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-semibold mb-2">
                Sahaja Connect
              </p>

              <h1 className="font-display text-3xl font-semibold text-[#0d2b45]">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-[#1a1f2e]/55">
                Start your Sahaja Connect journey.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                ["name", "Full Name", "text", "Your full name"],
                ["username", "Username", "text", "Choose a username"],
                ["email", "Email", "email", "you@example.com"],
              ].map(([name, label, type, placeholder]) => (
                <label key={name} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#1a1f2e]/65">
                    {label}
                  </span>
                  <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={form[name as keyof typeof form]}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        [name]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-sky-100 bg-[#fafbff] px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#1a1f2e]/65">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#1a1f2e]/55">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 font-semibold text-sky-600 hover:text-sky-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
