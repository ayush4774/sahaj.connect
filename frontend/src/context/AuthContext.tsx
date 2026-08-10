import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";

export type AuthUser = {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function saveSession(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const token = localStorage.getItem("token");
      const cachedUser = localStorage.getItem("user");

      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      if (cachedUser) {
        try {
          if (mounted) setUser(JSON.parse(cachedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await api.get("/auth/me");
        const nextUser = response.data?.user ?? response.data;

        if (mounted && nextUser) {
          setUser(nextUser);
          localStorage.setItem("user", JSON.stringify(nextUser));
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token = response.data?.token;

    if (!token) {
      throw new Error("The server did not return an authentication token.");
    }

    const nextUser: AuthUser =
      response.data?.user ?? {
        email,
      };

    saveSession(token, nextUser);
    setUser(nextUser);

    return nextUser;
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    const response = await api.post("/auth/register", {
      name,
      username,
      email,
      password,
    });

    const token = response.data?.token;

    if (!token) {
      throw new Error("The server did not return an authentication token.");
    }

    const nextUser: AuthUser =
      response.data?.user ?? {
        name,
        username,
        email,
      };

    saveSession(token, nextUser);
    setUser(nextUser);

    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
