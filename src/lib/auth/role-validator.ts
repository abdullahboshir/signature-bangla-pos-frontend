// lib/auth/role-validator.ts
"use client"

/**
 * Check if user has access to a specific route
 */
export async function hasRouteAccess(
  pathname: string,
  userRole?: string,
  userPermissions?: string[]
): Promise<boolean> {
  try {
    // If no role or permissions provided, deny access
    if (!userRole || !userPermissions) {
      return false
    }
    
    
    // Define route access rules based on roles
    const routeAccessRules: Record<string, string[]> = {
      // Super admin can access everything
      "super-admin": ["*"],
      
      // Business admin routes
      "business-admin": [
        "/",
        "/products",
        "/sales",
        "/customers",
        "/suppliers",
        "/reports",
        "/inventory",
        "/settings",
      ],
      
      // Store manager routes
      "store-manager": [
        "/",
        "/pos",
        "/inventory",
        "/staff",
        "/reports",
      ],
      
      // Cashier routes
      "cashier": [
        "/",
        "/pos",
        "/quick-sales",
        "/today",
        "/my-sales",
      ],
    }
    
    // Get allowed routes for user's role
    const allowedRoutes = routeAccessRules[userRole] || []
    
    // Super admin has access to everything
    if (allowedRoutes.includes("*")) {
      return true
    }
    
    // Check if pathname matches any allowed route
    const pathSegments = pathname.split("/").filter(Boolean)
    
    // For now, simple check - can be enhanced with more sophisticated routing logic
    for (const route of allowedRoutes) {
      if (pathname.startsWith(route) || pathname === route) {
        return true
      }
    }

    // Check permissions if route is not in role-based list
    // This is a simple implementation - can be enhanced
    return false
  } catch (error) {
    console.error("Route access check failed:", error)
    return false
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  permission: string,
  userPermissions?: string[]
): boolean {
  if (!userPermissions) {
    return false
  }

  return userPermissions.includes(permission) || userPermissions.includes("*")
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  permissions: string[],
  userPermissions?: string[]
): boolean {
  if (!userPermissions) {
    return false
  }

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
  if (!userPermissions) {
    return false
  }

  return permissions.every((permission) => 
    userPermissions.includes(permission) || userPermissions.includes("*")
  )
}


