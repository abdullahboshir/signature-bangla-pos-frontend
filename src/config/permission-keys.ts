export const RESOURCE_KEYS = {
  // Business
  // Platform & Infrastructure
  BUSINESS_UNIT: "businessUnit",
  SYSTEM_CONFIG: "systemConfig",
  PLATFORM_SETTING: "platformSetting",
  ORGANIZATION_SETTING: "organizationSetting",
  BUSINESS_SETTING: "businessSetting",
  OUTLET_SETTING: "outletSetting",
  BACKUP: "backup",
  AUDIT_LOG: "auditLog",
  API_KEY: "apiKey",
  WEBHOOK: "webhook",
  THEME: "theme",
  PLUGIN: "plugin",
  LANGUAGE: "language",
  CURRENCY: "currency",
  ZONE: "zone",
  BLACKLIST: "blacklist",
  FEATURE: "feature",
  INTEGRATION: "integration",

  // Core Commerce
  PRODUCT: "product",
  CATEGORY: "category",
  BRAND: "brand",
  VARIANT: "variant",
  ATTRIBUTE: "attribute",
  ATTRIBUTE_GROUP: "attributeGroup",
  UNIT: "unit",
  TAX: "tax",
  WARRANTY: "warranty",

  // Sales & Orders
  ORDER: "order",
  QUOTATION: "quotation",
  INVOICE: "invoice",
  RETURN: "return",
  REVIEW: "review",
  COUPON: "coupon",
  PROMOTION: "promotion",
  ABANDONED_CART: "abandonedCart",
  CONTENT: "content",

  // Customers & Users
  CUSTOMER: "customer",
  USER: "user",
  ROLE: "role",
  PERMISSION: "permission",
  AUTH: "auth",
  WISHLIST: "wishlist",
  CART: "cart",

  // Inventory & Supply
  INVENTORY: "inventory",
  WAREHOUSE: "warehouse",
  PURCHASE: "purchase",
  SUPPLIER: "supplier",
  VENDOR: "vendor",
  ADJUSTMENT: "adjustment",
  TRANSFER: "transfer",

  // Outlet / POS
  OUTLET: "outlet",
  STOREFRONT: "storefront",
  TERMINAL: "terminal",
  CASH_REGISTER: "cashRegister",

  // Finance & Accounting
  ACCOUNT: "account",
  TRANSACTION: "transaction",
  PAYMENT: "payment",
  BUDGET: "budget",
  SETTLEMENT: "settlement",
  PAYOUT: "payout",
  RECONCILIATION: "reconciliation",
  EXPENSE: "expense",
  EXPENSE_CATEGORY: "expenseCategory",

  // Logistics & Delivery
  SHIPPING: "shipping",
  COURIER: "courier",
  DELIVERY: "delivery",
  PARCEL: "parcel",
  DRIVER: "driver",
  VEHICLE: "vehicle",
  TRACK: "track",
  DISPATCH: "dispatch",

  // Reports & Analytics
  REPORT: "report",
  ANALYTICS_REPORT: "analyticsReport",
  SALES_REPORT: "salesReport",
  PURCHASE_REPORT: "purchaseReport",
  STOCK_REPORT: "stockReport",
  PROFIT_LOSS_REPORT: "profitLossReport",
  DASHBOARD: "dashboard",

  // HRM & Payroll
  STAFF: "staff",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  PAYROLL: "payroll",
  DEPARTMENT: "department",
  DESIGNATION: "designation",
  ASSET: "asset",

  // Marketing & Growth
  AFFILIATE: "affiliate",
  AD_CAMPAIGN: "adCampaign",
  LOYALTY: "loyalty",
  SUBSCRIPTION: "subscription",
  AUDIENCE: "audience",
  PIXEL: "pixel",
  EVENT: "event",
  LANDING_PAGE: "landingPage",
  SEO: "seo",

  // Communication & Support
  NOTIFICATION: "notification",
  CHAT: "chat",
  EMAIL_TEMPLATE: "emailTemplate",
  SMS_TEMPLATE: "smsTemplate",
  TICKET: "ticket",
  DISPUTE: "dispute",
  QUESTION: "question",

  // Automation & Risk
  AUTOMATION: "automation",
  WORKFLOW: "workflow",
  FRAUD_DETECTION: "fraudDetection",
  RISK_RULE: "riskRule",
  RISK_PROFILE: "riskProfile",

  // Governance & Compliance
  SHAREHOLDER: "shareholder",
  MEETING: "meeting",
  VOTING: "voting",
  COMPLIANCE: "compliance",
  LICENSE: "license",

  // Global Contexts
  GLOBAL: "global",
} as const;

