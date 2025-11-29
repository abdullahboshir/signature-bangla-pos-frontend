import axios from "axios";
import { baseURL } from "@/redux/api/base/baseApi";
import { refreshAccessToken } from "@/services/auth/authService";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        return Promise.reject(error);
      }

      if (refreshed) {
        sessionStorage.setItem("accessToken", refreshed);
        originalRequest.headers.Authorization = `Bearer ${refreshed}`;
      }

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);
