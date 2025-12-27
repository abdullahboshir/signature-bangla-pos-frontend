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
export const getRedirectPath = (token: string, user?: User): string => {
    try {
        const decoded = jwtDecode(token) as any;
        // Handle role as array or string
        const roles = Array.isArray(decoded?.role) ? decoded.role : [decoded?.role];

        if (roles.includes("customer")) return "/";
        if (roles.includes("super-admin")) return "/super-admin";

        const firstBusinessUnit = user?.businessUnits?.[0];
        if (firstBusinessUnit) {
            const buSlug = firstBusinessUnit.slug || firstBusinessUnit.id || "default";
            // Determine primary role for this business unit?
            // For now, use the first role in the list as fallback, or specific logic
            // Ideally we find the role for this BU.
            // But decoded token might not have per-bu role info nicely structure for easy pick without user permissions.
            // Just pick first available role for now.
            const primaryRole = roles[0] || 'staff';
            return `/${primaryRole}/${buSlug}`;
        }
        
        return "/super-admin"; // Fallback
    } catch (error) {
        return "/";
    }
};
