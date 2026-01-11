// lib/auth/role-validator.ts
"use client"

import { getRoutePermission } from "./route-permissions"
import { isSuperAdmin } from "@/config/auth-constants"

/**
 * Check if user has access to a specific route based on their permissions
 * This is a fully dynamic system - new roles can be created in backend
 * without requiring frontend code changes
 */
export async function hasRouteAccess(
  pathname: string,
  userRole?: string,
  userPermissions?: any[]
): Promise<boolean> {
  try {
    console.log("=== PERMISSION CHECK ===");
    console.log("pathname:", pathname);
    console.log("userRole:", userRole);
    console.log("userPermissions:", userPermissions);

    // Super admin always has access to everything
    if (isSuperAdmin(userRole)) {
      console.log("✅ Super admin - full access granted");
      return true;
    }

    // If no permissions provided, deny access
    if (!userPermissions || userPermissions.length === 0) {
      console.log("❌ No permissions provided");
      return false;
    }
    
    // Extract relative path (strip /[role]/[businessUnit] prefix)
    const pathSegments = pathname.split("/").filter(Boolean);
    let relativePath = "/";
    
    if (pathSegments.length > 2) {
      relativePath = "/" + pathSegments.slice(2).join("/");
    }

    console.log("relativePath:", relativePath);

    if (relativePath === "/" || relativePath === "/overview") {
      console.log("✅ Dashboard Access Allowed (Universal)");
      return true;
    }

    // Get required permission for this route
    const requiredPermission = getRoutePermission(relativePath);
    
    console.log("requiredPermission:", requiredPermission);

    if (!requiredPermission) {
      console.warn(`⚠️ No permission mapping found for route: ${relativePath}`);
      return false;
    }

    const hasPermission = userPermissions.some(perm => {
      if (!perm) return false;
      const permResource = perm.resource || perm.source;
      const permResourceLower = (permResource || "").toLowerCase();
      const reqResourceLower = (requiredPermission.resource || "").toLowerCase();
      const permActionLower = (perm.action || "").toLowerCase();
      const reqActionLower = (requiredPermission.action || "").toLowerCase();
      
      const resourceMatch = permResourceLower === reqResourceLower;
      const actionMatch = permActionLower === reqActionLower;
      const hasWildcard = permActionLower === "*"; 
      const hasResourceWildcard = permResourceLower === "*"; 
      
      return (resourceMatch || hasResourceWildcard) && (actionMatch || hasWildcard);
    });

    console.log("hasPermission:", hasPermission);
    console.log("=== END PERMISSION CHECK ===");

    return hasPermission;
  } catch (error) {
    console.error("❌ Route access check failed:", error);
    return false;
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  permission: string,
  userPermissions?: string[]
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(permission) || userPermissions.includes("*")
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  permissions: string[],
  userPermissions?: string[]
): boolean {
  if (!userPermissions) return false;
  return permissions.some((permission) => 
    userPermissions.includes(permission) || userPermissions.includes("*")
  )
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  permissions: string[],
  userPermissions?: string[]
): boolean {
  if (!userPermissions) return false;
  return permissions.every((permission) => 
    userPermissions.includes(permission) || userPermissions.includes("*")
  )
}
