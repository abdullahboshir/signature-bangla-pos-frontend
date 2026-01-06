import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Bell,
  User,
  HelpCircle,
  CreditCard,
  Truck,
  FileText,
  Store,
  Sparkles,
  Megaphone,
  Headphones,
  DollarSign,
  Warehouse,
  Globe,
  ShieldAlert,
  Plug,
  Building,
} from "lucide-react"
import { RESOURCE_KEYS, ACTION_KEYS, BUSINESS_PERMISSIONS } from "./permission-keys"

// ========================================
// SINGLE SOURCE OF TRUTH: Module Registry
// ========================================
// All routes, permissions, and UI config derive from this registry
// No more route-paths.ts duplication!

export interface AppModule {
    title: string;
    path: string;
    icon?: any;
    resource?: string;
    action?: string;
    module?: string; // High-level domain (erp, crm, pos, marketplace, etc.)
    badge?: string;
    exact?: boolean;
    hidden?: boolean; // For routes that should be registered but not shown in sidebar
    children?: AppModule[];
}

export const APP_MODULES: Record<string, AppModule> = {
  DASHBOARD: {
    title: "Dashboard",
    path: "dashboard",
    icon: LayoutDashboard,
    exact: true,
    // resource: RESOURCE_KEYS.SYSTEM // OLD
  },
  
  COMPANIES: {
    title: "Companies",
    path: "companies",
    icon: Building,
    resource: RESOURCE_KEYS.ACCOUNT,
    module: "system"
  },
  
  EXPENSES: {
    title: "Expenses",
    path: "accounting/expenses",
    icon: DollarSign,
    resource: RESOURCE_KEYS.EXPENSE, // Fixed from BUSINESS_PERMISSIONS.MANAGE_EXPENSES
    module: "erp"
  },

  BUSINESS_UNITS: {
    title: "Business Units",
    path: "business-units",
    icon: Store,
    resource: RESOURCE_KEYS.BUSINESS_UNIT, // Fixed from PLATFORM_PERMISSIONS.VIEW_BUSINESS_UNITS
    children: [
      { title: "All Units", path: "business-units" },
      { title: "Add New Unit", path: "business-units/new", action: ACTION_KEYS.CREATE }, // Keep action for now, permission check usually handles resource+action
      { title: "Analytics", path: "business-units/analytics", resource: RESOURCE_KEYS.ANALYTICS },
    ],
  },
  
  LOGISTICS: {
    title: "Logistics",
    path: "logistics",
    icon: Truck,
    resource: RESOURCE_KEYS.COURIER,
    module: "logistics",
    children: [
      { title: "Drivers", path: "logistics/drivers", resource: RESOURCE_KEYS.DRIVER, action: ACTION_KEYS.MANAGE },
      { title: "Vehicles", path: "logistics/vehicles", resource: RESOURCE_KEYS.VEHICLE, action: ACTION_KEYS.MANAGE },
      { title: "Couriers", path: "logistics/courier", resource: RESOURCE_KEYS.COURIER, action: ACTION_KEYS.MANAGE },
      { title: "Parcels", path: "logistics/parcel", resource: RESOURCE_KEYS.PARCEL },
      { title: "Reports", path: "reports/logistics", resource: RESOURCE_KEYS.DELIVERY, action: ACTION_KEYS.VIEW },
    ]
  },
  
  CONTENT: {
    title: "Content",
    path: "content",
    icon: FileText,
    resource: RESOURCE_KEYS.CONTENT,
    module: "ecommerce"
  },

  RISK_MANAGEMENT: {
    title: "Risk & Fraud",
    path: "risk",
    icon: ShieldAlert,
    resource: RESOURCE_KEYS.FRAUD_DETECTION,
    children: [
       { title: "Fraud Detection", path: "risk/fraud", resource: RESOURCE_KEYS.FRAUD_DETECTION },
       { title: "Blacklist", path: "risk/blacklist", resource: RESOURCE_KEYS.BLACKLIST },
       { title: "Risk Rules", path: "risk/rules", resource: RESOURCE_KEYS.RISK_RULE },
       { title: "Risk Profiles", path: "risk/profiles", resource: RESOURCE_KEYS.RISK_PROFILE },
       { title: "Analytics", path: "risk/analytics", resource: RESOURCE_KEYS.ANALYTICS },
    ]
  },

  OUTLETS: {
    title: "Outlets",
    path: "outlets",
    icon: Store,
    resource: RESOURCE_KEYS.OUTLET,
    module: "pos",
    children: [
      { title: "All Outlets", path: "outlets", resource: RESOURCE_KEYS.OUTLET },
      { title: "Add Outlet", path: "outlets/new", action: ACTION_KEYS.CREATE },
    ]
  },

  USER_MANAGEMENT: {
    title: "User Management",
    path: "user-management",
    icon: Users,
    resource: RESOURCE_KEYS.USER, // General Key, specific permission checked on children
    children: [
      // Platform Scope
      { title: "Platform Users", path: "user-management/platform-users", resource: RESOURCE_KEYS.USER },
      { title: "Platform Roles", path: "user-management/platform-roles", resource: RESOURCE_KEYS.ROLE },
      { title: "Add Platform User", path: "user-management/platform-users/add", action: ACTION_KEYS.CREATE, hidden: true },

      // Business Scope
      { title: "Business Roles", path: "user-management/business-roles", resource: RESOURCE_KEYS.ROLE },
    ],
  },

  // ... (Keep other modules)

// ...




  CATALOG: {
    title: "Catalog",
    path: "catalog",
    icon: Package,
    resource: RESOURCE_KEYS.PRODUCT, // Fixed from BUSINESS_PERMISSIONS.VIEW_PRODUCTS
    module: "erp",
    children: [
      { title: "Products", path: "catalog/product", resource: RESOURCE_KEYS.PRODUCT },
      { title: "Add Product", path: "catalog/product/add", action: ACTION_KEYS.CREATE },
      { title: "Edit Product", path: "catalog/product/edit", action: ACTION_KEYS.UPDATE, hidden: true },
      { title: "Categories", path: "catalog/category", resource: RESOURCE_KEYS.CATEGORY },
      { title: "Variants", path: "catalog/variants", resource: RESOURCE_KEYS.VARIANT },
      { title: "Brands", path: "catalog/brand", resource: RESOURCE_KEYS.BRAND },
      { title: "Units", path: "catalog/unit", resource: RESOURCE_KEYS.UNIT },
      { title: "Attributes", path: "catalog/attribute", resource: RESOURCE_KEYS.ATTRIBUTE },
      { title: "Attribute Groups", path: "catalog/attribute-groups", resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
      { title: "Warranties", path: "catalog/warranties", resource: RESOURCE_KEYS.WARRANTY },
      { title: "Tax", path: "catalog/tax", resource: RESOURCE_KEYS.TAX },
    ],
  },

  INVENTORY: {
    title: "Inventory",
    path: "inventory",
    icon: Package,
    resource: RESOURCE_KEYS.INVENTORY, // Fixed from BUSINESS_PERMISSIONS.MANAGE_INVENTORY
    module: "erp",
    children: [
      { title: "Stock Levels", path: "inventory" },
      { title: "Purchases", path: "inventory/purchase", resource: RESOURCE_KEYS.PURCHASE },
      { title: "New Purchase", path: "inventory/purchase/new", action: ACTION_KEYS.CREATE, hidden: true },
      { title: "Stock Ledger", path: "inventory/ledger", resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.TRACK },
      { title: "Warehouses", path: "inventory/warehouses", resource: RESOURCE_KEYS.WAREHOUSE },
      { title: "Transfers", path: "inventory/transfers", resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
      { title: "Adjustments", path: "inventory/adjustments", resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.ADJUST },
    ]
  },

  PURCHASES: {
    title: "Purchases",
    path: "purchases",
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.PURCHASE,
    children: [
      { title: "All Purchases", path: "purchases" },
    ]
  },

  SALES: {
    title: "Sales & Orders",
    path: "sales",
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.ORDER, // Fixed from BUSINESS_PERMISSIONS.VIEW_ORDERS
    module: "erp",
    children: [
      { title: "All Orders", path: "sales", resource: RESOURCE_KEYS.ORDER },
      { title: "POS", path: "pos", resource: RESOURCE_KEYS.TERMINAL, module: "pos" },
      { title: "Shipping", path: "sales/shipping", resource: RESOURCE_KEYS.SHIPPING },
      { title: "Deliveries", path: "sales/deliveries", resource: RESOURCE_KEYS.DELIVERY },
      { title: "Returns", path: "sales/returns", resource: RESOURCE_KEYS.RETURN },
      { title: "Invoices", path: "sales/invoices", resource: RESOURCE_KEYS.INVOICE },
    ]
  },

  MARKETING: {
    title: "Marketing",
    path: "marketing",
    icon: Megaphone,
    resource: RESOURCE_KEYS.PROMOTION, // Fixed from BUSINESS_PERMISSIONS.MANAGE_PROMOTIONS
    module: "crm",
    children: [
      { title: "Promotions", path: "marketing/promotions", resource: RESOURCE_KEYS.PROMOTION },
      { title: "Coupons", path: "marketing/coupons", resource: RESOURCE_KEYS.COUPON },
      { title: "Ad Campaigns", path: "marketing/campaigns", resource: RESOURCE_KEYS.AD_CAMPAIGN },
      { title: "Affiliates", path: "marketing/affiliates", resource: RESOURCE_KEYS.AFFILIATE },
      { title: "Loyalty", path: "marketing/loyalty", resource: RESOURCE_KEYS.LOYALTY },
      { title: "SEO", path: "marketing/seo", resource: RESOURCE_KEYS.SEO },
      { title: "Pixel & Events", path: "marketing/pixel", resource: RESOURCE_KEYS.PIXEL },
      { title: "Events", path: "marketing/events", resource: RESOURCE_KEYS.EVENT },
      { title: "Audiences", path: "marketing/audiences", resource: RESOURCE_KEYS.AUDIENCE },
    ]
  },

  CUSTOMERS: {
    title: "Customers",
    path: "customers",
    icon: User,
    resource: RESOURCE_KEYS.CUSTOMER, // Fixed from BUSINESS_PERMISSIONS.MANAGE_CUSTOMERS
    module: "crm",
    children: [
      { title: "Customer List", path: "customers", resource: RESOURCE_KEYS.CUSTOMER },
      { title: "Add Customer", path: "customers/new", action: ACTION_KEYS.CREATE },
      { title: "Loyalty Program", path: "customers/loyalty", resource: RESOURCE_KEYS.LOYALTY },
      { title: "Subscriptions", path: "customers/subscriptions", resource: RESOURCE_KEYS.SUBSCRIPTION },
      { title: "Reviews", path: "customers/reviews", resource: RESOURCE_KEYS.REVIEW },
      { title: "Wishlists", path: "customers/wishlists", resource: RESOURCE_KEYS.WISHLIST },
      { title: "Active Carts", path: "customers/carts", resource: RESOURCE_KEYS.CART },
    ]
  },

  SUPPORT: {
    title: "Support",
    path: "support",
    icon: Headphones,
    resource: RESOURCE_KEYS.TICKET,
    module: "crm",
    children: [
      { title: "Tickets", path: "support/tickets", resource: RESOURCE_KEYS.TICKET },
      { title: "Chat", path: "support/chat", resource: RESOURCE_KEYS.CHAT },
      { title: "Disputes", path: "support/disputes", resource: RESOURCE_KEYS.DISPUTE },
    ]
  },

  FINANCE: {
    title: "Financials",
    path: "finance",
    icon: DollarSign,
    resource: RESOURCE_KEYS.PAYMENT,
    module: "erp",
    children: [
      { title: "Payments", path: "finance/payments", resource: RESOURCE_KEYS.PAYMENT },
      { title: "Settlements", path: "finance/settlements", resource: RESOURCE_KEYS.SETTLEMENT },
      { title: "Payouts", path: "finance/payouts", resource: RESOURCE_KEYS.PAYOUT },
      { title: "Reconciliations", path: "finance/reconciliation", resource: RESOURCE_KEYS.RECONCILIATION },
      { title: "Fraud Detection", path: "finance/fraud", resource: RESOURCE_KEYS.FRAUD_DETECTION },
      { title: "Analytics", path: "finance/analytics", resource: RESOURCE_KEYS.ANALYTICS },
      { title: "Audit Logs", path: "finance/audit-logs", resource: RESOURCE_KEYS.AUDIT_LOG },
    ]
  },

  BUSINESS_SETTINGS: {
    title: "Settings",
    path: "business-settings",
    icon: Settings,
    resource: RESOURCE_KEYS.BUSINESS_UNIT, // More appropriate for business admins
    children: [
        { title: "General", path: "business-settings?tab=overview", resource: RESOURCE_KEYS.BUSINESS_UNIT },
        { title: "Sales & Finance", path: "business-settings?tab=sales", resource: RESOURCE_KEYS.BUSINESS_UNIT },
        { title: "POS Configuration", path: "business-settings?tab=pos", resource: RESOURCE_KEYS.TERMINAL },
        { title: "Inventory", path: "business-settings?tab=inventory", resource: RESOURCE_KEYS.INVENTORY },
    ]
  },

  SYSTEM: {
    title: "System",
    path: "platform-settings", // Point direct parent click to settings
    icon: Settings,
    resource: RESOURCE_KEYS.SYSTEM,
    children: [
      { title: "General Settings", path: "platform-settings?tab=system", resource: RESOURCE_KEYS.SYSTEM }, 
      { title: "Module Toggles", path: "platform-settings?tab=modules", resource: RESOURCE_KEYS.SYSTEM },
      { title: "Email Templates", path: "system/email-templates", resource: RESOURCE_KEYS.EMAIL_TEMPLATE },
      { title: "SMS Templates", path: "system/sms-templates", resource: RESOURCE_KEYS.SMS_TEMPLATE },
      { title: "Languages", path: "system/languages", resource: RESOURCE_KEYS.LANGUAGE },
      { title: "Currencies", path: "system/currencies", resource: RESOURCE_KEYS.CURRENCY },
      { title: "Zones & Locations", path: "system/zones", resource: RESOURCE_KEYS.ZONE },
      { title: "Backups", path: "system/backups", resource: RESOURCE_KEYS.BACKUP },
    ]
  },

  // 📦 PACKAGES & LICENSING - SaaS subscription management
  PACKAGES: {
    title: "Packages & Plans",
    path: "packages",
    icon: Package,
    resource: RESOURCE_KEYS.SUBSCRIPTION, // Fixed from PLATFORM_PERMISSIONS.MANAGE_PACKAGES
    badge: "SaaS",
    children: [
      { title: "All Packages", path: "packages" },
      { title: "Create Package", path: "packages/new", action: ACTION_KEYS.CREATE },
      { title: "Feature Flags", path: "packages/features", resource: RESOURCE_KEYS.SYSTEM },
      { title: "License Keys", path: "licenses", resource: RESOURCE_KEYS.SUBSCRIPTION },
      { title: "Trials", path: "packages/trials", resource: RESOURCE_KEYS.SUBSCRIPTION },
    ]
  },

  // 🔔 NOTIFICATIONS - Platform-wide alert center
  NOTIFICATIONS: {
    title: "Notifications",
    path: "notifications",
    icon: Bell,
    resource: RESOURCE_KEYS.NOTIFICATION,
    badge: "New",
    children: [
      { title: "Alert Center", path: "notifications" },
      { title: "Announcements", path: "notifications/announcements", action: ACTION_KEYS.CREATE },
      { title: "Alert Settings", path: "notifications/settings", action: ACTION_KEYS.UPDATE },
    ]
  },

  // 🔌 INTEGRATIONS - Third-party service management
  INTEGRATIONS: {
    title: "Integrations",
    path: "integrations",
    icon: Plug,
    resource: RESOURCE_KEYS.SYSTEM,
    badge: "New",
    children: [
      { title: "All Integrations", path: "integrations" },
      { title: "Payment Gateways", path: "integrations/payment", resource: RESOURCE_KEYS.SYSTEM },
      { title: "Shipping Providers", path: "integrations/shipping", resource: RESOURCE_KEYS.SYSTEM },
      { title: "Email & SMS", path: "integrations/communication", resource: RESOURCE_KEYS.SYSTEM },
      { title: "Webhooks", path: "integrations/webhooks", resource: RESOURCE_KEYS.WEBHOOK },
      { title: "API Keys", path: "integrations/api-keys", resource: RESOURCE_KEYS.API_KEY },
    ]
  },

  SUPPLIERS: {
    title: "Suppliers",
    path: "suppliers",
    icon: Truck,
    resource: RESOURCE_KEYS.SUPPLIER, // Fixed from BUSINESS_PERMISSIONS.MANAGE_SUPPLIERS
    module: "erp"
  },

  REPORTS: {
    title: "Reports",
    path: "reports",
    icon: BarChart3,
    resource: RESOURCE_KEYS.REPORT, // Fixed from BUSINESS_PERMISSIONS.VIEW_FINANCIAL_REPORTS
    module: "erp",
    children: [
      { title: "Sales Analysis", path: "reports/sales", resource: RESOURCE_KEYS.SALES_REPORT },
      { title: "Purchase History", path: "reports/purchases", resource: RESOURCE_KEYS.PURCHASE_REPORT },
      { title: "Stock Valuation", path: "reports/stock", resource: RESOURCE_KEYS.STOCK_REPORT },
      { title: "Profit & Loss", path: "reports/profit-loss", resource: RESOURCE_KEYS.PROFIT_LOSS_REPORT },
      { title: "Expense Report", path: "reports/expenses", resource: RESOURCE_KEYS.EXPENSE_CATEGORY },
    ]
  },

  POS_TERMINAL: {
    title: "POS Terminal",
    path: "pos",
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.TERMINAL, // Fixed from BUSINESS_PERMISSIONS.ACCESS_POS
    module: "pos"
  },

  STAFF: {
    title: "Staff Management",
    path: "hrm/staff",
    icon: Users,
    resource: RESOURCE_KEYS.STAFF, // Fixed from BUSINESS_PERMISSIONS.MANAGE_STAFF
    module: "hrm"
  },

  HRM: {
    title: "HRM & Payroll",
    path: "hrm",
    icon: Users,
    resource: RESOURCE_KEYS.STAFF, // Fixed from BUSINESS_PERMISSIONS.MANAGE_STAFF
    module: "hrm",
    children: [
      { title: "Staff Directory", path: "hrm/staff", resource: RESOURCE_KEYS.STAFF },
      { title: "Departments", path: "hrm/departments", resource: RESOURCE_KEYS.DEPARTMENT },
      { title: "Designations", path: "hrm/designations", resource: RESOURCE_KEYS.DESIGNATION },
      { title: "Attendance", path: "hrm/attendance", resource: RESOURCE_KEYS.ATTENDANCE },
      { title: "Leave Requests", path: "hrm/leave", resource: RESOURCE_KEYS.LEAVE },
      { title: "Payroll", path: "hrm/payroll", resource: RESOURCE_KEYS.PAYROLL },
      { title: "Assets", path: "hrm/assets", resource: RESOURCE_KEYS.ASSET },
    ]
  },

  GOVERNANCE: {
    title: "Governance",
    path: "governance",
    icon: ShieldAlert,
    resource: RESOURCE_KEYS.GOVERNANCE_SHAREHOLDER,
    module: "governance",
    children: [
      { title: "Shareholders", path: "governance/shareholders", resource: RESOURCE_KEYS.GOVERNANCE_SHAREHOLDER },
      { title: "Voting & Proposals", path: "governance/voting", resource: RESOURCE_KEYS.GOVERNANCE_VOTING },
      { title: "Board Meetings", path: "governance/meetings", resource: RESOURCE_KEYS.GOVERNANCE_MEETING },
      { title: "Compliance", path: "governance/compliance", resource: RESOURCE_KEYS.GOVERNANCE_COMPLIANCE },
    ]
  },


  ACCOUNTING: {
    title: "Accounting",
    path: "accounting",
    icon: DollarSign,
    resource: RESOURCE_KEYS.ACCOUNT,
    module: "erp",
    children: [
      { title: "Chart of Accounts", path: "accounting/accounts", resource: RESOURCE_KEYS.ACCOUNT },
      { title: "Transactions", path: "accounting/transactions", resource: RESOURCE_KEYS.TRANSACTION },
      { title: "Expenses", path: "accounting/expenses", resource: RESOURCE_KEYS.EXPENSE },
      { title: "Expense Categories", path: "accounting/expense-categories", resource: RESOURCE_KEYS.EXPENSE_CATEGORY },
      { title: "Budgets", path: "accounting/budgets", resource: RESOURCE_KEYS.BUDGET },
      { title: "Tax Rules", path: "accounting/tax", resource: RESOURCE_KEYS.TAX },
    ]
  },

  VENDORS: {
    title: "Vendors",
    path: "vendors",
    icon: Store,
    resource: RESOURCE_KEYS.VENDOR,
    module: "erp",
    children: [
      { title: "All Vendors", path: "vendors", resource: RESOURCE_KEYS.VENDOR },
      { title: "Onboarding", path: "vendors/onboarding", resource: RESOURCE_KEYS.VENDOR, action: ACTION_KEYS.CREATE },
      { title: "Payouts", path: "vendors/payouts", resource: RESOURCE_KEYS.PAYOUT, action: ACTION_KEYS.MANAGE },
    ]
  },

  POS_CONFIG: {
    title: "POS Config",
    path: "pos-config",
    icon: Store,
    resource: RESOURCE_KEYS.TERMINAL,
    module: "pos",
    children: [
      { title: "Terminals", path: "pos-config/terminals", resource: RESOURCE_KEYS.TERMINAL },
      { title: "Cash Registers", path: "pos-config/registers", resource: RESOURCE_KEYS.CASH_REGISTER },
    ]
  },

  STOREFRONT: {
    title: "Online Store",
    path: "online-store",
    icon: Globe,
    resource: RESOURCE_KEYS.STOREFRONT,
    module: "ecommerce",
    children: [
      { title: "Store Builder", path: "online-store/ui-builder", resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Pages", path: "online-store/pages", resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Landing Pages", path: "online-store/landing-pages", resource: RESOURCE_KEYS.LANDING_PAGE },
      { title: "Themes", path: "online-store/themes", resource: RESOURCE_KEYS.THEME },
      { title: "Plugins", path: "online-store/plugins", resource: RESOURCE_KEYS.PLUGIN },
      { title: "Questions", path: "online-store/questions", resource: RESOURCE_KEYS.QUESTION },
      { title: "Abandoned Carts", path: "online-store/abandoned-carts", resource: RESOURCE_KEYS.ABANDONED_CART },
      { title: "Settings", path: "online-store/settings", resource: RESOURCE_KEYS.STOREFRONT },
    ]
  }
};

// ========================================
// GENERATE ROUTE_PATHS from Registry
// ========================================
// This derived constant ensures ROUTE_PATHS always matches APP_MODULES
export const ROUTE_PATHS = {
  DASHBOARD: { ROOT: "dashboard" },
  BUSINESS_UNITS: {
    ROOT: "business-units",
    NEW: "business-units/new",
    ANALYTICS: "business-units/analytics",
  },
  OUTLETS: {
    ROOT: "outlets",
    NEW: "outlets/new",
  },
  LOGISTICS: {
    ROOT: "logistics",
    DRIVERS: "logistics/drivers",
    VEHICLES: "logistics/vehicles",
    COURIER: "logistics/courier",
    PARCEL: "logistics/parcel",
    REPORTS: "logistics/reports",
  },
  RISK: {
    ROOT: "risk",
    FRAUD: "risk/fraud",
    BLACKLIST: "risk/blacklist",
    RULES: "risk/rules",
    ANALYTICS: "risk/analytics",
  },
  USER_MANAGEMENT: {
    ROOT: "user-management",
    
    // Platform
    PLATFORM_USERS: "user-management/platform-users",
    PLATFORM_ROLES: "user-management/platform-roles",
    ADD_PLATFORM_USER: "user-management/platform-users/add",
    
    // Business
    BUSINESS_USERS: "user-management/business-users",
    BUSINESS_ROLES: "user-management/business-roles",
    ADD_BUSINESS_USER: "user-management/business-users/add",
    BUSINESS_USER_DETAILS: (id: string) => `user-management/business-users/${id}`,

    // Keep ALL_USERS pointing to platform for Global Redirects in existing code
    ALL_USERS: "user-management/platform-users", 
  },
  CATALOG: {
    ROOT: "catalog",
    PRODUCT: {
      ROOT: "catalog/product",
      ADD: "catalog/product/add",
      EDIT: "catalog/product/edit",
    },
    CATEGORY: "catalog/category",
    BRAND: "catalog/brand",
    UNIT: "catalog/unit",
    ATTRIBUTE: "catalog/attribute",
    ATTRIBUTE_GROUP: "catalog/attribute-groups",
    TAX: "catalog/tax",
    WARRANTY: "catalog/warranties",
  },
  INVENTORY: {
    ROOT: "inventory",
    PURCHASE: "inventory/purchase",
    PURCHASE_NEW: "inventory/purchase/new",
    ADJUSTMENTS: "inventory/adjustments",
    LEDGER: "inventory/ledger",
    WAREHOUSES: "inventory/warehouses",
    TRANSFERS: "inventory/transfers",
    ALERTS: "inventory/alerts",
  },
  PURCHASES: {
    ROOT: "purchases",
  },
  SALES: {
    ROOT: "sales",
    POS: "pos",
    TODAY: "sales/today",
    SHIPPING: "sales/shipping",
    DELIVERY: "sales/deliveries",
    RETURNS: "sales/returns",
    INVOICES: "sales/invoices",
  },
  MARKETING: {
    ROOT: "marketing",
    PROMOTIONS: "marketing/promotions",
    COUPONS: "marketing/coupons",
    CAMPAIGNS: "marketing/campaigns",
    AFFILIATES: "marketing/affiliates",
    LOYALTY: "marketing/loyalty",
    SEO: "marketing/seo",
    PIXEL: "marketing/pixel",
    AUDIENCES: "marketing/audiences",
  },
  CUSTOMERS: {
    ROOT: "customers",
    NEW: "customers/new",
    LOYALTY: "customers/loyalty",
    SUBSCRIPTIONS: "customers/subscriptions",
    REVIEWS: "customers/reviews",
    WISHLISTS: "customers/wishlists",
    CARTS: "customers/carts",
  },
  SUPPORT: {
    ROOT: "support",
    TICKETS: "support/tickets",
    CHAT: "support/chat",
    DISPUTES: "support/disputes",
  },
  CONTENT: {
    ROOT: "content",
  },
  FINANCE: {
    ROOT: "finance",
    PAYMENTS: "finance/payments",
    SETTLEMENTS: "finance/settlements",
    PAYOUTS: "finance/payouts",
    FRAUD: "finance/fraud",
    REPORTS: "finance/reports",
    ANALYTICS: "finance/analytics",
    AUDIT_LOGS: "finance/audit-logs",
  },
  SYSTEM: {
    ROOT: "system",
    AUDIT_LOGS: "system/audit-logs",
    NOTIFICATIONS: "system/notifications",
    SETTINGS: "platform-settings", // Added explicit Platform Settings path
    LANGUAGES: "system/languages",
    CURRENCIES: "system/currencies",
    ZONES: "system/zones",
    BACKUPS: "system/backups",
    API_KEYS: "system/api-keys",
    WEBHOOKS: "system/webhooks",
    EMAIL_TEMPLATES: "system/email-templates",
    SMS_TEMPLATES: "system/sms-templates",
  },
  SUPPLIERS: {
    ROOT: "suppliers",
  },
  GOVERNANCE: {
      ROOT: "governance",
      SHAREHOLDERS: "governance/shareholders",
      VOTING: "governance/voting",
      MEETINGS: "governance/meetings",
  },
  REPORTS: {
    ROOT: "reports",
    SALES: "reports/sales",
    PURCHASES: "reports/purchases",
    STOCK: "reports/stock",
    PROFIT_LOSS: "reports/profit-loss",
    EXPENSE: "reports/expenses",
  },
  STAFF: {
    ROOT: "staff",
  },
  HRM: {
    ROOT: "hrm",
    STAFF: "hrm/staff",
    DEPARTMENTS: "hrm/departments",
    DESIGNATIONS: "hrm/designations",
    ATTENDANCE: "hrm/attendance",
    LEAVE: "hrm/leave",
    PAYROLL: "hrm/payroll",
    ASSETS: "hrm/assets",
  },
  ACCOUNTING: {
    ROOT: "accounting",
    ACCOUNTS: "accounting/accounts",
    TRANSACTIONS: "accounting/transactions",
    EXPENSES: "accounting/expenses",
    BUDGETS: "accounting/budgets",
    TAX: "accounting/tax",
  },
  VENDORS: {
    ROOT: "vendors",
    ONBOARDING: "vendors/onboarding",
    PAYOUTS: "vendors/payouts",
  },
  POS_CONFIG: {
    ROOT: "pos-config",
    TERMINALS: "pos-config/terminals",
    REGISTERS: "pos-config/registers",
  },
  STOREFRONT: {
    ROOT: "online-store",
    UI_BUILDER: "online-store/ui-builder",
    PAGES: "online-store/pages",
    THEMES: "online-store/themes",
    PLUGINS: "online-store/plugins",
    LANDING_PAGES: "online-store/landing-pages",
    SETTINGS: "online-store/settings",
  },
  POS: {
    QUICK_SALES: "quick-sales",
    TODAY: "today",
    MY_SALES: "my-sales",
  },
  COMMON: {
    NOTIFICATIONS: "notifications",
    PROFILE: "profile",
    SETTINGS: "business-settings",
    HELP: "help",
  }
} as const;
