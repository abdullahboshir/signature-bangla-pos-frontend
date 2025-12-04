"use client";

import { useParams } from "next/navigation";
import { useAuth } from "./useAuth";

interface UseCurrentRoleResult {
  currentRole?: string;
  userRole: string[];
  hasRoleAccess: boolean;
  isLoading: boolean;
}

export function useCurrentRole(): UseCurrentRoleResult {
  const params = useParams();
  const { user, isLoading } = useAuth();
  const currentRole =
  (params.role || params["roles"]) as string | undefined;
  
  if (isLoading) {
    return {
      currentRole,
      userRole: [],
      hasRoleAccess: false,
      isLoading: true,
    };
  }
  
  
  if (!user) {
    return {
      currentRole,
      userRole: [],
      hasRoleAccess: false,
      isLoading: false,
    };
  }
  
  console.log('useCurrentRole', user, isLoading)

  const userRole =
    Array.isArray(user.roles)
      ? user.roles.map((role: any) => role.name)
      : [];

  // 👍 এখন safe access check
  const hasRoleAccess =
    currentRole && userRole.length > 0
      ? userRole.includes(currentRole)
      : false;

  console.log(
    "useCurrentRole →",
    { currentRole, userRole, hasRoleAccess }
  );

  return {
    currentRole,
    userRole,
    hasRoleAccess,
    isLoading: false,
  };
}
