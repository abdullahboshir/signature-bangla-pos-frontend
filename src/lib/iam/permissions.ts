

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
 * - Modern: flattened string array ["product.create", "product.update"]
 */
export const checkPermission = (user: UserData | null | undefined, permissionCode: string): boolean => {
  if (!user) return false;

  // 1. Super Admin Bypass
  if (checkIsSuperAdmin(user)) return true;

  if (!user.permissions) return false;

  // 2. Check if flattened permissions (string[])
  if (Array.isArray(user.permissions) && typeof user.permissions[0] === 'string') {
    return (user.permissions as string[]).includes(permissionCode);
  }

  // 3. Check Role-based Permissions (legacy nested structure)
  return user.permissions.some((assignment: any) => {
      const rolePerms = assignment.role?.permissions || [];
      return rolePerms.some((p: any) => {
           const pCode = typeof p === 'string' ? p : p.name;
           return pCode === permissionCode;
      });
  });
};

export const checkAnyPermission = (user: UserData | null | undefined, permissions: string[]): boolean => {
  return permissions.some(p => checkPermission(user, p));
};

export const checkAllPermissions = (user: UserData | null | undefined, permissions: string[]): boolean => {
  return permissions.every(p => checkPermission(user, p));
};
