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
  document.cookie = `${authKey}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Context-Aware Header Injection
  if (typeof window !== "undefined") {
    const isAuthRoute = config.url?.includes("/auth/") || config.url?.includes("/login") || config.url?.includes("/register");
    const businessUnitId = localStorage.getItem("active-business-unit");
    const outletId = localStorage.getItem("active-outlet-id");
    
    // Only inject if NOT an auth route and ID exists
    if (!isAuthRoute) {
        if (businessUnitId) config.headers["x-business-unit-id"] = businessUnitId;
        if (outletId) config.headers["x-outlet-id"] = outletId;
    }
  }
  return config;
});

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
      if (originalRequest.url.includes("/auth/login") || originalRequest.url.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

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
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
