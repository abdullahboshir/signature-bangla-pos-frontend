export const RESOURCE_KEYS = {
  // Business
  BUSINESS_UNIT: "businessUnit",
  OUTLET: "outlet",
  
  // Catalog
  PRODUCT: "product",
  CATEGORY: "category",
  BRAND: "brand",
  VARIANT: "variant",
  ATTRIBUTE: "attribute",
  UNIT: "unit",
  WARRANTY: "warranty",
  ATTRIBUTE_GROUP: "attributeGroup",
  TAX: "tax",

  // Sales
  ORDER: "order",
  CUSTOMER: "customer",
  RETURN: "return",
  SHIPPING: "shipping",
  DELIVERY: "delivery",
  
  // Inventory
  INVENTORY: "inventory",
  SUPPLIER: "supplier",
  PURCHASE: "purchase",
  TRANSFER: "transfer", // backend key
  STOCK_TRANSFER: "stockTransfer", // legacy or alias? Keeping both for now if needed, but 'transfer' is the new one
  WAREHOUSE: "warehouse",
  
  // HRM
  STAFF: "staff",
  DEPARTMENT: "department",
  DESIGNATION: "designation",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  PAYROLL: "payroll",
  ASSET: "asset",

  // Accounting
  ACCOUNT: "account",
  TRANSACTION: "transaction",
  PAYMENT: "payment",
  EXPENSE: "expense",
  EXPENSE_CATEGORY: "expenseCategory",
  BUDGET: "budget",

  // Vendors
  VENDOR: "vendor",
  PAYOUT: "payout",

  // POS
  TERMINAL: "terminal",
  CASH_REGISTER: "cashRegister",

  // System
  SYSTEM: "system",
  ANALYTICS: "analytics",
  NOTIFICATION: "notification",
  AUDIT_LOG: "auditLog",
  REPORT: "report",
  SALES_REPORT: "salesReport",
  PURCHASE_REPORT: "purchaseReport",
  STOCK_REPORT: "stockReport",
  PROFIT_LOSS_REPORT: "profitLossReport",
  FRAUD_DETECTION: "fraudDetection",
  SETTLEMENT: "settlement",
  USER: "user",
  ROLE: "role",
  PERMISSION: "permission",
  LANGUAGE: "language",
  CURRENCY: "currency",
  ZONE: "zone",
  BACKUP: "backup",
  API_KEY: "apiKey",
  WEBHOOK: "webhook",
  EMAIL_TEMPLATE: "emailTemplate",
  SMS_TEMPLATE: "smsTemplate",
  
  // Storefront
  WISHLIST: "wishlist",
  CART: "cart",
  THEME: "theme",
  PLUGIN: "plugin",
  SEO: "seo",

  // Others
  LOYALTY: "loyalty",
  SUBSCRIPTION: "subscription",
  REVIEW: "review",

  // Marketing
  PROMOTION: "promotion",
  COUPON: "coupon",
  AD_CAMPAIGN: "adCampaign",
  AFFILIATE: "affiliate",

  // Content
  CONTENT: "content",

  // Support
  TICKET: "ticket",
  CHAT: "chat",
  DISPUTE: "dispute",

  // Storefront
  STOREFRONT: "storefront",
  LANDING_PAGE: "landingPage",
  ABANDONED_CART: "abandonedCart",
  QUESTION: "question",

  // Logistics
  COURIER: "courier",
  PARCEL: "parcel",
  DRIVER: "driver",
  VEHICLE: "vehicle",

  // Risk & Fraud
  BLACKLIST: "blacklist",
  RISK_RULE: "riskRule",
  RISK_PROFILE: "riskProfile",
  
  // Marketing & Tools
  PIXEL: "pixel",
  EVENT: "event",
  AUDIENCE: "audience",

  // Finance
  INVOICE: "invoice",
  RECONCILIATION: "reconciliation",
  ADJUSTMENT: "adjustment", // Backend match
  
  // Dashboard
  DASHBOARD: "dashboard",
  GLOBAL: "global",
  
  // Platform/SaaS
  LICENSE: "license",
  FEATURE: "feature",
  INTEGRATION: "integration",
  
  // Governance
  GOVERNANCE_SHAREHOLDER: "shareholder",
  GOVERNANCE_VOTING: "voting",
  GOVERNANCE_MEETING: "meeting",
  GOVERNANCE_COMPLIANCE: "compliance",
} as const;

