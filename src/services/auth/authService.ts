// src/services/authService.ts
"use client";

import { jwtDecode } from "jwt-decode";
import { authKey } from "@/constant/authKey";

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
export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
};

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const setAuthSession = (token: string) => {
    setCookie(authKey, token);
};

export const clearAuthSession = () => {
    removeCookie(authKey);
    removeCookie("refreshToken");
    localStorage.removeItem("userState");
};


// -----------------------------
// Redirect Logic
// -----------------------------
export const getRedirectPath = (token: string, user?: User): string => {
    try {
        const decoded = jwtDecode(token) as any;
        const role = decoded?.role;

        if (role === "customer") return "/";
        if (role === "super-admin") return "/super-admin";

        const firstBusinessUnit = user?.businessUnits?.[0];
        if (firstBusinessUnit) {
            const buSlug = firstBusinessUnit.slug || firstBusinessUnit.id || "default";
            return `/${role}/${buSlug}`;
        }
        
        return "/super-admin";
    } catch (error) {
        return "/";
    }
};
