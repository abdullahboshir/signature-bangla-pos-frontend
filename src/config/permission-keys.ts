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
} as const;

export const ACTION_KEYS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
  MANAGE: "MANAGE",
  VIEW: "VIEW", // Backend match
  BLOCK: "BLOCK",
  RESTRICT: "RESTRICT",
  ADJUST: "ADJUST",
  TRACK: "TRACK",
  
  // Workflow Actions
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  CANCEL: "CANCEL",
  VERIFY: "VERIFY",
  ESCALATE: "ESCALATE",
  
  // Fulfillment
  SHIP: "SHIP",
  DISPATCH: "DISPATCH",
  DELIVER: "DELIVER", // Backend doesn't have DELIVER action, but has DELIVERY resource. Backend has 'ship', 'dispatch', 'refund'.
  REFUND: "REFUND",
  
  // Content/System
  PUBLISH: "PUBLISH",
  UNPUBLISH: "UNPUBLISH",
  SYNC: "SYNC",
  SCHEDULE: "SCHEDULE",
  ASSIGN: "ASSIGN",
  PRINT: "PRINT",
  DOWNLOAD: "DOWNLOAD",
  REPLY: "REPLY",
} as const;

// Helper to generate permission codes (e.g., USER.CREATE -> "USER_CREATE")
export const PERMISSION_KEYS = Object.fromEntries(
  Object.entries(RESOURCE_KEYS).map(([key, resourceValue]) => [
    key,
    Object.fromEntries(
      Object.entries(ACTION_KEYS).map(([actionKey, actionValue]) => [
        actionKey,
        `${resourceValue.toUpperCase()}_${actionValue}`
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