// Mapping of High-Level System Modules (Toggleable) to specific Resource Keys
// If a module is Disabled, these resources will be hidden.
// Mapping of High-Level System Modules (Toggleable) to specific Resource Keys
// If a module is Disabled, these resources will be hidden.
export const MODULE_RESOURCE_MAP: Record<string, string[]> = {
  pos: [RESOURCE_KEYS.TERMINAL, RESOURCE_KEYS.CASH_REGISTER],
  
  // ERP CORE (Includes: Products, Inventory, Finance, Logistics, Suppliers)
  erp: [
    // Inventory
    RESOURCE_KEYS.INVENTORY, RESOURCE_KEYS.PURCHASE, RESOURCE_KEYS.SUPPLIER, 
    RESOURCE_KEYS.WAREHOUSE, RESOURCE_KEYS.TRANSFER, RESOURCE_KEYS.STOCK_TRANSFER,
    RESOURCE_KEYS.ADJUSTMENT,
    // Finance
    RESOURCE_KEYS.ACCOUNT, RESOURCE_KEYS.TRANSACTION, RESOURCE_KEYS.PAYMENT, 
    RESOURCE_KEYS.EXPENSE, RESOURCE_KEYS.EXPENSE_CATEGORY, RESOURCE_KEYS.BUDGET, 
    RESOURCE_KEYS.TAX, RESOURCE_KEYS.INVOICE, RESOURCE_KEYS.RECONCILIATION,
    RESOURCE_KEYS.SETTLEMENT, RESOURCE_KEYS.PAYOUT,
    // Logistics
    RESOURCE_KEYS.COURIER, RESOURCE_KEYS.PARCEL, RESOURCE_KEYS.DRIVER, 
    RESOURCE_KEYS.VEHICLE, RESOURCE_KEYS.DELIVERY, RESOURCE_KEYS.SHIPPING
  ],

  hrm: [
    RESOURCE_KEYS.STAFF, RESOURCE_KEYS.DEPARTMENT, RESOURCE_KEYS.DESIGNATION, 
    RESOURCE_KEYS.ATTENDANCE, RESOURCE_KEYS.LEAVE, RESOURCE_KEYS.PAYROLL, 
    RESOURCE_KEYS.ASSET
  ],

  ecommerce: [
    RESOURCE_KEYS.STOREFRONT, RESOURCE_KEYS.THEME, RESOURCE_KEYS.PLUGIN, 
    RESOURCE_KEYS.SEO, RESOURCE_KEYS.WISHLIST, RESOURCE_KEYS.CART, 
    RESOURCE_KEYS.REVIEW, RESOURCE_KEYS.LANDING_PAGE, RESOURCE_KEYS.ABANDONED_CART,
    RESOURCE_KEYS.CONTENT
  ],

  // CRM SUITE (Includes: Support, Marketing, Customers)
  crm: [
    RESOURCE_KEYS.CUSTOMER, RESOURCE_KEYS.TICKET, RESOURCE_KEYS.CHAT, RESOURCE_KEYS.DISPUTE, 
    RESOURCE_KEYS.AUDIENCE, RESOURCE_KEYS.PIXEL, RESOURCE_KEYS.EVENT, RESOURCE_KEYS.LOYALTY,
    RESOURCE_KEYS.EMAIL_TEMPLATE, RESOURCE_KEYS.SMS_TEMPLATE,
    // Marketing
    RESOURCE_KEYS.PROMOTION, RESOURCE_KEYS.COUPON, RESOURCE_KEYS.AD_CAMPAIGN, 
    RESOURCE_KEYS.AFFILIATE
  ],

  integrations: [
    RESOURCE_KEYS.INTEGRATION, RESOURCE_KEYS.WEBHOOK, RESOURCE_KEYS.API_KEY
  ],

  saas: [
    RESOURCE_KEYS.SUBSCRIPTION, RESOURCE_KEYS.LICENSE, RESOURCE_KEYS.FEATURE
  ],

  governance: [
    RESOURCE_KEYS.GOVERNANCE_SHAREHOLDER, RESOURCE_KEYS.GOVERNANCE_VOTING, RESOURCE_KEYS.GOVERNANCE_MEETING,
    RESOURCE_KEYS.GOVERNANCE_COMPLIANCE
  ]
};

export const PLATFORM_RESOURCES = [
  RESOURCE_KEYS.SYSTEM,
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
  RESOURCE_KEYS.INTEGRATION
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
        `${resourceValue}:${actionValue.toLowerCase()}`
      ])
    )
  ])
) as Record<keyof typeof RESOURCE_KEYS, Record<keyof typeof ACTION_KEYS, string>>;

export const PERMISSION_SCOPES = {
  GLOBAL: "global",
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
  MANAGE_SYSTEM: PERMISSION_KEYS.SYSTEM.MANAGE,
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
  MANAGE_FEATURES: PERMISSION_KEYS.SYSTEM.MANAGE, // Feature flags are system-level
  MANAGE_LICENSES: PERMISSION_KEYS.SUBSCRIPTION.MANAGE, // License management
  
  // 🔔 Notifications (Platform-wide)
  MANAGE_NOTIFICATIONS: PERMISSION_KEYS.NOTIFICATION.MANAGE,
  CREATE_ANNOUNCEMENTS: PERMISSION_KEYS.NOTIFICATION.CREATE,
  
  // 🔌 Integrations (Global services)
  MANAGE_INTEGRATIONS: PERMISSION_KEYS.SYSTEM.MANAGE, // Third-party integrations
  
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

