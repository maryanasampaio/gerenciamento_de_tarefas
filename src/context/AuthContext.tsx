// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * ✅ Checa se há uma sessão válida via cookie HttpOnly
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        return false;
      }

      const response = await api.get("/auth/me");

      if (response.status === 200 && response.data?.usuario) {
        setUser(response.data.usuario);
        localStorage.setItem("user", JSON.stringify(response.data.usuario));
        return true;
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
    return false;
  };

  /**
   * ✅ Executa apenas 1x no carregamento inicial
   */
  useEffect(() => {
    (async () => {
      await checkAuth();
      setLoading(false);
    })();
  }, []);

  /**
   * ✅ Login chama o backend, backend gera cookie HttpOnly,
   * e depois o frontend confirma com checkAuth()
   */
  const login = async (userData?: any) => {
    try {
      // Se vier o objeto userData (ex: de uma requisição bem-sucedida)
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Caso contrário, consulta o backend pra confirmar
        await checkAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Logout limpa localStorage e backend (se existir endpoint)
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignora erros de logout */
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
