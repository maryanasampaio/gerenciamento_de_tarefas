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
  // Parser seguro para valores JSON do localStorage
  const getStoredJSON = (key: string) => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    if (raw === "undefined" || raw === "null" || raw.trim() === "") {
      // Limpa valores inválidos previamente gravados
      localStorage.removeItem(key);
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      // Em caso de JSON inválido, remove e retorna null
      localStorage.removeItem(key);
      return null;
    }
  };

  const [user, setUser] = useState<any | null>(() => getStoredJSON("user"));

  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * ✅ Checa se há uma sessão válida via cookie HttpOnly
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const savedUser = getStoredJSON("user");
      
      // Se não tem nenhum token, limpa tudo e retorna false
      if (!token && !refreshToken) {
        setUser(null);
        localStorage.removeItem("user");
        return false;
      }

      // Se tem usuário salvo e token, assume sessão válida (offline-first)
      // Isso evita logout ao dar refresh se o backend estiver lento
      if (savedUser && (token || refreshToken)) {
        setUser(savedUser);
        
        // Tenta validar em background, mas não bloqueia a UI
        try {
          const response = await api.get("/auth/me");
          if (response.status === 200 && response.data?.usuario) {
            // Atualiza com dados frescos do backend
            setUser(response.data.usuario);
            localStorage.setItem("user", JSON.stringify(response.data.usuario));
          }
        } catch (apiError: any) {
          // Se 401, mantém user local mas sinaliza que o token pode estar expirado
          // O interceptor vai tentar renovar na próxima requisição
          if (apiError?.response?.status !== 401) {
            // Outros erros (rede, etc) - mantém sessão local
            console.warn("Erro ao validar sessão, mantendo dados locais:", apiError.message);
          }
        }
        return true;
      }

      // Se não tem user salvo, tenta buscar do backend
      if (token) {
        try {
          const response = await api.get("/auth/me");
          if (response.status === 200 && response.data?.usuario) {
            setUser(response.data.usuario);
            localStorage.setItem("user", JSON.stringify(response.data.usuario));
            return true;
          }
        } catch (apiError: any) {
          // Apenas limpa em 401 sem refreshToken
          if (apiError?.response?.status === 401 && !refreshToken) {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            return false;
          }
        }
      }
      
      // Se tem refreshToken mas não tem access_token, tenta renovar
      if (refreshToken && !token) {
        try {
          const response = await api.post("/auth/refresh");
          const newToken = response.data?.access_token;
          if (newToken) {
            localStorage.setItem("access_token", newToken);
            // Tenta buscar dados do usuário
            const userResponse = await api.get("/auth/me");
            if (userResponse.data?.usuario) {
              setUser(userResponse.data.usuario);
              localStorage.setItem("user", JSON.stringify(userResponse.data.usuario));
              return true;
            }
          }
        } catch (refreshError) {
          // Refresh falhou, limpa tudo
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return false;
        }
      }
      
      // Caso padrão: mantém user se existir
      if (savedUser) {
        setUser(savedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      // Erro inesperado - mantém sessão local se tiver
      const savedUser = getStoredJSON("user");
      if (savedUser) {
        setUser(savedUser);
        return true;
      }
      setUser(null);
      return false;
    }
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
      localStorage.removeItem("refresh_token");
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
