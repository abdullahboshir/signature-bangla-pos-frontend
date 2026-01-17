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
} from "lucide-react";
import {
  RESOURCE_KEYS,
  ACTION_KEYS,
  BUSINESS_PERMISSIONS,
} from "./permission-keys";

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

// Key Operational Modules that Business Admins/Managers typically access
// independent of global platform strictness (often used for bypass logic)
export const OPERATIONAL_MODULES = [
  "pos",
  "erp",
  "crm",
  "inventory",
  "ecommerce",
  "hrm",
  "logistics",
  "finance",
  "marketing",
  "integrations",
];

export const APP_MODULES: Record<string, AppModule> = {
  DASHBOARD: {
    title: "Dashboard",
    path: "dashboard",
    icon: LayoutDashboard,
    exact: true,
    resource: RESOURCE_KEYS.DASHBOARD,
    module: "system",
  },

  ORGANIZATIONS: {
    title: "Organizations",
    path: "organizations",
    icon: Building,
    resource: RESOURCE_KEYS.ACCOUNT,
    module: "platform",
    children: [
      {
        title: "All Organizations",
        path: "organizations",
        resource: RESOURCE_KEYS.ACCOUNT,
      },
      {
        title: "Add Organization",
        path: "organizations/add",
        resource: RESOURCE_KEYS.ACCOUNT,
        action: ACTION_KEYS.CREATE,
      },
    ],
  },

  EXPENSES: {
    title: "Expenses",
    path: "accounting/expenses",
    icon: DollarSign,
    resource: RESOURCE_KEYS.EXPENSE, // Fixed from BUSINESS_PERMISSIONS.MANAGE_EXPENSES
    module: "erp",
  },

  BUSINESS_UNITS: {
    title: "Business Units",
    path: "business-units",
    icon: Store,
    resource: RESOURCE_KEYS.BUSINESS_UNIT, // Fixed from PLATFORM_PERMISSIONS.VIEW_BUSINESS_UNITS
    module: "platform",
    children: [
      {
        title: "All Units",
        path: "business-units",
        resource: RESOURCE_KEYS.BUSINESS_UNIT,
      },
      {
        title: "Add New Unit",
        path: "business-units/new",
        resource: RESOURCE_KEYS.BUSINESS_UNIT,
        action: ACTION_KEYS.CREATE,
      },
      {
        title: "Analytics",
        path: "business-units/analytics",
        resource: RESOURCE_KEYS.ANALYTICS_REPORT,
      },
    ],
  },

  LOGISTICS: {
    title: "Logistics",
    path: "logistics",
    icon: Truck,
    resource: RESOURCE_KEYS.COURIER,
    module: "logistics",
    children: [
      {
        title: "Drivers",
        path: "logistics/drivers",
        resource: RESOURCE_KEYS.DRIVER,
        action: ACTION_KEYS.MANAGE,
      },
      {
        title: "Vehicles",
        path: "logistics/vehicles",
        resource: RESOURCE_KEYS.VEHICLE,
        action: ACTION_KEYS.MANAGE,
      },
      {
        title: "Couriers",
        path: "logistics/courier",
        resource: RESOURCE_KEYS.COURIER,
        action: ACTION_KEYS.MANAGE,
      },
      {
        title: "Parcels",
        path: "logistics/parcel",
        resource: RESOURCE_KEYS.PARCEL,
      },
      {
        title: "Reports",
        path: "reports/logistics",
        resource: RESOURCE_KEYS.DELIVERY,
        action: ACTION_KEYS.VIEW,
      },
    ],
  },

  INVENTORY: {
    title: "Inventory",
    path: "inventory",
    icon: Warehouse,
    resource: RESOURCE_KEYS.INVENTORY,
    module: "erp", // Corrected to match backend
    children: [
      {
        title: "Stock Levels",
        path: "inventory/stock",
        resource: RESOURCE_KEYS.INVENTORY,
      },
      {
        title: "Receive Stock",
        path: "inventory/receive",
        resource: RESOURCE_KEYS.INVENTORY,
        action: ACTION_KEYS.UPDATE,
      },
      {
        title: "Transfer",
        path: "inventory/transfer",
        resource: RESOURCE_KEYS.TRANSFER,
      },
      {
        title: "Warehouse",
        path: "inventory/warehouse",
        resource: RESOURCE_KEYS.WAREHOUSE,
      },
    ],
  },

  CATALOG: {
    title: "Catalog",
    path: "catalog",
    icon: Package,
    resource: RESOURCE_KEYS.PRODUCT,
    module: "erp",
    children: [
      {
        title: "Products",
        path: "catalog/product",
        resource: RESOURCE_KEYS.PRODUCT,
      },
      {
        title: "Categories",
        path: "catalog/category",
        resource: RESOURCE_KEYS.CATEGORY,
      },
      {
        title: "Brands",
        path: "catalog/brand",
        resource: RESOURCE_KEYS.BRAND,
      },
      {
        title: "Attributes",
        path: "catalog/attribute",
        resource: RESOURCE_KEYS.ATTRIBUTE,
      },
      { title: "Units", path: "catalog/unit", resource: RESOURCE_KEYS.UNIT },
    ],
  },

  SALES: {
    title: "Sales",
    path: "sales",
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.ORDER,
    module: "erp",
    children: [
      { title: "Orders", path: "sales/orders", resource: RESOURCE_KEYS.ORDER },
      {
        title: "Invoices",
        path: "sales/invoices",
        resource: RESOURCE_KEYS.INVOICE,
      },
      {
        title: "Shipments",
        path: "sales/shipments",
        resource: RESOURCE_KEYS.SHIPPING,
      },
      {
        title: "Returns",
        path: "sales/returns",
        resource: RESOURCE_KEYS.RETURN,
      },
    ],
  },

  POS_TERMINAL: {
    title: "POS Terminal",
    path: "pos",
    icon: Store,
    resource: RESOURCE_KEYS.TERMINAL,
    module: "pos",
  },

  OUTLETS: {
    title: "Outlets",
    path: "outlets",
    icon: Store,
    resource: RESOURCE_KEYS.OUTLET,
    module: "pos",
  },

  CUSTOMERS: {
    title: "Customers",
    path: "customers",
    icon: Users,
    resource: RESOURCE_KEYS.CUSTOMER,
    module: "crm",
  },

  MARKETING: {
    title: "Marketing",
    path: "marketing",
    icon: Megaphone,
    resource: RESOURCE_KEYS.PROMOTION,
    module: "marketing",
    children: [
      {
        title: "Campaigns",
        path: "marketing/campaigns",
        resource: RESOURCE_KEYS.AD_CAMPAIGN,
      },
      {
        title: "Discounts",
        path: "marketing/discounts",
        resource: RESOURCE_KEYS.PROMOTION,
      },
      {
        title: "Coupons",
        path: "marketing/coupons",
        resource: RESOURCE_KEYS.COUPON,
      },
    ],
  },

  STOREFRONT: {
    title: "Online Store",
    path: "storefront",
    icon: Globe,
    resource: RESOURCE_KEYS.STOREFRONT,
    module: "ecommerce",
    children: [
      {
        title: "Themes",
        path: "storefront/themes",
        resource: RESOURCE_KEYS.THEME,
      },
      {
        title: "Pages",
        path: "storefront/pages",
        resource: RESOURCE_KEYS.LANDING_PAGE,
      },
      {
        title: "Navigation",
        path: "storefront/navigation",
        resource: RESOURCE_KEYS.CONTENT,
      },
      {
        title: "Preferences",
        path: "storefront/preferences",
        resource: RESOURCE_KEYS.STOREFRONT,
        action: ACTION_KEYS.UPDATE,
      },
    ],
  },

  HRM: {
    title: "HRM & Payroll",
    path: "hrm",
    icon: Users,
    resource: RESOURCE_KEYS.STAFF,
    module: "hrm",
    children: [
      { title: "Staff", path: "hrm/staff", resource: RESOURCE_KEYS.STAFF },
      {
        title: "Attendance",
        path: "hrm/attendance",
        resource: RESOURCE_KEYS.ATTENDANCE,
      },
      {
        title: "Payroll",
        path: "hrm/payroll",
        resource: RESOURCE_KEYS.PAYROLL,
      },
      { title: "Leave", path: "hrm/leave", resource: RESOURCE_KEYS.LEAVE },
    ],
  },

  FINANCE: {
    title: "Finance",
    path: "finance",
    icon: DollarSign,
    resource: RESOURCE_KEYS.ACCOUNT,
    module: "finance",
    children: [
      {
        title: "Transactions",
        path: "finance/transactions",
        resource: RESOURCE_KEYS.TRANSACTION,
      },
      {
        title: "Accounts",
        path: "finance/accounts",
        resource: RESOURCE_KEYS.ACCOUNT,
      },
    ],
  },

  ACCOUNTING: {
    title: "Accounting",
    path: "accounting",
    module: "finance",
    children: [
      {
        title: "Chart of Accounts",
        path: "accounting/chart-of-accounts",
        resource: RESOURCE_KEYS.ACCOUNT,
      },
      {
        title: "Journal",
        path: "accounting/journal",
        resource: RESOURCE_KEYS.TRANSACTION,
      },
      {
        title: "General Ledger",
        path: "accounting/ledger",
        resource: RESOURCE_KEYS.TRANSACTION,
      },
    ],
  },

  REPORTS: {
    title: "Reports",
    path: "reports",
    icon: BarChart3,
    resource: RESOURCE_KEYS.REPORT,
    module: "system",
  },

  NOTIFICATIONS: {
    title: "Notifications",
    path: "notifications",
    icon: Bell,
    resource: RESOURCE_KEYS.NOTIFICATION,
    module: "system",
  },

  SUPPORT: {
    title: "Support",
    path: "support",
    icon: Headphones,
    resource: RESOURCE_KEYS.TICKET,
    module: "crm",
    children: [
      {
        title: "Tickets",
        path: "support/tickets",
        resource: RESOURCE_KEYS.TICKET,
      },
      { title: "Chats", path: "support/chats", resource: RESOURCE_KEYS.CHAT },
      {
        title: "Knowledge Base",
        path: "support/kb",
        resource: RESOURCE_KEYS.CONTENT,
      },
    ],
  },

  USER_MANAGEMENT: {
    title: "User Management",
    path: "user-management",
    icon: Users,
    resource: RESOURCE_KEYS.USER,
    module: "system",
  },

  PLATFORM_SETTINGS: {
    title: "Platform Settings",
    path: "platform-settings",
    icon: Settings,
    resource: RESOURCE_KEYS.PLATFORM_SETTING,
    module: "platform",
  },

  INTEGRATIONS: {
    title: "Integrations",
    path: "integrations",
    icon: Plug,
    resource: RESOURCE_KEYS.INTEGRATION,
    module: "integrations",
  },

  MODULE_REGISTRY: {
    title: "Module Registry",
    path: "system/modules",
    icon: Plug,
    resource: RESOURCE_KEYS.FEATURE,
    module: "system",
  },

  SYSTEM: {
    title: "System",
    path: "system",
    icon: ShieldAlert,
    resource: RESOURCE_KEYS.SYSTEM_CONFIG,
    module: "system",
    children: [
      {
        title: "Settings",
        path: "system/settings",
        resource: RESOURCE_KEYS.SYSTEM_CONFIG,
      },
      {
        title: "Module Registry",
        path: "system/modules",
        resource: RESOURCE_KEYS.FEATURE,
      }, // [NEW] Module Registry
      {
        title: "Audit Logs",
        path: "system/audit-logs",
        resource: RESOURCE_KEYS.AUDIT_LOG,
      },
      {
        title: "Backups",
        path: "system/backups",
        resource: RESOURCE_KEYS.BACKUP,
      },
      {
        title: "API Keys",
        path: "system/api-keys",
        resource: RESOURCE_KEYS.API_KEY,
      },
      {
        title: "Data Retention",
        path: "system/data-retention",
        resource: RESOURCE_KEYS.SYSTEM_CONFIG,
      },
      {
        title: "System Notifications",
        path: "system/notifications",
        resource: RESOURCE_KEYS.NOTIFICATION,
      },
      {
        title: "Languages",
        path: "system/languages",
        resource: RESOURCE_KEYS.LANGUAGE,
      },
    ],
  },

  ORGANIZATION_SETTINGS: {
    title: "Organization Settings",
    path: "organization-settings",
    icon: Settings,
    resource: RESOURCE_KEYS.ORGANIZATION_SETTING,
    module: "system",
  },

  BUSINESS_SETTINGS: {
    title: "Business Settings",
    path: "business-settings",
    icon: Settings,
    resource: RESOURCE_KEYS.BUSINESS_SETTING,
    module: "system",
  },

  PACKAGES: {
    title: "Packages",
    path: "packages",
    icon: Package,
    resource: RESOURCE_KEYS.SUBSCRIPTION,
    module: "saas",
  },

  STAFF: {
    title: "Staff",
    path: "hrm/staff",
    icon: Users,
    resource: RESOURCE_KEYS.STAFF,
    module: "hrm",
  },

  SUPPLIERS: {
    title: "Suppliers",
    path: "inventory/suppliers",
    icon: Truck,
    resource: RESOURCE_KEYS.SUPPLIER,
    module: "erp",
  },

  CONTENT: {
    title: "Content",
    path: "content",
    icon: FileText,
    resource: RESOURCE_KEYS.CONTENT,
    module: "ecommerce",
  },

  RISK_MANAGEMENT: {
    title: "Risk Management",
    path: "risk",
    icon: ShieldAlert,
    resource: RESOURCE_KEYS.RISK_PROFILE,
    module: "system",
  },

  VENDORS: {
    title: "Vendors",
    path: "vendors",
    icon: Users,
    resource: RESOURCE_KEYS.VENDOR,
    module: "erp",
  },

  POS_CONFIG: {
    title: "POS Configuration",
    path: "business-settings?tab=pos",
    icon: Settings,
    resource: RESOURCE_KEYS.TERMINAL,
    module: "pos",
  },

  OUTLET_SETTINGS: {
    title: "Outlet Settings",
    path: "outlet-settings",
    icon: Settings,
    resource: RESOURCE_KEYS.OUTLET_SETTING,
    module: "pos",
  },

  POS_SHIFT: {
    title: "Shift / Cash Register",
    path: "pos/shift",
    icon: Store, // Using Store as placeholder, can be changed
    resource: RESOURCE_KEYS.TERMINAL,
    module: "pos",
    children: [
      {
        title: "Cash Open/Close",
        path: "pos/shift/manage",
        resource: RESOURCE_KEYS.TERMINAL,
        action: ACTION_KEYS.MANAGE,
      },
      {
        title: "Z-Report",
        path: "pos/shift/z-report",
        resource: RESOURCE_KEYS.REPORT,
      },
    ],
  },

  ROUTE_PATHS: {
    title: "Route Paths",
    path: "/route-paths",
    // Hidden, just for TS compatibility if needed
    hidden: true,
  },
};

