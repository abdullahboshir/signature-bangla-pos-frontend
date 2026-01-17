import {
  isSuperAdmin as checkIsSuperAdminHelper,
  isOrganizationOwner,
} from "@/config/auth-constants";

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
  globalRoles?: (UserRole | string)[]; // Added support for globalRoles
  role?: string[]; // 🟢 Added handling for backend's flat role array
  permissions?: {
    role?: {
      permissions?: (UserPermission | string)[];
    };
  }[];
}

/**
 * Check if user is Super Admin
 */
export const checkIsSuperAdmin = (
  user: UserData | null | undefined
): boolean => {
  if (!user) return false;

  // 1. Direct property check
  if (user.isSuperAdmin) return true;

  // 2. Check globalRoles
  if (
    user.globalRoles?.some((r: any) =>
      checkIsSuperAdminHelper(typeof r === "string" ? r : r.slug || r.name)
    )
  ) {
    return true;
  }

  // 3. Check roles (legacy/scoped)
  if (
    user.roles?.some((r: any) =>
      checkIsSuperAdminHelper(typeof r === "string" ? r : r.slug || r.name)
    )
  ) {
    return true;
  }

  return false;
};

/**
 * Core permission check logic
 * Supports both:
 * - Legacy: nested permissions via roles
 * - Modern: flattened string array ["product:create", "product:update"] in effectivePermissions
 */
export const checkPermission = (
  user: UserData | null | undefined,
  permissionCode: string
): boolean => {
  if (!user) return false;

  // 1. Super Admin or Organization Owner Bypass
  // Organization Owners typically need full access to their organization's resources
  const allRoles = [
    ...(user.roles || []),
    ...(user.globalRoles || []),
    ...(user.role || []), // Handle flat role array from backend
  ].map((r: any) => (typeof r === "string" ? r : r.slug || r.name));

  if (checkIsSuperAdmin(user) || isOrganizationOwner(allRoles)) return true;

  // 2. Check Modern Effective Permissions (Priority)
  if (user.effectivePermissions && Array.isArray(user.effectivePermissions)) {
    return user.effectivePermissions.includes(permissionCode);
  }

  // 3. Fallback: Check if flattened permissions in 'permissions' (string[])
  if (
    user.permissions &&
    Array.isArray(user.permissions) &&
    typeof user.permissions[0] === "string"
  ) {
    return (user.permissions as string[]).includes(permissionCode);
  }

  // 4. Fallback: Check Role-based Permissions (legacy nested structure)
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.some((assignment: any) => {
      const rolePerms = assignment.role?.permissions || [];
      return rolePerms.some((p: any) => {
        const pCode = typeof p === "string" ? p : p.name;
        return pCode === permissionCode;
      });
    });
  }

  return false;
};

export const checkAnyPermission = (
  user: UserData | null | undefined,
  permissions: string[]
): boolean => {
  return permissions.some((p) => checkPermission(user, p));
};

export const checkAllPermissions = (
  user: UserData | null | undefined,
  permissions: string[]
): boolean => {
  return permissions.every((p) => checkPermission(user, p));
};
