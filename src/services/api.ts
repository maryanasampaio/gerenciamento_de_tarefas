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
  timeout: 10000,
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

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      forceLogout();
      return Promise.reject(error);
    }

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

    if (!refreshToken) {
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken =
        response.data?.access_token ||
        response.data?.dados?.access_token;

      const newRefreshToken =
        response.data?.refresh_token ||
        response.data?.dados?.refresh_token;

      if (!newAccessToken) {
        throw new Error("Novo token não recebido");
      }

      localStorage.setItem("access_token", newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);