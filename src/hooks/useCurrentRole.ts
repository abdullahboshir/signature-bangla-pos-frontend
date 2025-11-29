// src/hooks/useCurrentRole.ts
"use client"

import { useParams } from "next/navigation"
import { useAuth } from "./useAuth"

export function useCurrentRole() {
  const params = useParams()
  const { user, isLoading: roleLoading } = useAuth()
  
  if(roleLoading) return 'loading...';

  const currentRole = (params.role || params["roles"]) as string | undefined
  const userRole = user?.roles.map((role: any) => role.name) || []
  const hasRoleAccess = currentRole ? userRole.includes(currentRole) : false
  console.log('checkkkkkkkkkkkkkkkk', userRole, hasRoleAccess, user?.roles)

  return {
    currentRole: currentRole || null,
    userRole: userRole || null,
    hasRoleAccess,
    isLoading: roleLoading || !user,
  }
}