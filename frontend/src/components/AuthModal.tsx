import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { login: signIn, register: signUp } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  if (!open) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (
      mode === "register" &&
      (!form.name || !form.username)
    ) {
      setError("Complete all registration fields.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "login") {
        await signIn(form.email, form.password);
      } else {
        await signUp(
          form.name,
          form.username,
          form.email,
          form.password
        );
      }

      onClose();
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to complete the request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xl text-[#1a1f2e]/40 hover:text-[#1a1f2e]"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">SC</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#0d2b45]">
            {mode === "login" ? "Welcome back" : "Join Sahaja Connect"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl bg-sky-50">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 rounded-lg text-sm font-semibold ${
              mode === "login"
                ? "bg-white text-[#0d2b45] shadow-sm"
                : "text-[#1a1f2e]/45"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`py-2 rounded-lg text-sm font-semibold ${
              mode === "register"
                ? "bg-white text-[#0d2b45] shadow-sm"
                : "text-[#1a1f2e]/45"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3 text-sm outline-none focus:border-sky-400"
              />

              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    username: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                password: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0d2b45] py-3 text-sm font-semibold text-white hover:bg-[#1a3f5c] disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
