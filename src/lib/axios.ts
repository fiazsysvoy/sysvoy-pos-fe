import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from "axios";

/**
 * Central axios instance with interceptor that injects Authorization header
 * from localStorage for every request except signin/signup endpoints.
 * 
 * Implements automatic token refresh on 401 errors using refresh token.
 *
 * Usage:
 * import api from "@/lib/axios"
 * api.get("/some-protected-route")
 */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/",
});

// Track if a token refresh is in progress to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue to store failed requests while token is being refreshed
let failedRequestsQueue: Array<(token: string) => void> = [];

// Matcher to skip auth for login/signup/refresh endpoints
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    /\/auth\/signin/i.test(url) ||
    /\/auth\/signup/i.test(url) ||
    /\/auth\/refresh-token/i.test(url)
  );
};

// Request interceptor: attach access token to all requests except auth endpoints
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestUrl = config.url || "";
    if (isAuthEndpoint(requestUrl)) return config;

    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        if (!config.headers) {
          config.headers = {} as any;
        }
        (config.headers as any).Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors with automatic token refresh
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried this request yet
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve) => {
          failedRequestsQueue.push((token: string) => {
            if (originalRequest.headers) {
              (originalRequest.headers as any).Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // No refresh token available, redirect to login
            throw new Error("No refresh token available");
          }

          // Call refresh token endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/refresh-token`,
            { refreshToken }
          );

          const newAccessToken = response.data.accessToken;

          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Update authorization header for the original request
          if (originalRequest.headers) {
            (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
          }

          // Process all queued requests with the new token
          failedRequestsQueue.forEach((callback) => callback(newAccessToken));
          failedRequestsQueue = [];

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed or expired, clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;