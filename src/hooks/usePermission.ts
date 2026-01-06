
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

/**
 * Hook to check user permissions efficiently.
 * Uses the 'effectivePermissions' pre-calculated by the backend.
 */
export function usePermission() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    return user?.effectivePermissions || [];
  }, [user]);

  /**
   * Check if user has permission to perform action on resource.
   * @param resource - Resource name (e.g., 'product', 'order')
   * @param action - Action name (e.g., 'create', 'read', 'update', 'delete')
   * @returns boolean
   */
  const can = (resource: string, action: string): boolean => {
    // Super Admin Bypass
    if (user?.isSuperAdmin) return true;

    if (!permissions.length) return false;

    // Handle String Format (New Backend Standard: "resource:action")
    if (typeof permissions[0] === 'string') {
      const key = `${resource}:${action}`;
      // Also allow wildcard action match if backend supports it (e.g. "product:*") - Optional
      // For now, exact match logic:
      return permissions.includes(key);
    }

    // Handle Object Format (Legacy/Fallback)
    const matching = permissions.filter((p: any) => 
      p.resource === resource && 
      p.action === action && 
      p.isActive
    );

    if (!matching.length) return false;

    // Sort by priority (descending)
    matching.sort((a: any, b: any) => (b.resolver?.priority ?? 0) - (a.resolver?.priority ?? 0));
    
    const maxPriority = matching[0].resolver?.priority ?? 0;
    const topPerms = matching.filter((p: any) => (p.resolver?.priority ?? 0) === maxPriority);

    // Explicit Deny in top priority wins
    if (topPerms.some((p: any) => p.effect === 'deny')) return false;

    // Explicit Allow wins
    if (topPerms.some((p: any) => p.effect === 'allow')) return true;

    return false;
  };

  /**
   * Check Data Access Limit for a resource
   * @param resource 'products' | 'orders' | 'customers'
   * @returns number (0 = unlimited, >0 = limit)
   */
  const getLimit = (resource: 'products' | 'orders' | 'customers'): number => {
    if (user?.isSuperAdmin) return 0;
    return user?.maxDataAccess?.[resource] ?? -1; // -1 or 0 default? Backend defaults to 0 if unlimited.
  };

  return { can, getLimit, permissions };
}
