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
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      permissions: [],
    };
  }


  if (!user) {
    return {
      userRole: [],
      hasRoleAccess: false,
      isLoading: false,
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      permissions: [],
    };
  }
  
  // Helper to determine if user is Super Admin
  const isSuperAdmin = 
    user?.isSuperAdmin || 
    user?.roles?.some((r: any) => 
      (typeof r === 'string' && r === 'super-admin') || 
      (r?.name === 'super-admin') || 
      (r?.slug === 'super-admin')
    );

  const hasPermission = (permissionCode: string) => {
    if (isSuperAdmin) return true; // 👑 Super Admin bypass
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