// Mapping of High-Level System Modules (Toggleable) to specific Resource Keys
// If a module is Disabled, these resources will be hidden.
// Mapping of High-Level System Modules (Toggleable) to specific Resource Keys
// If a module is Disabled, these resources will be hidden.
export const MODULE_RESOURCE_MAP: Record<string, string[]> = {
  iam: [
    RESOURCE_KEYS.AUTH,
    RESOURCE_KEYS.USER,
    RESOURCE_KEYS.ROLE,
    RESOURCE_KEYS.PERMISSION,
  ],
  pos: [
    RESOURCE_KEYS.TERMINAL,
    RESOURCE_KEYS.CASH_REGISTER,
    RESOURCE_KEYS.STOREFRONT,
    RESOURCE_KEYS.CART,
    RESOURCE_KEYS.WISHLIST,
    RESOURCE_KEYS.ABANDONED_CART,
    RESOURCE_KEYS.OUTLET,
    RESOURCE_KEYS.OUTLET_SETTING,
  ],

  // ERP CORE (Includes: Products, Inventory, Finance, Logistics, Suppliers)
  erp: [
    // Inventory
    RESOURCE_KEYS.INVENTORY,
    RESOURCE_KEYS.PURCHASE,
    RESOURCE_KEYS.SUPPLIER,
    RESOURCE_KEYS.WAREHOUSE,
    RESOURCE_KEYS.TRANSFER,
    RESOURCE_KEYS.ADJUSTMENT,
    // Finance
    RESOURCE_KEYS.ACCOUNT,
    RESOURCE_KEYS.TRANSACTION,
    RESOURCE_KEYS.PAYMENT,
    RESOURCE_KEYS.EXPENSE,
    RESOURCE_KEYS.EXPENSE_CATEGORY,
    RESOURCE_KEYS.BUDGET,
    RESOURCE_KEYS.TAX,
    RESOURCE_KEYS.INVOICE,
    RESOURCE_KEYS.RECONCILIATION,
    RESOURCE_KEYS.SETTLEMENT,
    RESOURCE_KEYS.PAYOUT,
    // Risk & Automation
    RESOURCE_KEYS.FRAUD_DETECTION,
    RESOURCE_KEYS.RISK_RULE,
    RESOURCE_KEYS.RISK_PROFILE,
    RESOURCE_KEYS.AUTOMATION,
    RESOURCE_KEYS.WORKFLOW,
  ],

  logistics: [
    RESOURCE_KEYS.COURIER,
    RESOURCE_KEYS.PARCEL,
    RESOURCE_KEYS.DRIVER,
    RESOURCE_KEYS.VEHICLE,
    RESOURCE_KEYS.DELIVERY,
    RESOURCE_KEYS.SHIPPING,
  ],

  hrm: [
    RESOURCE_KEYS.STAFF,
    RESOURCE_KEYS.DEPARTMENT,
    RESOURCE_KEYS.DESIGNATION,
    RESOURCE_KEYS.ATTENDANCE,
    RESOURCE_KEYS.LEAVE,
    RESOURCE_KEYS.PAYROLL,
    RESOURCE_KEYS.ASSET,
  ],

  ecommerce: [
    RESOURCE_KEYS.THEME,
    RESOURCE_KEYS.PLUGIN,
    RESOURCE_KEYS.SEO,
    RESOURCE_KEYS.REVIEW,
    RESOURCE_KEYS.LANDING_PAGE,
    RESOURCE_KEYS.CONTENT,
    RESOURCE_KEYS.QUESTION,
  ],

  // CRM SUITE (Includes: Support, Marketing, Customers)
  crm: [
    RESOURCE_KEYS.CUSTOMER,
    RESOURCE_KEYS.TICKET,
    RESOURCE_KEYS.CHAT,
    RESOURCE_KEYS.DISPUTE,
    RESOURCE_KEYS.AUDIENCE,
    RESOURCE_KEYS.PIXEL,
    RESOURCE_KEYS.EVENT,
    RESOURCE_KEYS.LOYALTY,
    // Marketing
    RESOURCE_KEYS.PROMOTION,
    RESOURCE_KEYS.COUPON,
    RESOURCE_KEYS.AD_CAMPAIGN,
    RESOURCE_KEYS.AFFILIATE,
  ],

  integrations: [
    RESOURCE_KEYS.INTEGRATION,
    RESOURCE_KEYS.WEBHOOK,
    RESOURCE_KEYS.API_KEY,
  ],

  saas: [
    RESOURCE_KEYS.SUBSCRIPTION,
    RESOURCE_KEYS.LICENSE,
    RESOURCE_KEYS.FEATURE,
  ],

  platform: [RESOURCE_KEYS.BUSINESS_UNIT, RESOURCE_KEYS.PLATFORM_SETTING],

  governance: [
    RESOURCE_KEYS.SHAREHOLDER,
    RESOURCE_KEYS.VOTING,
    RESOURCE_KEYS.MEETING,
    RESOURCE_KEYS.COMPLIANCE,
  ],

  system: [
    RESOURCE_KEYS.SYSTEM_CONFIG,
    RESOURCE_KEYS.ORGANIZATION_SETTING,
    RESOURCE_KEYS.BUSINESS_SETTING,
    RESOURCE_KEYS.OUTLET_SETTING,
    RESOURCE_KEYS.BACKUP,
    RESOURCE_KEYS.AUDIT_LOG,
    RESOURCE_KEYS.LANGUAGE,
    RESOURCE_KEYS.CURRENCY,
    RESOURCE_KEYS.ZONE,
    RESOURCE_KEYS.BLACKLIST,
    RESOURCE_KEYS.NOTIFICATION,
    RESOURCE_KEYS.GLOBAL,
    RESOURCE_KEYS.DASHBOARD,
    RESOURCE_KEYS.REPORT,
    RESOURCE_KEYS.ANALYTICS_REPORT,
    RESOURCE_KEYS.EMAIL_TEMPLATE,
    RESOURCE_KEYS.SMS_TEMPLATE,
  ],
};

