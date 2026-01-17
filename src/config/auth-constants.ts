/**
 * SYSTEM ROLES (Static/Hardcoded)
 * These roles define the application's structural architecture.
 */
export const USER_ROLES = {
  // PLATFORM LEVEL (Global Scope)
  SUPER_ADMIN: "super-admin",
  PLATFORM_ADMIN: "platform-admin",
  PLATFORM_SUPPORT: "platform-support",
  PLATFORM_FINANCE: "platform-finance",
  PLATFORM_AUDITOR: "platform-auditor",
  PLATFORM_DEVOPS: "platform-devops",
  PLATFORM_ANALYST: "platform-analyst",
  PLATFORM_MARKETING: "platform-marketing",
  PLATFORM_LEGAL: "platform-legal",
  SYSTEM_INTEGRATION: "system-integration",

  // ORGANIZATION LEVEL (Organization/Tenant Scope)
  ORGANIZATION_OWNER: "organization-owner",

  // BUSINESS LEVEL (Business Unit Scope)
  ADMIN: "admin",
  MANAGER: "manager",
  OUTLET_MANAGER: "outlet-manager",

  // DEPARTMENT HEADS
  HR_MANAGER: "hr-manager",
  STORE_KEEPER: "store-keeper",
  PURCHASE_MANAGER: "purchase-manager",
  ASSET_MANAGER: "asset-manager",
  BUSINESS_ANALYST: "business-analyst",
  BUSINESS_FINANCE: "business-finance",
  ACCOUNTANT: "accountant",
  SHAREHOLDER: "shareholder",

  // FRONTLINE OPERATIONS
  CASHIER: "cashier",
  SALES_ASSOCIATE: "sales-associate",
  DELIVERY_MAN: "delivery-man",
  SUPPORT_AGENT: "support-agent",
  STAFF: "staff",

  // SERVICE SPECIFIC
  WAITER: "waiter",
  KITCHEN_STAFF: "kitchen-staff",
  PACKAGING_STAFF: "packaging-staff",

  // EXTERNAL
  VENDOR: "vendor",
  CUSTOMER: "customer",
  GUEST: "guest",
} as const;

/**
 * USER STATUSES
 */
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
  BLOCKED: "blocked",
} as const;

/**
 * ROLE SCOPES
 */
export const ROLE_SCOPE = {
  GLOBAL: "GLOBAL",
  ORGANIZATION: "ORGANIZATION",
  BUSINESS: "BUSINESS",
  OUTLET: "OUTLET",
} as const;

export type RoleScopeType = keyof typeof ROLE_SCOPE;

/**
 * @section HELPERS & NORMALIZATION
 */

/**
 * Normalizes any role, status, or slug string to a consistent format.
 * (lowercase, trimmed, underscores/spaces replaced with hyphens)
 */
export const normalizeAuthString = (val: string | null | undefined): string => {
  if (!val) return "";
  return val
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-");
};

/**
 * Flexible Comparison Helper
 */
export const matchesRole = (
  source: string | string[] | null | undefined,
  target: string | string[]
): boolean => {
  if (Array.isArray(source)) {
    return source.some((s) => matchesRole(s, target));
  }
  const normSource = normalizeAuthString(source);
  if (Array.isArray(target)) {
    return target.some((t) => normalizeAuthString(t) === normSource);
  }
  return normSource === normalizeAuthString(target);
};

/**
 * Specific Role Checkers
 */
export const isSuperAdmin = (
  role: string | string[] | null | undefined
): boolean => matchesRole(role, USER_ROLES.SUPER_ADMIN);

export const isOrganizationOwner = (
  role: string | string[] | null | undefined
): boolean => matchesRole(role, USER_ROLES.ORGANIZATION_OWNER);

export const isBusinessAdmin = (
  role: string | string[] | null | undefined
): boolean => matchesRole(role, [USER_ROLES.ADMIN, "business-admin"]);

export const isManager = (
  role: string | string[] | null | undefined
): boolean =>
  matchesRole(role, [USER_ROLES.MANAGER, USER_ROLES.OUTLET_MANAGER]);

/**
 * Common Role Groupings
 */
export const isPlatformLevel = (
  role: string | string[] | null | undefined
): boolean =>
  matchesRole(role, [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.PLATFORM_ADMIN,
    USER_ROLES.PLATFORM_SUPPORT,
    USER_ROLES.PLATFORM_FINANCE,
    USER_ROLES.PLATFORM_AUDITOR,
    USER_ROLES.PLATFORM_DEVOPS,
    USER_ROLES.PLATFORM_ANALYST,
    USER_ROLES.PLATFORM_MARKETING,
    USER_ROLES.PLATFORM_LEGAL,
    USER_ROLES.SYSTEM_INTEGRATION,
  ]);

export const isOperationalRole = (
  role: string | string[] | null | undefined
): boolean =>
  matchesRole(role, [
    USER_ROLES.CASHIER,
    USER_ROLES.SALES_ASSOCIATE,
    USER_ROLES.STAFF,
  ]);

/**
 * Status Check Helpers
 */
export const isActive = (status: string | null | undefined): boolean =>
  normalizeAuthString(status) === USER_STATUS.ACTIVE;

export const isBlocked = (status: string | null | undefined): boolean =>
  matchesRole(status, [USER_STATUS.BLOCKED, USER_STATUS.SUSPENDED]);
