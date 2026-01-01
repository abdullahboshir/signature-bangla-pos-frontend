

export interface UserPermission {
  action: string;
  resource: string;
  name?: string; // Some legacy structures might have name
  code?: string; // Some legacy structures might have code
}

export interface UserRole {
  name: string;
  slug?: string;
  permissions: UserPermission[] | string[]; 
}

export interface UserData {
  isSuperAdmin?: boolean;
  effectivePermissions?: string[]; // 🟢 Added effectivePermissions support
  roles?: (UserRole | string)[];
  permissions?: {
      role?: {
          permissions?: (UserPermission | string)[];
      }
  }[];
}

/**
 * Check if user is Super Admin
 */
export const checkIsSuperAdmin = (user: UserData | null | undefined): boolean => {
  if (!user) return false;
  return !!(
    user.isSuperAdmin || 
    user.roles?.some((r: any) => 
      (typeof r === 'string' && r === 'super-admin') || 
      (r?.name === 'super-admin') || 
      (r?.slug === 'super-admin')
    )
  );
};

/**
 * Core permission check logic
 * Supports both:
 * - Legacy: nested permissions via roles
 * - Modern: flattened string array ["product:create", "product:update"] in effectivePermissions
 */
export const checkPermission = (user: UserData | null | undefined, permissionCode: string): boolean => {
  if (!user) return false;

  // 1. Super Admin Bypass
  if (checkIsSuperAdmin(user)) return true;

  // 2. Check Modern Effective Permissions (Priority)
  if (user.effectivePermissions && Array.isArray(user.effectivePermissions)) {
    return user.effectivePermissions.includes(permissionCode);
  }

  // 3. Fallback: Check if flattened permissions in 'permissions' (string[])
  if (user.permissions && Array.isArray(user.permissions) && typeof user.permissions[0] === 'string') {
    return (user.permissions as string[]).includes(permissionCode);
  }

  // 4. Fallback: Check Role-based Permissions (legacy nested structure)
  if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.some((assignment: any) => {
          const rolePerms = assignment.role?.permissions || [];
          return rolePerms.some((p: any) => {
               const pCode = typeof p === 'string' ? p : p.name;
               return pCode === permissionCode;
          });
      });
  }

  return false;
};

export const checkAnyPermission = (user: UserData | null | undefined, permissions: string[]): boolean => {
  return permissions.some(p => checkPermission(user, p));
};

export const checkAllPermissions = (user: UserData | null | undefined, permissions: string[]): boolean => {
  return permissions.every(p => checkPermission(user, p));
};
