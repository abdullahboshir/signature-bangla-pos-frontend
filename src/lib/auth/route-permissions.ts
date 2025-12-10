/**
 * Permission requirement for a route
 */
export interface PermissionRequirement {
  resource: string;  // Matches backend PermissionResourceType
  action: string;    // Matches backend PermissionActionType
}

/**
 * Maps routes to required permissions
 * Route paths are relative (without /[role]/[businessUnit] prefix)
 */
export const routePermissions: Record<string, PermissionRequirement> = {
  // ========================================
  // DASHBOARD & OVERVIEW
  // ========================================
  "/": { resource: "analytics", action: "view" },
  "/overview": { resource: "analytics", action: "view" },
  
  // ========================================
  // PRODUCTS
  // ========================================
  "/products": { resource: "product", action: "view" },
  "/products/add": { resource: "product", action: "create" },
  "/products/edit": { resource: "product", action: "update" },
  
  // ========================================
  // CATALOG
  // ========================================
  "/catalog": { resource: "product", action: "view" },
  "/catalog/product": { resource: "product", action: "view" },
  "/catalog/product/add": { resource: "product", action: "create" },
  "/catalog/product/edit": { resource: "product", action: "update" },
  "/catalog/category": { resource: "category", action: "view" },
  "/catalog/sub-category": { resource: "category", action: "view" },
  "/catalog/child-category": { resource: "category", action: "view" },
  "/catalog/brand": { resource: "brand", action: "view" },
  "/catalog/unit": { resource: "product", action: "view" }, // mapped to product
  "/catalog/tax": { resource: "system", action: "view" }, // mapped to system
  
  // ========================================
  // SALES & POS
  // ========================================
  "/sales": { resource: "order", action: "view" },
  "/pos": { resource: "order", action: "create" },
  "/quick-sales": { resource: "order", action: "create" },
  "/today": { resource: "order", action: "view" },
  "/my-sales": { resource: "order", action: "view" },
  
  // ========================================
  // INVENTORY
  // ========================================
  "/inventory": { resource: "inventory", action: "view" },
  "/inventory/add": { resource: "inventory", action: "create" },
  "/inventory/adjust": { resource: "inventory", action: "update" },
  
  // ========================================
  // PURCHASES
  // ========================================
  "/purchases": { resource: "inventory", action: "view" }, // mapped to inventory as purchase missing
  "/purchases/add": { resource: "inventory", action: "create" },
  
  // ========================================
  // CUSTOMERS & CONTACTS
  // ========================================
  "/customers": { resource: "customer", action: "view" },
  "/contacts/customer": { resource: "customer", action: "view" },
  
  // ========================================
  // SUPPLIERS
  // ========================================
  "/suppliers": { resource: "supplier", action: "view" },
  "/contacts/suppliers": { resource: "supplier", action: "view" },
  
  // ========================================
  // STAFF & USER MANAGEMENT
  // ========================================
  "/staff": { resource: "user", action: "view" },
  "/user-management": { resource: "user", action: "view" },
  "/user-management/all-users": { resource: "user", action: "view" },
  "/user-management/add-user": { resource: "user", action: "create" },
  "/user-management/roles-permissions": { resource: "role", action: "view" },
  
  // ========================================
  // REPORTS
  // ========================================
  "/reports": { resource: "report", action: "view" },
  
  // ========================================
  // SETTINGS
  // ========================================
  "/settings": { resource: "system", action: "view" },
  
  // ========================================
  // BUSINESS UNITS (Super Admin Only)
  // ========================================
  "/business-unit": { resource: "businessUnit", action: "view" },
  "/business-units": { resource: "businessUnit", action: "view" },
  "/business-units/new": { resource: "businessUnit", action: "create" },
  "/business-units/analytics": { resource: "businessUnit", action: "view" },
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
