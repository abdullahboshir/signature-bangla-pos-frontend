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
  
  const hasPermission = (permissionCode: string) => {
    if (!user?.permissions) return false;
    
    // Check if any role has this permission
    return user.permissions.some((assignment: any) => {
        // assignment.role.permissions could be string[] or object[]
        const rolePerms = assignment.role?.permissions || [];
        return rolePerms.some((p: any) => {
             const pCode = typeof p === 'string' ? p : p.name; // or p.code depending on model
             return pCode === permissionCode;
        });
    });
  }
  
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => hasPermission(permission));
  }
  
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(permission => hasPermission(permission));
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