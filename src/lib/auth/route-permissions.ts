import { RESOURCE_KEYS, ACTION_KEYS } from "@/config/permission-keys";

/**
 * Permission requirement for a route
 */
export interface PermissionRequirement {
  resource: string;  // Matches backend PermissionResourceType
  action: string;    // Matches backend PermissionActionType
}

/**
 * Maps routes to required permissions
 * Route paths are relative (without /[role]/[businessUnit] prefix)
 */
export const routePermissions: Record<string, PermissionRequirement> = {
  // ========================================
  // DASHBOARD & OVERVIEW
  // ========================================
  // ========================================
  // DASHBOARD & OVERVIEW
  // ========================================
  "/": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.VIEW }, // Using Inventory View as fallback or Dashboard
  "/overview": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // PRODUCTS & CATALOG
  // ========================================
  "/products": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.VIEW },
  "/products/add": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.CREATE },
  "/products/edit": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.UPDATE },
  
  "/catalog": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.VIEW },
  "/catalog/product": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.VIEW },
  "/catalog/product/add": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.CREATE },
  "/catalog/product/edit": { resource: RESOURCE_KEYS.PRODUCT, action: ACTION_KEYS.UPDATE },
  "/catalog/category": { resource: RESOURCE_KEYS.CATEGORY, action: ACTION_KEYS.VIEW },
  "/catalog/sub-category": { resource: RESOURCE_KEYS.CATEGORY, action: ACTION_KEYS.VIEW },
  "/catalog/child-category": { resource: RESOURCE_KEYS.CATEGORY, action: ACTION_KEYS.VIEW },
  "/catalog/brand": { resource: RESOURCE_KEYS.BRAND, action: ACTION_KEYS.VIEW },
  "/catalog/variants": { resource: RESOURCE_KEYS.VARIANT, action: ACTION_KEYS.VIEW },
  "/catalog/attribute": { resource: RESOURCE_KEYS.ATTRIBUTE, action: ACTION_KEYS.VIEW },
  "/catalog/unit": { resource: RESOURCE_KEYS.UNIT, action: ACTION_KEYS.VIEW },
  "/catalog/tax": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // SALES & POS
  // ========================================
  "/sales": { resource: RESOURCE_KEYS.ORDER, action: ACTION_KEYS.VIEW },
  "/sales/all": { resource: RESOURCE_KEYS.ORDER, action: ACTION_KEYS.VIEW },
  "/sales/invoices": { resource: RESOURCE_KEYS.INVOICE, action: ACTION_KEYS.VIEW },
  "/pos": { resource: RESOURCE_KEYS.TERMINAL, action: ACTION_KEYS.CREATE }, // Access POS Terminal
  "/quick-sales": { resource: RESOURCE_KEYS.ORDER, action: ACTION_KEYS.CREATE },
  "/orders": { resource: RESOURCE_KEYS.ORDER, action: ACTION_KEYS.VIEW },

  // ========================================
  // INVENTORY
  // ========================================
  "/inventory": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.VIEW },
  "/inventory/add": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.CREATE },

  "/inventory/transfers": { resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
  "/inventory/warehouses": { resource: RESOURCE_KEYS.WAREHOUSE, action: ACTION_KEYS.VIEW },
  "/inventory/ledger": { resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.TRACK },
  
  // ========================================
  // PURCHASES
  // ========================================
  "/purchases": { resource: RESOURCE_KEYS.PURCHASE, action: ACTION_KEYS.VIEW },
  "/inventory/purchases": { resource: RESOURCE_KEYS.PURCHASE, action: ACTION_KEYS.VIEW },
  "/inventory/purchases/new": { resource: RESOURCE_KEYS.PURCHASE, action: ACTION_KEYS.CREATE },
  
  // ========================================
  // CUSTOMERS & CONTACTS
  // ========================================
  "/customers": { resource: RESOURCE_KEYS.USER, action: ACTION_KEYS.VIEW }, // Generic User or Specific Customer? Using User View for now
  "/contacts/customer": { resource: RESOURCE_KEYS.USER, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // SUPPLIERS
  // ========================================
  "/suppliers": { resource: RESOURCE_KEYS.SUPPLIER, action: ACTION_KEYS.VIEW },
  "/contacts/suppliers": { resource: RESOURCE_KEYS.SUPPLIER, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // VENDORS
  // ========================================
  "/vendors": { resource: RESOURCE_KEYS.VENDOR, action: ACTION_KEYS.VIEW },
  "/vendors/onboarding": { resource: RESOURCE_KEYS.VENDOR, action: ACTION_KEYS.CREATE },
  "/vendors/payouts": { resource: RESOURCE_KEYS.PAYOUT, action: ACTION_KEYS.MANAGE },

  // ========================================
  // LOGISTICS
  // ========================================
  "/logistics": { resource: RESOURCE_KEYS.DELIVERY, action: ACTION_KEYS.VIEW },
  "/logistics/courier": { resource: RESOURCE_KEYS.COURIER, action: ACTION_KEYS.MANAGE },
  "/logistics/parcels": { resource: RESOURCE_KEYS.PARCEL, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // MARKETING & ADS
  // ========================================
  "/marketing/campaigns": { resource: RESOURCE_KEYS.AD_CAMPAIGN, action: ACTION_KEYS.VIEW },
  "/marketing/coupons": { resource: RESOURCE_KEYS.COUPON, action: ACTION_KEYS.MANAGE },
  "/marketing/landings": { resource: RESOURCE_KEYS.LANDING_PAGE, action: ACTION_KEYS.MANAGE },
  "/marketing/pixels": { resource: RESOURCE_KEYS.PIXEL, action: ACTION_KEYS.MANAGE },
  "/marketing/audiences": { resource: RESOURCE_KEYS.AUDIENCE, action: ACTION_KEYS.MANAGE },

  // ========================================
  // RISK & FRAUD
  // ========================================
  "/risk": { resource: RESOURCE_KEYS.FRAUD_DETECTION, action: ACTION_KEYS.VIEW },
  "/risk/rules": { resource: RESOURCE_KEYS.RISK_RULE, action: ACTION_KEYS.MANAGE },
  "/risk/blacklist": { resource: RESOURCE_KEYS.BLACKLIST, action: ACTION_KEYS.MANAGE },
  "/risk/profiles": { resource: RESOURCE_KEYS.RISK_PROFILE, action: ACTION_KEYS.VIEW },

  // ========================================
  // STAFF & USER MANAGEMENT
  // ========================================
  "/staff": { resource: RESOURCE_KEYS.STAFF, action: ACTION_KEYS.VIEW },
  "/user-management": { resource: RESOURCE_KEYS.USER, action: ACTION_KEYS.VIEW },
  "/user-management/all-users": { resource: RESOURCE_KEYS.USER, action: ACTION_KEYS.VIEW },
  "/user-management/add-user": { resource: RESOURCE_KEYS.USER, action: ACTION_KEYS.CREATE },
  "/user-management/roles-permissions": { resource: RESOURCE_KEYS.ROLE, action: ACTION_KEYS.VIEW },
  "/user-management/settings": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.UPDATE },
  
  // ========================================
  // REPORTS
  // ========================================
  "/reports": { resource: RESOURCE_KEYS.REPORT, action: ACTION_KEYS.VIEW },
  "/reports/sales": { resource: RESOURCE_KEYS.SALES_REPORT, action: ACTION_KEYS.VIEW },
  "/reports/purchases": { resource: RESOURCE_KEYS.PURCHASE_REPORT, action: ACTION_KEYS.VIEW },
  "/reports/stock": { resource: RESOURCE_KEYS.STOCK_REPORT, action: ACTION_KEYS.VIEW },
  "/reports/profit-loss": { resource: RESOURCE_KEYS.PROFIT_LOSS_REPORT, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // SETTINGS
  // ========================================
  "/settings": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.VIEW },
  "/settings/general": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.UPDATE },
  
  // ========================================
  // BUSINESS UNITS (Super Admin Only)
  // ========================================
  "/business-unit": { resource: RESOURCE_KEYS.BUSINESS_UNIT, action: ACTION_KEYS.VIEW },
  "/business-units": { resource: RESOURCE_KEYS.BUSINESS_UNIT, action: ACTION_KEYS.VIEW },
  "/business-units/new": { resource: RESOURCE_KEYS.BUSINESS_UNIT, action: ACTION_KEYS.CREATE },
  "/business-units/analytics": { resource: RESOURCE_KEYS.BUSINESS_UNIT, action: ACTION_KEYS.VIEW },

  // ========================================
  // HRM & PAYROLL
  // ========================================
  "/hrm": { resource: RESOURCE_KEYS.STAFF, action: ACTION_KEYS.VIEW },
  "/hrm/staff": { resource: RESOURCE_KEYS.STAFF, action: ACTION_KEYS.VIEW },
  "/hrm/departments": { resource: RESOURCE_KEYS.DEPARTMENT, action: ACTION_KEYS.VIEW },
  "/hrm/designations": { resource: RESOURCE_KEYS.DESIGNATION, action: ACTION_KEYS.VIEW },
  "/hrm/attendance": { resource: RESOURCE_KEYS.ATTENDANCE, action: ACTION_KEYS.VIEW },
  "/hrm/leave": { resource: RESOURCE_KEYS.LEAVE, action: ACTION_KEYS.VIEW },
  "/hrm/payroll": { resource: RESOURCE_KEYS.PAYROLL, action: ACTION_KEYS.VIEW },
  "/hrm/assets": { resource: RESOURCE_KEYS.ASSET, action: ACTION_KEYS.VIEW },

  // ========================================
  // ACCOUNTING & FINANCE
  // ========================================
  "/accounting": { resource: RESOURCE_KEYS.ACCOUNT, action: ACTION_KEYS.VIEW },
  "/accounting/accounts": { resource: RESOURCE_KEYS.ACCOUNT, action: ACTION_KEYS.VIEW },
  "/accounting/transactions": { resource: RESOURCE_KEYS.TRANSACTION, action: ACTION_KEYS.VIEW },
  "/accounting/budgets": { resource: RESOURCE_KEYS.BUDGET, action: ACTION_KEYS.VIEW },
  "/accounting/expenses": { resource: RESOURCE_KEYS.EXPENSE, action: ACTION_KEYS.VIEW },
  "/accounting/expense-categories": { resource: RESOURCE_KEYS.EXPENSE_CATEGORY, action: ACTION_KEYS.VIEW },
  "/accounting/tax": { resource: RESOURCE_KEYS.TAX, action: ACTION_KEYS.VIEW },
  
  "/finance/payments": { resource: RESOURCE_KEYS.PAYMENT, action: ACTION_KEYS.VIEW },
  "/finance/payouts": { resource: RESOURCE_KEYS.PAYOUT, action: ACTION_KEYS.VIEW }, // Payout View or Manage? Using View for list

  // ========================================
  // POS CONFIG
  // ========================================
  "/pos-config": { resource: RESOURCE_KEYS.TERMINAL, action: ACTION_KEYS.VIEW },
  "/pos-config/terminals": { resource: RESOURCE_KEYS.TERMINAL, action: ACTION_KEYS.VIEW },
  "/pos-config/registers": { resource: RESOURCE_KEYS.CASH_REGISTER, action: ACTION_KEYS.VIEW },

  // ========================================
  // ONLINE STORE (STOREFRONT)
  // ========================================
  "/online-store": { resource: RESOURCE_KEYS.STOREFRONT, action: ACTION_KEYS.VIEW }, // Fallback
  "/online-store/landing-pages": { resource: RESOURCE_KEYS.LANDING_PAGE, action: ACTION_KEYS.VIEW },
  "/online-store/pages": { resource: RESOURCE_KEYS.STOREFRONT, action: ACTION_KEYS.VIEW },
  "/online-store/themes": { resource: RESOURCE_KEYS.THEME, action: ACTION_KEYS.VIEW },
  "/online-store/plugins": { resource: RESOURCE_KEYS.PLUGIN, action: ACTION_KEYS.VIEW },
  "/online-store/settings": { resource: RESOURCE_KEYS.STOREFRONT, action: ACTION_KEYS.MANAGE },
  
  // ========================================
  // CATALOG EXTRAS
  // ========================================
  "/catalog/warranties": { resource: RESOURCE_KEYS.WARRANTY, action: ACTION_KEYS.VIEW },
  "/catalog/attribute-groups": { resource: RESOURCE_KEYS.ATTRIBUTE_GROUP, action: ACTION_KEYS.VIEW },

  // ========================================
  // SALES EXTRAS
  // ========================================
  "/sales/returns": { resource: RESOURCE_KEYS.RETURN, action: ACTION_KEYS.VIEW },
  "/sales/shipping": { resource: RESOURCE_KEYS.SHIPPING, action: ACTION_KEYS.VIEW },
  // ========================================
  // SYSTEM & SETTINGS
  // ========================================
  "/system": { resource: RESOURCE_KEYS.SYSTEM, action: ACTION_KEYS.VIEW },
  "/system/audit-logs": { resource: RESOURCE_KEYS.AUDIT_LOG, action: ACTION_KEYS.VIEW },
  "/system/notifications": { resource: RESOURCE_KEYS.NOTIFICATION, action: ACTION_KEYS.VIEW },
  "/system/languages": { resource: RESOURCE_KEYS.LANGUAGE, action: ACTION_KEYS.VIEW },
  "/system/currencies": { resource: RESOURCE_KEYS.CURRENCY, action: ACTION_KEYS.VIEW },
  "/system/zones": { resource: RESOURCE_KEYS.ZONE, action: ACTION_KEYS.VIEW },
  "/system/backups": { resource: RESOURCE_KEYS.BACKUP, action: ACTION_KEYS.VIEW },
  "/system/api-keys": { resource: RESOURCE_KEYS.API_KEY, action: ACTION_KEYS.VIEW },
  "/system/webhooks": { resource: RESOURCE_KEYS.WEBHOOK, action: ACTION_KEYS.VIEW },
  "/system/email-templates": { resource: RESOURCE_KEYS.EMAIL_TEMPLATE, action: ACTION_KEYS.VIEW },
  "/system/sms-templates": { resource: RESOURCE_KEYS.SMS_TEMPLATE, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // STOREFRONT EXTRAS
  // ========================================
  "/online-store/abandoned-carts": { resource: RESOURCE_KEYS.ABANDONED_CART, action: ACTION_KEYS.VIEW },
  "/online-store/questions": { resource: RESOURCE_KEYS.QUESTION, action: ACTION_KEYS.VIEW },
  
  // ========================================
  // CUSTOMER EXTRAS
  // ========================================
  "/customers/wishlists": { resource: RESOURCE_KEYS.WISHLIST, action: ACTION_KEYS.VIEW },
  "/customers/carts": { resource: RESOURCE_KEYS.CART, action: ACTION_KEYS.VIEW },
  "/customers/subscriptions": { resource: RESOURCE_KEYS.SUBSCRIPTION, action: ACTION_KEYS.VIEW },
  "/customers/loyalty": { resource: RESOURCE_KEYS.LOYALTY, action: ACTION_KEYS.VIEW },
  "/customers/reviews": { resource: RESOURCE_KEYS.REVIEW, action: ACTION_KEYS.VIEW },

  // ========================================
  // SUPPORT EXTRAS
  // ========================================
  "/support/disputes": { resource: RESOURCE_KEYS.DISPUTE, action: ACTION_KEYS.VIEW },
  "/support/chat": { resource: RESOURCE_KEYS.CHAT, action: ACTION_KEYS.VIEW },

  // ========================================
  // INVENTORY & STOCK
  // ========================================
  "/inventory/adjustments": { resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.VIEW },

  // ========================================
  // SALES & ORDERS
  // ========================================
  // Invoices already defined above

  // ========================================
  // FINANCE
  // ========================================
  "/finance/settlements": { resource: RESOURCE_KEYS.SETTLEMENT, action: ACTION_KEYS.VIEW },
  "/finance/reconciliation": { resource: RESOURCE_KEYS.RECONCILIATION, action: ACTION_KEYS.VIEW },

  // ========================================
  // MARKETING
  // ========================================
  // Audiences already defined above
  "/marketing/seo": { resource: RESOURCE_KEYS.SEO, action: ACTION_KEYS.UPDATE },
  "/marketing/events": { resource: RESOURCE_KEYS.EVENT, action: ACTION_KEYS.VIEW },

  // ========================================
  // CONTENT
  // ========================================
  "/content": { resource: RESOURCE_KEYS.CONTENT, action: ACTION_KEYS.VIEW },
};

/**
 * Get required permission for a route
 */
export function getRoutePermission(relativePath: string): PermissionRequirement | null {
  // Exact match first
  if (routePermissions[relativePath]) {
    return routePermissions[relativePath];
  }
  
  // Try to match parent routes (for nested routes like /products/edit/123)
  // Check each segment from right to left
  const segments = relativePath.split('/').filter(Boolean);
  
  for (let i = segments.length; i > 0; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (routePermissions[parentPath]) {
      return routePermissions[parentPath];
    }
  }
  
  return null;
}
