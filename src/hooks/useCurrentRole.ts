// src/hooks/useCurrentRole.ts
"use client"

import { useParams } from "next/navigation"
import { useAuth } from "./useAuth"

export function useCurrentRole() {
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  
  // Handle both "role" and dynamic route param access
  const currentRole = (params.role || params["role"]) as string | undefined
  const userRole = user?.role
  
  const hasRoleAccess = currentRole ? currentRole === userRole : false

  // const currentRole = 'admin'
  // const userRole = 'admin'
  
  // const hasRoleAccess = 'admin'
  
  return {
    currentRole: currentRole || null,
    userRole: userRole || null,
    hasRoleAccess,
    isLoading: authLoading || !user,
  }
}