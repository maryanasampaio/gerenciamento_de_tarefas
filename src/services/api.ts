import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL não definida no ambiente.");
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const forceLogout = () => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_expires_at");
    localStorage.removeItem("user");
  } catch {}

  window.location.href = "/login";
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Se não for erro 401 ou já tentou o retry, rejeita
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Para login e refresh, não tenta refresh automático
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Se já está fazendo refresh, enfileira a requisição
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    // Se não tiver refresh_token, força logout
    if (!refreshToken) {
      processQueue(error, null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      // Faz o refresh usando o refresh_token no header Authorization
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const { 
        access_token, 
        refresh_token: newRefreshToken,
        expires_in,
        refresh_expires_in
      } = response.data;

      // Salva os novos tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", newRefreshToken);
      
      // Atualiza as datas de expiração apenas se os valores existirem
      try {
        if (expires_in && typeof expires_in === 'number') {
          const expiresAt = new Date(Date.now() + expires_in * 60 * 1000).toISOString();
          localStorage.setItem("expires_at", expiresAt);
        }
        
        if (refresh_expires_in && typeof refresh_expires_in === 'number') {
          const refreshExpiresAt = new Date(Date.now() + refresh_expires_in * 60 * 1000).toISOString();
          localStorage.setItem("refresh_expires_at", refreshExpiresAt);
        }
      } catch (dateError) {
        console.error("  → Erro ao calcular datas de expiração no refresh:", dateError);
      }

      // Atualiza o header padrão e da requisição original
      api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      originalRequest.headers.Authorization = `Bearer ${access_token}`;

      // Processa a fila de requisições que estavam esperando
      processQueue(null, access_token);
      isRefreshing = false;

      // Retenta a requisição original
      return api(originalRequest);
    } catch (refreshError) {
      // Se o refresh falhar, força logout
      processQueue(refreshError, null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);