export const PLATFORM_RESOURCES = [
  RESOURCE_KEYS.SYSTEM_CONFIG,
  RESOURCE_KEYS.GLOBAL,
  RESOURCE_KEYS.API_KEY,
  RESOURCE_KEYS.WEBHOOK,
  RESOURCE_KEYS.BACKUP,
  RESOURCE_KEYS.AUDIT_LOG,
  RESOURCE_KEYS.SUBSCRIPTION,
  RESOURCE_KEYS.PLUGIN,
  RESOURCE_KEYS.THEME,
  RESOURCE_KEYS.LICENSE,
  RESOURCE_KEYS.FEATURE,
  RESOURCE_KEYS.INTEGRATION,
];

export const ACTION_KEYS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  IMPORT: "import",
  EXPORT: "export",
  MANAGE: "manage",
  VIEW: "view",
  BLOCK: "block",
  RESTRICT: "restrict",
  ADJUST: "adjust",
  TRACK: "track",

  // Workflow Actions
  APPROVE: "approve",
  REJECT: "reject",
  CANCEL: "cancel",
  VERIFY: "verify",
  ESCALATE: "escalate",
  RESOLVE: "resolve",
  HOLD: "hold",
  RELEASE: "release",

  // Security/Control
  LOCK: "lock",
  UNLOCK: "unlock",
  EXECUTE: "execute",
  CONTROL: "control",

  // Fulfillment
  SHIP: "ship",
  DISPATCH: "dispatch",
  DELIVER: "deliver",
  REFUND: "refund",

  // Content/System
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  SYNC: "sync",
  SCHEDULE: "schedule",
  ASSIGN: "assign",
  PRINT: "print",
  DOWNLOAD: "download",
  REPLY: "reply",
} as const;

