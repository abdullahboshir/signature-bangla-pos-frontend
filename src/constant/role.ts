export const USER_ROLE = {
  // ========================================================================
  // 1. PLATFORM LEVEL (Global Scope)
  // These roles manage the SaaS system itself, not specific businesses.
  // ========================================================================
  superAdmin: 'super-admin',
  platformAdmin: 'platform-admin',
  platformSupport: 'platform-support',
  platformFinance: 'platform-finance',
  platformAuditor: 'platform-auditor',
  platformDevops: 'platform-devops',
  platformAnalyst: 'platform-analyst',
  platformMarketing: 'platform-marketing',
  platformLegal: 'platform-legal',
  systemIntegration: 'system-integration', 

  // ========================================================================
  // 2. COMPANY LEVEL (Tenant/Group Scope)
  // These roles manage the entire company/holding group across all business units.
  // ========================================================================
  companyOwner: 'company-owner', // Group Chairman/MD - manages entire company

  // ========================================================================
  // 3. BUSINESS LEVEL (Business Unit Scope)
  // These roles operate WITHIN a specific Business Unit (vertical).
  // ========================================================================
  // Core Management
  admin: 'admin',            // The Business Unit Owner / Main Administrator
  manager: 'manager',        // Operations Manager (General)
  outletManager: 'outlet-manager', // Specific Outlet Manager

  // Department Heads
  hrManager: 'hr-manager',
  storeKeeper: 'store-keeper',
  purchaseManager: 'purchase-manager',
  assetManager: 'asset-manager',
  businessAnalyst: 'business-analyst',
  businessFinance: 'business-finance',
  accountant: 'accountant',
  shareholder: 'shareholder', // Governance - can be at Company/Business/Outlet level


  // Frontline / Outlet Operations
  cashier: 'cashier',
  salesAssociate: 'sales-associate',
  deliveryMan: 'delivery-man',
  supportAgent: 'support-agent', // Business-level support staff
  staff: 'staff',

  // Hospitality / Service Specific
  waiter: 'waiter',
  kitchenStaff: 'kitchen-staff',
  packagingStaff: 'packaging-staff',

  // ========================================================================
  // 4. EXTERNAL / END USERS
  // ========================================================================
  vendor: 'vendor',
  customer: 'customer',
  guest: 'guest',
} as const;

export const RoleScope = {
  GLOBAL: "GLOBAL",
  COMPANY: "COMPANY",   // Tenant/Group level
  BUSINESS: "BUSINESS",
  OUTLET: "OUTLET"
} as const;

export type RoleScopeType = keyof typeof RoleScope;
