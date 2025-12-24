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
  STOCK_TRANSFER: "stockTransfer",
  ADJUSTMENT: "stockAdjustment",
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
} as const;

export const ACTION_KEYS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
  MANAGE: "MANAGE",
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
