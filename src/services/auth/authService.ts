// src/services/authService.ts
"use client";

import { axiosInstance } from "@/lib/axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { authKey } from "@/constant/authKey";
import logger from "@/lib/providers/logger";

// -----------------------------
// Interfaces
// -----------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  roles: any[];
  businessUnits: any[];
  avatar?: string;
  permissions?: string[];
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  user?: User;
  redirect?: string;
  message?: string;
}

// -----------------------------
// Cookie Helpers
// -----------------------------
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (formData: any): Promise<LoginResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", formData);
  
    const { accessToken, user } = res?.data?.data;
    if (!accessToken) {
      return { success: false, message: "Invalid login" };
    }
  console.log('from loginnnnnnnnnnnnnnnn', res)
    setCookie(authKey, accessToken);

    // Decode to know redirect logic
    const decoded = jwtDecode(accessToken) as any;
    
    // Determine redirect based on user's role and business units
    let redirect = "/";
    
    if (decoded?.role === "customer") {
      redirect = "/";
    } else if (decoded?.role === "super-admin") {
      // Super admin goes to super-admin dashboard
      redirect = "/super-admin";
    } else {
      // For other roles, redirect to their first business unit
      const firstBusinessUnit = user?.businessUnits?.[0];
      if (firstBusinessUnit) {
        const buSlug = firstBusinessUnit.slug || firstBusinessUnit.id || "default";
        redirect = `/${decoded?.role}/${buSlug}`;
      } else {
        // Fallback if no business unit assigned
        redirect = "/super-admin";
      }
    }

    return {
      success: true,
      accessToken,
      user,
      redirect,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};

// -----------------------------
// REFRESH TOKEN
// -----------------------------
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axiosInstance.post("/auth/refresh-token");
    const token = res?.data?.data?.accessToken;
      console.log('from refreshAccessTokennnnnnnnnnnnnnn', res)
    
    if (!token) return null;

    setCookie(authKey, token);
    return token;
  } catch (error: any) {
    console.error("Refresh failed:", error?.message);
    removeCookie(authKey);
    return null;
  }
};

// -----------------------------
// CURRENT USER
// -----------------------------
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get("/auth/me");
      console.log('get meeeeeeeeeeeeee', res)
    return res?.data?.data || null;
  } catch (error) {
    return null;
  }
};

// -----------------------------
// LOGOUT
// -----------------------------
export const clearAuthSession = async () => {
  removeCookie(authKey);
  removeCookie("refreshToken");

  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    console.error("Logout API request failed:", err);
  }

  localStorage.removeItem("userState");
};

// -----------------------------
// RESTORE SESSION
// This function prevents early FALSE
// -----------------------------
export const restoreAuthSession = async (): Promise<User | null> => {
  let user = await getCurrentUser();
  if (user) return user;
console.log('from restoreAuthSessionnnnnnnnnnnnnnnn', user)
  const newToken = await refreshAccessToken();
  if (!newToken) {
    clearAuthSession();
    return null;
  }

  // 3️⃣ Third attempt: get user again after refresh
  user = await getCurrentUser();
  return user;
};
