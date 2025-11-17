// src/hooks/usePermissions.ts
"use client"

import { useAuth } from "./useAuth"

export function usePermissions() {
  const { user, isLoading: authLoading } = useAuth()
  
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
  
  return {
    permissions: user?.permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: authLoading || !user,
  }
}