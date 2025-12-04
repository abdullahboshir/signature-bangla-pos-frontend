// src/hooks/usePermissions.ts
"use client"

import { useAuth } from "./useAuth"

export function usePermissions() {
  const { user, isLoading: authLoading } = useAuth()

    if (authLoading) {
    return {
      userRole: [],
      hasRoleAccess: false,
      isLoading: true,
    };
  }


  if (!user) {
    return {
      userRole: [],
      hasRoleAccess: false,
      isLoading: false,
    };
  }
  
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false
  }
  
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => 
      user?.permissions?.includes(permission)
    )
  }
  
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(permission => 
      user?.permissions?.includes(permission)
    )
  }
  
console.log("usePermissions →", {
  permissions: user?.permissions || [],
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isLoading: authLoading || !user,
})

  return {
    permissions: user?.permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: authLoading || !user,
  }
}