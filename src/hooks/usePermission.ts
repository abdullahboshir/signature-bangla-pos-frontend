
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

    // Find matching permission
    // Since backend already sends 'effectivePermissions' which are ALLOWED,
    // we just need to check if an entry exists for this resource/action.
    // However, backend validation is complex (conditions, etc).
    // For frontend UI toggle, a simple existence check of an 'allow' permission is usually enough.
    // BUT wait, backend returns a list of PERMISSIONS (definitions), not just "allowed actions".
    // We need to check if there is an active permission with effect='allow'.
    
    // NOTE: The backend 'getAuthorizationContext' returns ALL permissions assigned to the user.
    // Use the same logic as backend 'resolvePermissions' (simplified) or trust that backend sends valid ones?
    // Actually, backend sends definitions. We must evaluate them.
    // Frontend evaluation is lighter:
    // 1. Filter by resource/action.
    // 2. Sort by priority.
    // 3. Check deny/allow.
    
    const matching = permissions.filter(p => 
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
