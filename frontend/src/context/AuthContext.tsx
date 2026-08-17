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
  id: string;
  email: string;
  role: "admin";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function saveSession(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
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
          const parsedUser = JSON.parse(cachedUser);

          if (mounted && parsedUser?.role === "admin") {
            setUser(parsedUser);
          }
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await api.get("/auth/me");

        const nextUser = response.data?.user;

        if (
          mounted &&
          nextUser &&
          nextUser.role === "admin"
        ) {
          setUser(nextUser);
          localStorage.setItem(
            "user",
            JSON.stringify(nextUser)
          );
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          if (mounted) {
            setUser(null);
          }
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthUser> => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token = response.data?.token;
    const nextUser = response.data?.user;

    if (!token || !nextUser) {
      throw new Error(
        "The server did not return valid admin credentials."
      );
    }

    if (nextUser.role !== "admin") {
      throw new Error("Unauthorized. Admin access required.");
    }

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
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}