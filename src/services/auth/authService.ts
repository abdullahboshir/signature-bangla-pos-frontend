// src/services/authService.ts
"use client";

import { jwtDecode } from "jwt-decode";
import { authKey } from "@/constant/authKey";
import { USER_ROLES, matchesRole } from "@/config/auth-constants";

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
export const getRedirectPath = (token: string, user?: any): string => {
  try {
    const decoded = jwtDecode(token) as any;
    // Handle role as array or string
    const roles = Array.isArray(decoded?.role) ? decoded.role : [decoded?.role];

    if (matchesRole(roles, USER_ROLES.CUSTOMER)) return "/";

    // Super Admin goes to /platform (no longer /super-admin after URL refactor)
    if (matchesRole(roles, USER_ROLES.SUPER_ADMIN) || decoded?.isSuperAdmin) {
      return "/platform/dashboard"; // Or /platform/overview
    }

    // For business unit users, redirect to their first business unit
    // Priority 1: Check User Object (More robust)
    let buSlug = null;

    // Check businessAccess first (Standard for Business Access)
    if (user?.businessAccess && user.businessAccess.length > 0) {
      // Find first valid BU
      const first = user.businessAccess[0];
      // Format might be { businessUnit: { _id, slug } } or just { _id, slug } depending on populate
      // Based on User interface `businessAccess` is `any[]`.
      // Let's assume it has populated businessUnit or is the BU itself.
      const bu = first.businessUnit || first;
      buSlug = bu?.slug || bu?._id || bu?.id;
    }
    // Fallback: Check businessUnits array
    else if (user?.businessUnits && user.businessUnits.length > 0) {
      const first = user.businessUnits[0];
      buSlug = first?.slug || first?._id || first?.id;
    }
    // Fallback: Check Token
    else if (decoded?.businessUnits?.[0]) {
      const first = decoded.businessUnits[0];
      buSlug = first?.slug || first?.id;
    }

    if (buSlug) {
      // New structure: /[business-unit]/dashboard
      return `/${buSlug}/dashboard`;
    }

    // Fallback to platform if no business unit found
    return "/platform/dashboard";
  } catch (error) {
    return "/";
  }
};
