// src/hooks/usePermissions.ts
"use client"

import { useAuth } from "./useAuth"
import { checkPermission, checkAnyPermission, checkAllPermissions, checkIsSuperAdmin } from "@/lib/iam/permissions";

export function usePermissions() {
  const { user, isLoading: authLoading } = useAuth()

  const isLoading = authLoading; // Simplified loading state

  if (isLoading || !user) {
    return {
      permissions: [],
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      isSuperAdmin: false,
      isLoading: isLoading ?? true, // Default to true if undefined
    };
  }

  return {
    permissions: user?.permissions || [],
    hasPermission: (code: string) => checkPermission(user, code),
    hasAnyPermission: (codes: string[]) => checkAnyPermission(user, codes),
    hasAllPermissions: (codes: string[]) => checkAllPermissions(user, codes),
    isSuperAdmin: checkIsSuperAdmin(user),
    isLoading: false,
  }
}
