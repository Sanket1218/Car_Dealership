import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { api } from "../api";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function storedUser(): User | null {
  try {
    const value = localStorage.getItem("dealership_user");
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("dealership_token")
  );

  const saveSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem("dealership_token", nextToken);
    localStorage.setItem("dealership_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post("/auth/login", { email, password });
      saveSession(response.data.token, response.data.user);
    },
    [saveSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await api.post("/auth/register", { name, email, password });
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("dealership_token");
    localStorage.removeItem("dealership_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
