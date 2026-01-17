
import { useAuth } from "@/hooks/useAuth";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useMemo } from "react";
import { isOrganizationOwner, USER_ROLES } from "@/config/auth-constants";

export function usePermission() {
  const { user } = useAuth();
  const { currentRole } = useCurrentRole();

  const permissions = useMemo(() => {
    return user?.effectivePermissions || [];
  }, [user]);


  const can = (resource: string, action: string): boolean => {
    if (user?.isSuperAdmin) return true;

    const isOwnerRole = isOrganizationOwner(currentRole) || currentRole === USER_ROLES.COMPANY_OWNER || currentRole === 'owner';
    const hasOwnerScope = (user?.businessAccess || []).some((acc: any) => acc.scope === 'COMPANY');
        
    if (isOwnerRole || hasOwnerScope) return true;

    if (!permissions.length) return false;

    if (typeof permissions[0] === 'string') {
      const key = `${resource}:${action}`;
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

  const getLimit = (resource: 'products' | 'orders' | 'customers'): number => {
    if (user?.isSuperAdmin) return 0;
    return user?.maxDataAccess?.[resource] ?? -1;
  };

  return { can, getLimit, permissions };
}