// Helper to generate permission codes (e.g., USER.CREATE -> "USER_CREATE")
export const PERMISSION_KEYS = Object.fromEntries(
  Object.entries(RESOURCE_KEYS).map(([key, resourceValue]) => [
    key,
    Object.fromEntries(
      Object.entries(ACTION_KEYS).map(([actionKey, actionValue]) => [
        actionKey,
        `${resourceValue}:${actionValue.toLowerCase()}`,
      ])
    ),
  ])
) as Record<
  keyof typeof RESOURCE_KEYS,
  Record<keyof typeof ACTION_KEYS, string>
>;

export const PERMISSION_SCOPES = {
  GLOBAL: "global",
  ORGANIZATION: "organization",
  BUSINESS: "business",
  VENDOR: "vendor",
  OUTLET: "outlet",
  CATEGORY: "category",
  REGION: "region",
  BUSINESS_UNIT: "businessUnit",
  TEAM: "team",
  BRANCH: "branch",
  WAREHOUSE: "warehouse",
  DEPARTMENT: "department",
  SELF: "self",
  CHANNEL: "channel",
  SEGMENT: "segment",
  IP: "ip",
  DEVICE: "device",
  // Anomalous/Advanced Scopes present in Backend
  BETWEEN: "between",
  REGEX: "regex",
  LIKE: "like",
} as const;

export const PERMISSION_OPERATORS = {
  EQ: "eq",
  NEQ: "neq",
  GT: "gt",
  GTE: "gte",
  LT: "lt",
  LTE: "lte",
  IN: "in",
  NOT_IN: "not-in",
  CONTAINS: "contains",
  STARTS_WITH: "starts-with",
  ENDS_WITH: "ends-with",
  BETWEEN: "between",
  REGEX: "regex",
  LIKE: "like",
} as const;

export const PERMISSION_EFFECTS = {
  ALLOW: "allow",
  DENY: "deny",
} as const;

export const PERMISSION_STRATEGIES = {
  FIRST_MATCH: "first-match",
  MOST_SPECIFIC: "most-specific",
  PRIORITY_BASED: "priority-based",
  CUMULATIVE: "cumulative",
} as const;

// =====================================================================================
// ENTERPRISE PERMISSION GROUPS (Platform vs Business)
// =====================================================================================

