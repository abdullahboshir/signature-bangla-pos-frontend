"use client";

import { useParams } from "next/navigation";
import { useAuth } from "./useAuth";
import { normalizeAuthString, USER_ROLES } from "@/config/auth-constants";

interface UseCurrentRoleResult {
  currentRole?: string;
  userRoles: string[];
  hasRoleAccess: boolean;
  isLoading: boolean;
}

/**
 * Hook to get current user's role
 * UPDATED: No longer depends on URL params
 * Role is derived from authenticated user's data
 */
export function useCurrentRole(): UseCurrentRoleResult {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return {
      currentRole: undefined,
      userRoles: [],
      hasRoleAccess: false,
      isLoading: true,
    };
  }
  
  if (!user) {
    return {
      currentRole: undefined,
      userRoles: [],
      hasRoleAccess: false,
      isLoading: false,
    };
  }

  // Derive user roles from auth data
  const userAny = user as any;
  const globalRoles = (userAny?.globalRoles || [])
    .map((r: any) => normalizeAuthString(typeof r === 'string' ? r : r.slug || r.name))
    .filter(Boolean);
    
  const businessRoles = (userAny?.businessAccess || [])
    .map((acc: any) => normalizeAuthString(typeof acc.role === 'string' ? acc.role : acc.role?.slug || acc.role?.name))
    .filter(Boolean);
  
  const userRoles = [...new Set([...globalRoles, ...businessRoles])];

  // Primary role is the first one (or "super-admin" if present)
  const currentRole = userRoles.includes(USER_ROLES.SUPER_ADMIN) 
    ? USER_ROLES.SUPER_ADMIN 
    : userRoles.includes(USER_ROLES.COMPANY_OWNER)
      ? USER_ROLES.COMPANY_OWNER
      : userRoles[0];

  return {
    currentRole,
    userRoles,
    hasRoleAccess: userRoles.length > 0,
    isLoading: false,
  };
}

/**
 * Legacy hook for components that still expect params
 * @deprecated Use useCurrentRole() instead
 */
export function useRoleFromParams(): string | undefined {
  const params = useParams();
  return (params.role || params["roles"]) as string | undefined;
}
