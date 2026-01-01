// src/services/authService.ts
"use client";

import { jwtDecode } from "jwt-decode";
import { authKey } from "@/constant/authKey";

// -----------------------------
// Interfaces
// -----------------------------
import { User } from "@/types/user";

export type { User }; 

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  status?: string;
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

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
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
export const getRedirectPath = (token: string): string => {
    try {
        const decoded = jwtDecode(token) as any;
        // Handle role as array or string
        const roles = Array.isArray(decoded?.role) ? decoded.role : [decoded?.role];
     
        if (roles.includes("customer")) return "/";
        
        // Super Admin goes to /global (no longer /super-admin after URL refactor)
        if (roles.includes("super-admin") || decoded?.isSuperAdmin) {
            return "/global/dashboard"; // Or /global/overview
        }
        
        // For business unit users, redirect to their first business unit
        const firstBusinessUnit = decoded?.businessUnits?.[0];
        if (firstBusinessUnit) {
            const buSlug = firstBusinessUnit.slug || firstBusinessUnit.id || "default";
            // New structure: /[business-unit]/overview (no role in URL)
            return `/${buSlug}/overview`;
        }
        
        // Fallback to global if no business unit
        return "/global/dashboard";
    } catch (error) {
        return "/";
    }
};
