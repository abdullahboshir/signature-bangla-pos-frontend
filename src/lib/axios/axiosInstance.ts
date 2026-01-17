import axios from "axios";
import { baseURL } from "@/redux/api/base/config";
import { getToken } from "@/lib/auth/token-manager";
import { authKey } from "@/constant/authKey";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

// Helper to set cookie (duplicated to avoid circular dep with authService)
const setAuthCookie = (token: string) => {
  if (typeof document === "undefined") return;
  const days = 7;
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${authKey}=${encodeURIComponent(
    token
  )}; expires=${expires}; path=/; SameSite=Lax`;
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  // Don't attach token for login/register endpoints to avoid backend conflict
  const isPublicAuth =
    config.url?.includes("/login") || config.url?.includes("/register");

  if (token && !isPublicAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Context-Aware Header Injection
  const businessUnitId = localStorage.getItem("active-business-unit");
  const outletId = localStorage.getItem("active-outlet-id");
  const companyId = localStorage.getItem("active-organization-id");

  // Only inject if NOT a public auth route and ID exists
  const isPublicAuthRoute =
    config.url?.includes("/login") ||
    config.url?.includes("/register") ||
    config.url?.includes("/refresh-token");

  if (!isPublicAuthRoute) {
    if (businessUnitId) config.headers["x-business-unit-id"] = businessUnitId;
    if (outletId) config.headers["x-outlet-id"] = outletId;
    if (companyId) config.headers["x-organization-id"] = companyId;
  }
  return config;
});

// Refresh Token Queue Mechanism
interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // normalized
  },

  async (error) => {
    const originalRequest = error.config;

    // JWT expired → backend will return 401
    if (error?.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops: Don't retry if the failed request was already for login or refresh
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Direct refresh call to avoid circular dependency
        const refreshRes = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes?.data?.data?.accessToken;

        if (newToken) {
          setAuthCookie(newToken); // Update client cookie
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error("No token returned"), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
