"use client"

import { useParams } from "next/navigation"
import { useAuth } from "./useAuth"

interface UseCurrentRoleResult {
  currentRole?: string
  userRole: string[]
  hasRoleAccess: boolean
  isLoading: boolean
}

export function useCurrentRole(): UseCurrentRoleResult {
  const params = useParams()
  const { user, isLoading } = useAuth()

  const currentRole = (params.role || params["roles"]) as string | undefined
  const userRole = user?.roles?.map((role: any) => role.name) || []

  const hasRoleAccess = currentRole ? userRole.includes(currentRole) : false

  return {
    currentRole,
    userRole,
    hasRoleAccess,
    isLoading: isLoading || !user,
  }
}
