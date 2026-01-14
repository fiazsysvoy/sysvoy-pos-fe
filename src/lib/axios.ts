import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

/**
 * Central axios instance with interceptor that injects Authorization header
 * from localStorage for every request except signin/signup endpoints.
 *
 * Usage:
 * import api from "@/lib/axios"
 * api.get("/some-protected-route")
 */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/", // adjust if you use a different env var
});

// simple matcher to skip auth for login/signup endpoints
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return /\/auth\/signin/i.test(url) || /\/auth\/signup/i.test(url);
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // do not attach token for signin/signup
    const requestUrl = config.url || "";
    if (isAuthEndpoint(requestUrl)) return config;

    // attach token from localStorage (only available in browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // ensure headers exist and set Authorization without replacing AxiosHeaders instance
        if (!config.headers) {
          config.headers = {} as any;
        }
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// optional: basic response handler for auth failures
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // if unauthorized, you can clear token and optionally redirect to login
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;