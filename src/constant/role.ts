export const USER_ROLE = {
  superAdmin: "superAdmin",
  admin: "admin",
  manager: "manager",
  customer: "customer", 
  guest: "guest",
} as const;

export const RoleScope = {
  GLOBAL: "GLOBAL",
  BUSINESS: "BUSINESS",
  OUTLET: "OUTLET"
} as const;

export type RoleScopeType = keyof typeof RoleScope;
