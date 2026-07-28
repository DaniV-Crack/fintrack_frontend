import axios from "axios";

export interface NormalizedError {
  message: string;
  status: number | null;
  code: string;
}

const TOKEN_KEY = "fintrack_token";
const USER_KEY = "fintrack_user";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalized: NormalizedError;

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        normalized = { message: "Sesión expirada", status: 401, code: "UNAUTHORIZED" };
      } else if (status >= 500) {
        normalized = { message: "Error del servidor. Intentalo más tarde.", status, code: "SERVER_ERROR" };
      } else {
        normalized = {
          message: data?.message ?? "Error inesperado",
          status,
          code: "API_ERROR",
        };
      }
    } else if (error.request) {
      normalized = { message: "Error de conexión. Verifica tu internet.", status: null, code: "NETWORK_ERROR" };
    } else {
      normalized = { message: error.message ?? "Error desconocido", status: null, code: "UNKNOWN" };
    }

    return Promise.reject(normalized);
  },
);

export default api;