// Deprecated alias for backward compatibility until refactor complete
export const ROUTE_PATHS = {
  DASHBOARD: "dashboard",
  ORGANIZATIONS: "organizations",
  BUSINESS_UNITS: "business-units",
  CATALOG: {
    ROOT: "catalog",
    PRODUCT: { ROOT: "catalog/product", ADD: "catalog/product/add" },
    CATEGORY: "catalog/category",
    BRAND: "catalog/brand",
    ATTRIBUTE: "catalog/attribute",
    ATTRIBUTE_GROUP: "catalog/attribute-groups",
    UNIT: "catalog/unit",
    TAX: "catalog/tax",
    WARRANTY: "catalog/warranties",
  },
  INVENTORY: {
    ROOT: "inventory",
    PURCHASE: "inventory/purchases",
    ADJUSTMENTS: "inventory/adjustments",
    LEDGER: "inventory/ledger",
    WAREHOUSES: "inventory/warehouses",
    TRANSFERS: "inventory/transfers",
    ALERTS: "inventory/alerts", // Added
  },
  SALES: {
    ROOT: "sales",
    ORDERS: "sales/orders",
    INVOICES: "sales/invoices",
    RETURNS: "sales/returns",
    SHIPPING: "sales/shipping",
    TODAY: "sales/today", // Added
    DELIVERY: "sales/delivery", // Added
  },
  CUSTOMERS: {
    ROOT: "customers",
    NEW: "customers/new",
    LOYALTY: "customers/loyalty",
    SUBSCRIPTIONS: "customers/subscriptions",
    REVIEWS: "customers/reviews", // Added
  },
  FINANCE: {
    PAYMENTS: "finance/payments",
    SETTLEMENTS: "finance/settlements",
    PAYOUTS: "finance/payouts",
    FRAUD: "finance/fraud-detection",
    AUDIT_LOGS: "finance/audit-logs",
  },
  POS: {
    QUICK_SALES: "pos/quick-sales",
    TODAY: "pos/summary",
    MY_SALES: "pos/my-sales",
    SHIFT: {
      ROOT: "pos/shift",
      MANAGE: "pos/shift/manage",
      Z_REPORT: "pos/shift/z-report",
    },
  },
  COMMON: {
    NOTIFICATIONS: "notifications",
    PROFILE: "profile",
    HELP: "support/help",
  },
  MARKETING: {
    ROOT: "marketing",
  },
  SUPPORT: {
    ROOT: "support",
  },
  SUPPLIERS: {
    ROOT: "suppliers",
  },
  LOGISTICS: {
    ROOT: "logistics",
  },
  // Add others as needed
};

// ... existing code ...
