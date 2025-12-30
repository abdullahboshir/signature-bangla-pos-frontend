import { RESOURCE_KEYS, ACTION_KEYS } from "@/config/permission-keys";
import { APP_MODULES, AppModule, ROUTE_PATHS } from "@/config/module-registry";

/**
 * Permission requirement for a route
 */
export interface PermissionRequirement {
  resource: string;  // Matches backend PermissionResourceType
  action: string;    // Matches backend PermissionActionType
}

// 1. Static/Legacy overrides or routes not in registry
const manualRoutes: Record<string, PermissionRequirement> = {
  "/": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.VIEW },
  "/overview": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.VIEW },
  
  // Legacy aliases (keep if needed, otherwise registry is source of truth)
  "/products": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.VIEW },
  "/products/add": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.CREATE },
  "/products/edit": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.UPDATE },
  
  "/orders": { resource: RESOURCE_KEYS.ORDER, action: ACTION_KEYS.VIEW },
  
  "/user-management/settings": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.UPDATE },
  "/settings/general": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.UPDATE },
};

// 2. Dynamic Generator from Module Registry
const generatePermissions = (modules: Record<string, AppModule>): Record<string, PermissionRequirement> => {
    const permissions: Record<string, PermissionRequirement> = {};

    const traverse = (item: AppModule) => {
        if (item.path && item.resource) {
            // Normalize path: ensure it starts with / if not empty and is not absolute URL
            let path = item.path;
            if (path && !path.startsWith('/') && !path.startsWith('http')) {
                 path = '/' + path;
            }
            
            if (path) {
                permissions[path] = {
                    resource: item.resource,
                    action: item.action || ACTION_KEYS.VIEW
                };
            }
        }
        if (item.children) {
            item.children.forEach(traverse);
        }
    };

    Object.values(modules).forEach(traverse);
    return permissions;
};

/**
 * Maps routes to required permissions
 * Source of Truth: src/config/module-registry.ts
 */
export const routePermissions: Record<string, PermissionRequirement> = {
    ...manualRoutes,
    ...generatePermissions(APP_MODULES)
};

/**
 * Get required permission for a route
 */
export function getRoutePermission(relativePath: string): PermissionRequirement | null {
  // Exact match first
  if (routePermissions[relativePath]) {
    return routePermissions[relativePath];
  }
  
  // Try to match parent routes (for nested routes like /products/edit/123)
  // Check each segment from right to left
  const segments = relativePath.split('/').filter(Boolean);
  
  for (let i = segments.length; i > 0; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (routePermissions[parentPath]) {
      return routePermissions[parentPath];
    }
  }
  
  return null;
}
