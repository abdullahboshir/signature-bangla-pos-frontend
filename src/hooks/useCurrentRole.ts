"use client";

import { useParams } from "next/navigation";
import { useAuth } from "./useAuth";

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
  const userRoles = 
    (userAny?.role && Array.isArray(userAny.role)) 
      ? userAny.role 
      : Array.isArray(user?.roles) 
        ? user.roles.map((role: any) => role.name || role.slug || role) 
        : [];

  // Primary role is the first one (or "super-admin" if present)
  const currentRole = userRoles.includes('super-admin') 
    ? 'super-admin' 
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