// 1. PLATFORM PERMISSIONS (Super Admin / System Level)
// These define what can be done at the SaaS/Global level.
export const PLATFORM_PERMISSIONS = {
  // Business Unit Management
  MANAGE_BUSINESS_UNITS: PERMISSION_KEYS.BUSINESS_UNIT.MANAGE,
  CREATE_BUSINESS_UNIT: PERMISSION_KEYS.BUSINESS_UNIT.CREATE,
  VIEW_BUSINESS_UNITS: PERMISSION_KEYS.BUSINESS_UNIT.READ,

  // System Configuration
  MANAGE_SYSTEM: PERMISSION_KEYS.SYSTEM_CONFIG.MANAGE,
  VIEW_AUDIT_LOGS: PERMISSION_KEYS.AUDIT_LOG.VIEW,
  MANAGE_API_KEYS: PERMISSION_KEYS.API_KEY.MANAGE,
  MANAGE_WEBHOOKS: PERMISSION_KEYS.WEBHOOK.MANAGE,
  MANAGE_BACKUPS: PERMISSION_KEYS.BACKUP.MANAGE,

  // Platform User Management (Global)
  MANAGE_PLATFORM_USERS: PERMISSION_KEYS.USER.MANAGE, // Scope: Global
  MANAGE_PLATFORM_ROLES: PERMISSION_KEYS.ROLE.MANAGE, // Scope: Global

  // Subscription & Billing (SaaS)
  MANAGE_SUBSCRIPTIONS: PERMISSION_KEYS.SUBSCRIPTION.MANAGE,
  VIEW_INVOICES: PERMISSION_KEYS.INVOICE.VIEW, // SaaS Invoices

  // 📦 Packages & Licensing (SaaS)
  MANAGE_PACKAGES: PERMISSION_KEYS.SUBSCRIPTION.MANAGE, // Using subscription as package proxy
  MANAGE_FEATURES: PERMISSION_KEYS.FEATURE.MANAGE, // Feature flags are system-level
  MANAGE_LICENSES: PERMISSION_KEYS.LICENSE.MANAGE, // License management

  // 🔔 Notifications (Platform-wide)
  MANAGE_NOTIFICATIONS: PERMISSION_KEYS.NOTIFICATION.MANAGE,
  CREATE_ANNOUNCEMENTS: PERMISSION_KEYS.NOTIFICATION.CREATE,

  // 🔌 Integrations (Global services)
  MANAGE_INTEGRATIONS: PERMISSION_KEYS.INTEGRATION.MANAGE, // Third-party integrations

  // Global Content/Marketing
  MANAGE_GLOBAL_THEMES: PERMISSION_KEYS.THEME.MANAGE,
} as const;

// 2. BUSINESS PERMISSIONS (Tenant / Business Unit Level)
// These define what distinct Business Units (Stores/Companies) can do.
export const BUSINESS_PERMISSIONS = {
  // Catalog
  MANAGE_PRODUCTS: PERMISSION_KEYS.PRODUCT.MANAGE,
  VIEW_PRODUCTS: PERMISSION_KEYS.PRODUCT.READ,
  MANAGE_CATEGORIES: PERMISSION_KEYS.CATEGORY.MANAGE,

  // Sales & Orders
  CREATE_ORDER: PERMISSION_KEYS.ORDER.CREATE,
  MANAGE_ORDERS: PERMISSION_KEYS.ORDER.MANAGE,
  VIEW_ORDERS: PERMISSION_KEYS.ORDER.READ,
  PROCESS_RETURNS: PERMISSION_KEYS.RETURN.MANAGE,

  // Inventory
  MANAGE_INVENTORY: PERMISSION_KEYS.INVENTORY.MANAGE,
  MANAGE_SUPPLIERS: PERMISSION_KEYS.SUPPLIER.MANAGE,
  CREATE_PURCHASE: PERMISSION_KEYS.PURCHASE.CREATE,

  // HRM & Staff
  MANAGE_STAFF: PERMISSION_KEYS.STAFF.MANAGE,
  MANAGE_PAYROLL: PERMISSION_KEYS.PAYROLL.MANAGE,
  MANAGE_ATTENDANCE: PERMISSION_KEYS.ATTENDANCE.MANAGE,

  // CRM
  MANAGE_CUSTOMERS: PERMISSION_KEYS.CUSTOMER.MANAGE,
  MANAGE_PROMOTIONS: PERMISSION_KEYS.PROMOTION.MANAGE,

  // Finance
  VIEW_FINANCIAL_REPORTS: PERMISSION_KEYS.REPORT.VIEW,
  MANAGE_EXPENSES: PERMISSION_KEYS.EXPENSE.MANAGE,

  // POS
  ACCESS_POS: PERMISSION_KEYS.TERMINAL.READ, // Minimal to open POS
} as const;
