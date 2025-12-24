// config/sidebar-menu.ts
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
} from "lucide-react"
import { RESOURCE_KEYS, ACTION_KEYS } from "./permission-keys"
import { ROUTE_PATHS } from "./route-paths"

// 📦 Reusable Menu Modules (DRY Principle)
const MENU_MODULES = {
  DASHBOARD: {
    title: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    exact: true,
    resource: RESOURCE_KEYS.SYSTEM
  },
  BUSINESS_UNITS: {
    title: "Business Units",
    path: ROUTE_PATHS.BUSINESS_UNITS.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.BUSINESS_UNIT,
    children: [
      { title: "All Units", path: ROUTE_PATHS.BUSINESS_UNITS.ROOT },
      { title: "Add New Unit", path: ROUTE_PATHS.BUSINESS_UNITS.NEW, action: ACTION_KEYS.CREATE },
      { title: "Analytics", path: ROUTE_PATHS.BUSINESS_UNITS.ANALYTICS, resource: RESOURCE_KEYS.ANALYTICS },
    ],
  },
  OUTLETS: {
    title: "Outlets",
    path: ROUTE_PATHS.OUTLETS.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.OUTLET,
    children: [
      { title: "All Outlets", path: ROUTE_PATHS.OUTLETS.ROOT, resource: RESOURCE_KEYS.OUTLET },
      { title: "Add Outlet", path: ROUTE_PATHS.OUTLETS.NEW, action: ACTION_KEYS.CREATE },
    ]
  },
  USER_MANAGEMENT: {
    title: "User Management",
    path: ROUTE_PATHS.USER_MANAGEMENT.ROOT,
    icon: Users,
    resource: RESOURCE_KEYS.USER,
    children: [
      { title: "All Users", path: ROUTE_PATHS.USER_MANAGEMENT.ALL_USERS },
      { title: "Roles & Permissions", path: ROUTE_PATHS.USER_MANAGEMENT.ROLES_PERMISSIONS, resource: RESOURCE_KEYS.ROLE },
    ],
  },
  CATALOG: { // Full Catalog Structure
    title: "Catalog",
    path: ROUTE_PATHS.CATALOG.ROOT,
    icon: Package,
    resource: RESOURCE_KEYS.PRODUCT,
    children: [
      { title: "Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT, resource: RESOURCE_KEYS.PRODUCT }, // Using "Products" as standard
      { title: "Add Product", path: ROUTE_PATHS.CATALOG.PRODUCT.ADD, action: ACTION_KEYS.CREATE },
      { title: "Categories", path: ROUTE_PATHS.CATALOG.CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Sub-Categories", path: ROUTE_PATHS.CATALOG.SUB_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Child-Categories", path: ROUTE_PATHS.CATALOG.CHILD_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
      { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.UNIT },
      { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
      { title: "Attribute Groups", path: ROUTE_PATHS.CATALOG.ATTRIBUTE_GROUP, resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
      { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.TAX },
    ],
  },
  INVENTORY: {
    title: "Inventory",
    path: ROUTE_PATHS.INVENTORY.ROOT,
    icon: Package,
    resource: RESOURCE_KEYS.INVENTORY,
    children: [
      { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
      { title: "Purchases", path: ROUTE_PATHS.INVENTORY.PURCHASE, resource: RESOURCE_KEYS.PURCHASE },
      { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
      { title: "Stock Ledger", path: ROUTE_PATHS.INVENTORY.LEDGER },
      { title: "Warehouses", path: ROUTE_PATHS.INVENTORY.WAREHOUSES, resource: RESOURCE_KEYS.WAREHOUSE },
      // { title: "Stock Transfers", path: "inventory/transfers", action: ACTION_KEYS.UPDATE }, // Added from Store Manager
      // { title: "Low Stock Alerts", path: "inventory/alerts" }, // Added from Store Manager
    ]
  },
  PURCHASES: {
    title: "Purchases",
    path: ROUTE_PATHS.INVENTORY.PURCHASE,
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.PURCHASE,
    children: [
      { title: "All Purchases", path: ROUTE_PATHS.PURCHASES.ROOT },
    ]
  },
  SALES: {
    title: "Sales & Orders", // Standardized Title
    path: ROUTE_PATHS.SALES.ROOT,
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.ORDER,
    children: [
      { title: "All Orders", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
      { title: "POS", path: ROUTE_PATHS.SALES.POS, resource: RESOURCE_KEYS.ORDER },
      { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
      { title: "Delivery", path: ROUTE_PATHS.SALES.DELIVERY, resource: RESOURCE_KEYS.DELIVERY },
      { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
    ]
  },
  MARKETING: {
    title: "Marketing",
    path: ROUTE_PATHS.MARKETING.ROOT,
    icon: Megaphone,
    resource: RESOURCE_KEYS.PROMOTION,
    children: [
      { title: "Promotions", path: ROUTE_PATHS.MARKETING.PROMOTIONS, resource: RESOURCE_KEYS.PROMOTION },
      { title: "Coupons", path: ROUTE_PATHS.MARKETING.COUPONS, resource: RESOURCE_KEYS.COUPON },
      { title: "Ad Campaigns", path: ROUTE_PATHS.MARKETING.CAMPAIGNS, resource: RESOURCE_KEYS.AD_CAMPAIGN },
      { title: "Affiliates", path: ROUTE_PATHS.MARKETING.AFFILIATES, resource: RESOURCE_KEYS.AFFILIATE },
      { title: "Loyalty", path: ROUTE_PATHS.MARKETING.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
      { title: "SEO", path: ROUTE_PATHS.MARKETING.SEO, resource: RESOURCE_KEYS.SEO },
    ]
  },
  CUSTOMERS: {
    title: "Customers",
    path: ROUTE_PATHS.CUSTOMERS.ROOT,
    icon: User,
    resource: RESOURCE_KEYS.CUSTOMER,
    children: [
      { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT, resource: RESOURCE_KEYS.CUSTOMER },
      { title: "Add Customer", path: ROUTE_PATHS.CUSTOMERS.NEW, action: ACTION_KEYS.CREATE },
      { title: "Loyalty Program", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
      { title: "Subscriptions", path: ROUTE_PATHS.CUSTOMERS.SUBSCRIPTIONS, resource: RESOURCE_KEYS.SUBSCRIPTION },
      { title: "Reviews", path: ROUTE_PATHS.CUSTOMERS.REVIEWS, resource: RESOURCE_KEYS.REVIEW },
      { title: "Wishlists", path: ROUTE_PATHS.CUSTOMERS.WISHLISTS, resource: RESOURCE_KEYS.WISHLIST },
      { title: "Active Carts", path: ROUTE_PATHS.CUSTOMERS.CARTS, resource: RESOURCE_KEYS.CART },
    ]
  },
  SUPPORT: {
    title: "Support",
    path: ROUTE_PATHS.SUPPORT.ROOT,
    icon: Headphones,
    resource: RESOURCE_KEYS.TICKET,
    children: [
      { title: "Tickets", path: ROUTE_PATHS.SUPPORT.TICKETS, resource: RESOURCE_KEYS.TICKET },
      { title: "Chat", path: ROUTE_PATHS.SUPPORT.CHAT, resource: RESOURCE_KEYS.CHAT },
      { title: "Disputes", path: ROUTE_PATHS.SUPPORT.DISPUTES, resource: RESOURCE_KEYS.DISPUTE },
    ]
  },
  CONTENT: {
    title: "Content",
    path: ROUTE_PATHS.CONTENT.ROOT,
    icon: FileText,
    resource: RESOURCE_KEYS.CONTENT,
  },
  FINANCE: {
    title: "Financials",
    path: ROUTE_PATHS.FINANCE.ROOT,
    icon: DollarSign,
    resource: RESOURCE_KEYS.PAYMENT,
    children: [
      { title: "Payments", path: ROUTE_PATHS.FINANCE.PAYMENTS, resource: RESOURCE_KEYS.PAYMENT },
      { title: "Settlements", path: ROUTE_PATHS.FINANCE.SETTLEMENTS, resource: RESOURCE_KEYS.SETTLEMENT },
      { title: "Payouts", path: ROUTE_PATHS.FINANCE.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT },
      { title: "Fraud Detection", path: ROUTE_PATHS.FINANCE.FRAUD, resource: RESOURCE_KEYS.FRAUD_DETECTION },
      { title: "Reports", path: ROUTE_PATHS.FINANCE.REPORTS, resource: RESOURCE_KEYS.REPORT },
      { title: "Analytics", path: ROUTE_PATHS.FINANCE.ANALYTICS, resource: RESOURCE_KEYS.ANALYTICS },
      { title: "Audit Logs", path: ROUTE_PATHS.FINANCE.AUDIT_LOGS, resource: RESOURCE_KEYS.AUDIT_LOG },
    ]
  },
  SYSTEM: {
    title: "System",
    path: ROUTE_PATHS.SYSTEM.ROOT,
    icon: Settings,
    resource: RESOURCE_KEYS.SYSTEM,
    children: [
      { title: "Audit Logs", path: ROUTE_PATHS.SYSTEM.AUDIT_LOGS, resource: RESOURCE_KEYS.AUDIT_LOG },
      { title: "Notifications", path: ROUTE_PATHS.SYSTEM.NOTIFICATIONS, resource: RESOURCE_KEYS.NOTIFICATION },
      { title: "Settings", path: ROUTE_PATHS.COMMON.SETTINGS, resource: RESOURCE_KEYS.SYSTEM },
      { title: "Languages", path: ROUTE_PATHS.SYSTEM.LANGUAGES, resource: RESOURCE_KEYS.LANGUAGE },
      { title: "Currencies", path: ROUTE_PATHS.SYSTEM.CURRENCIES, resource: RESOURCE_KEYS.CURRENCY },
      { title: "Zones & Locations", path: ROUTE_PATHS.SYSTEM.ZONES, resource: RESOURCE_KEYS.ZONE },
      { title: "Backups", path: ROUTE_PATHS.SYSTEM.BACKUPS, resource: RESOURCE_KEYS.BACKUP },
      { title: "API Keys", path: ROUTE_PATHS.SYSTEM.API_KEYS, resource: RESOURCE_KEYS.API_KEY },
      { title: "Webhooks", path: ROUTE_PATHS.SYSTEM.WEBHOOKS, resource: RESOURCE_KEYS.WEBHOOK },
      { title: "Email Templates", path: ROUTE_PATHS.SYSTEM.EMAIL_TEMPLATES, resource: RESOURCE_KEYS.EMAIL_TEMPLATE },
      { title: "SMS Templates", path: ROUTE_PATHS.SYSTEM.SMS_TEMPLATES, resource: RESOURCE_KEYS.SMS_TEMPLATE },
    ]
  },
  SUPPLIERS: {
    title: "Suppliers",
    path: ROUTE_PATHS.SUPPLIERS.ROOT,
    icon: Truck,
    resource: RESOURCE_KEYS.SUPPLIER
  },
  REPORTS: {
    title: "Reports",
    path: ROUTE_PATHS.REPORTS.ROOT,
    icon: BarChart3,
    resource: RESOURCE_KEYS.REPORT
  },
  POS_TERMINAL: {
    title: "POS Terminal",
    path: ROUTE_PATHS.SALES.POS,
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.ORDER
  },
  STAFF: {
    title: "Staff Management",
    path: ROUTE_PATHS.STAFF.ROOT,
    icon: Users,
    resource: RESOURCE_KEYS.USER
  },
  HRM: {
    title: "HRM & Payroll",
    path: ROUTE_PATHS.HRM.ROOT,
    icon: Users,
    resource: RESOURCE_KEYS.STAFF,
    children: [
      { title: "Staff Directory", path: ROUTE_PATHS.HRM.STAFF, resource: RESOURCE_KEYS.STAFF },
      { title: "Departments", path: ROUTE_PATHS.HRM.DEPARTMENTS, resource: RESOURCE_KEYS.DEPARTMENT },
      { title: "Designations", path: ROUTE_PATHS.HRM.DESIGNATIONS, resource: RESOURCE_KEYS.DESIGNATION },
      { title: "Attendance", path: ROUTE_PATHS.HRM.ATTENDANCE, resource: RESOURCE_KEYS.ATTENDANCE },
      { title: "Leave Requests", path: ROUTE_PATHS.HRM.LEAVE, resource: RESOURCE_KEYS.LEAVE },
      { title: "Payroll", path: ROUTE_PATHS.HRM.PAYROLL, resource: RESOURCE_KEYS.PAYROLL },
      { title: "Assets", path: ROUTE_PATHS.HRM.ASSETS, resource: RESOURCE_KEYS.ASSET },
    ]
  },
  ACCOUNTING: {
    title: "Accounting",
    path: ROUTE_PATHS.ACCOUNTING.ROOT,
    icon: DollarSign,
    resource: RESOURCE_KEYS.ACCOUNT,
    children: [
      { title: "Chart of Accounts", path: ROUTE_PATHS.ACCOUNTING.ACCOUNTS, resource: RESOURCE_KEYS.ACCOUNT },
      { title: "Transactions", path: ROUTE_PATHS.ACCOUNTING.TRANSACTIONS, resource: RESOURCE_KEYS.TRANSACTION },
      { title: "Expenses", path: ROUTE_PATHS.ACCOUNTING.EXPENSES, resource: RESOURCE_KEYS.EXPENSE },
      { title: "Budgets", path: ROUTE_PATHS.ACCOUNTING.BUDGETS, resource: RESOURCE_KEYS.BUDGET },
      { title: "Tax Rules", path: ROUTE_PATHS.ACCOUNTING.TAX, resource: RESOURCE_KEYS.TAX },
    ]
  },
  VENDORS: {
    title: "Vendors",
    path: ROUTE_PATHS.VENDORS.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.VENDOR,
    children: [
      { title: "All Vendors", path: ROUTE_PATHS.VENDORS.ROOT, resource: RESOURCE_KEYS.VENDOR },
      { title: "Onboarding", path: ROUTE_PATHS.VENDORS.ONBOARDING, resource: RESOURCE_KEYS.VENDOR },
      { title: "Payouts", path: ROUTE_PATHS.VENDORS.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT },
    ]
  },
  POS_CONFIG: {
    title: "POS Config",
    path: ROUTE_PATHS.POS_CONFIG.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.TERMINAL,
    children: [
      { title: "Terminals", path: ROUTE_PATHS.POS_CONFIG.TERMINALS, resource: RESOURCE_KEYS.TERMINAL },
      { title: "Cash Registers", path: ROUTE_PATHS.POS_CONFIG.REGISTERS, resource: RESOURCE_KEYS.CASH_REGISTER },
    ]
  },
  STOREFRONT: {
    title: "Online Store",
    path: ROUTE_PATHS.STOREFRONT.ROOT,
    icon: Globe,
    resource: RESOURCE_KEYS.STOREFRONT,
    children: [
      { title: "Store Builder", path: ROUTE_PATHS.STOREFRONT.UI_BUILDER, resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Pages", path: ROUTE_PATHS.STOREFRONT.PAGES, resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Themes", path: ROUTE_PATHS.STOREFRONT.THEMES, resource: RESOURCE_KEYS.THEME },
      { title: "Plugins", path: ROUTE_PATHS.STOREFRONT.PLUGINS, resource: RESOURCE_KEYS.PLUGIN },
      { title: "Settings", path: ROUTE_PATHS.STOREFRONT.SETTINGS, resource: RESOURCE_KEYS.STOREFRONT },
    ]
  }
};


export const sidebarMenuConfig = {
  // 👥 Role-based menu items
  menus: {
    // 👑 Super Admin - Manages everything
    "super-admin": [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.BUSINESS_UNITS,
      MENU_MODULES.OUTLETS,
      MENU_MODULES.USER_MANAGEMENT,
      MENU_MODULES.CATALOG,
      MENU_MODULES.INVENTORY,
      MENU_MODULES.SUPPLIERS,
      MENU_MODULES.SALES,
      MENU_MODULES.MARKETING,
      MENU_MODULES.CUSTOMERS,
      MENU_MODULES.VENDORS,
      MENU_MODULES.HRM,
      MENU_MODULES.SUPPORT,
      MENU_MODULES.CONTENT,
      MENU_MODULES.FINANCE,
      MENU_MODULES.ACCOUNTING,
      MENU_MODULES.POS_CONFIG,
      MENU_MODULES.SYSTEM,
    ],

    // 🏢 Business Admin - Manages specific business unit
    "business-admin": [
      MENU_MODULES.DASHBOARD,
      {
        ...MENU_MODULES.POS_TERMINAL,
        badge: "Live",
      },
      MENU_MODULES.OUTLETS,
      {
        ...MENU_MODULES.CATALOG,
        children: [
          { title: "All Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT },
          { title: "Add Product", path: ROUTE_PATHS.CATALOG.PRODUCT.ADD, action: ACTION_KEYS.CREATE },
          { title: "Categories", path: ROUTE_PATHS.CATALOG.CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
          { title: "Sub-Categories", path: ROUTE_PATHS.CATALOG.SUB_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
          { title: "Child-Categories", path: ROUTE_PATHS.CATALOG.CHILD_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
          { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
          { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.UNIT },
          { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
          { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.TAX },
        ],
      },
      MENU_MODULES.STOREFRONT, // Added
      {
        ...MENU_MODULES.INVENTORY,
        children: [
            { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
            { title: "Purchases", path: ROUTE_PATHS.INVENTORY.PURCHASE, resource: RESOURCE_KEYS.PURCHASE },
            { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
            { title: "Stock Ledger", path: ROUTE_PATHS.INVENTORY.LEDGER },
            { title: "Warehouses", path: ROUTE_PATHS.INVENTORY.WAREHOUSES, resource: RESOURCE_KEYS.WAREHOUSE },
        ]
      },
      {
        ...MENU_MODULES.SALES, 
        title: "Sales", // Override title to just "Sales" if preferred
        icon: CreditCard, // Changed icon for Business Admin Sales
        children: [
          { title: "All Sales", path: ROUTE_PATHS.SALES.ROOT },
          { title: "Today's Sales", path: ROUTE_PATHS.SALES.TODAY },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
        ],
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT },
          { title: "Add Customer", path: ROUTE_PATHS.CUSTOMERS.NEW, action: ACTION_KEYS.CREATE },
          { title: "Loyalty Program", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
        ],
      },
      MENU_MODULES.SUPPLIERS,
      MENU_MODULES.REPORTS,
    ],
    
    // Seller - Sales & Catalog focused
    "seller": [
      MENU_MODULES.DASHBOARD,
      {
         ...MENU_MODULES.CATALOG,
         children: [
            { title: "All Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT },
            { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
         ]
      },
      {
        ...MENU_MODULES.SALES,
        title: "Sales",
        icon: CreditCard,
        children: [
          { title: "All Sales", path: ROUTE_PATHS.SALES.ROOT },
          { title: "Today's Sales", path: ROUTE_PATHS.SALES.TODAY },
        ]
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        children: [
            { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT },
        ]
      }
    ],

    // 💰 Cashier - POS focused
    cashier: [
      {
        ...MENU_MODULES.POS_TERMINAL,
        exact: true,
      },
      {
        title: "Quick Sales",
        path: ROUTE_PATHS.POS.QUICK_SALES,
        icon: CreditCard,
        resource: RESOURCE_KEYS.ORDER
      },
      {
        title: "Today's Summary",
        path: ROUTE_PATHS.POS.TODAY,
        icon: BarChart3,
        resource: RESOURCE_KEYS.REPORT
      },
      {
        title: "My Sales",
        path: ROUTE_PATHS.POS.MY_SALES,
        icon: FileText,
        resource: RESOURCE_KEYS.ORDER
      }, // Fixed indent
    ],

    // 📦 Store Manager
    "store-manager": [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.INVENTORY,
        children: [
          { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
          { title: "Stock Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, action: ACTION_KEYS.UPDATE },
          { title: "Stock Adjustment", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
          { title: "Low Stock Alerts", path: ROUTE_PATHS.INVENTORY.ALERTS },
        ]
      },
      MENU_MODULES.STAFF,
      {
        ...MENU_MODULES.REPORTS,
        title: "Daily Reports"
      }
    ],

    // 🚀 Dynamic Role Fallback (Master List of Operational Modules)
    // This list will be filtered by permissions in the Sidebar component
    "dynamic": [
      {
        ...MENU_MODULES.DASHBOARD,
        resource: RESOURCE_KEYS.ANALYTICS // Keep this as it is a specific page
      },
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.CATALOG,
        resource: undefined, // Removed to allow granular child access
        children: [
           { title: "Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT, resource: RESOURCE_KEYS.PRODUCT },
           { title: "Categories", path: ROUTE_PATHS.CATALOG.CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
           { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
           { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.PRODUCT },
           { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
           { title: "Attribute Groups", path: ROUTE_PATHS.CATALOG.ATTRIBUTE_GROUP, resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
           { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.SYSTEM },
        ]
      },
      {
        ...MENU_MODULES.SALES,
        resource: undefined, // Removed
        icon: CreditCard, // Changed icon for dynamic Sales
        children: [
          { title: "All Sales", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
          { title: "Today's Sales", path: ROUTE_PATHS.SALES.TODAY, resource: RESOURCE_KEYS.ORDER },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
          { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
          { title: "Delivery", path: ROUTE_PATHS.SALES.DELIVERY, resource: RESOURCE_KEYS.DELIVERY },
        ]
      },
      MENU_MODULES.STOREFRONT, // Added
      {
        ...MENU_MODULES.INVENTORY,
        icon: Package, // Revert icon to Package for dynamic
        children: [
          { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
          { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, action: ACTION_KEYS.UPDATE },
          { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
        ]
      },
      {
        ...MENU_MODULES.MARKETING,
        resource: undefined, // REMOVED: This blocked user with only 'adCampaign' access
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        resource: undefined, // Removed
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT, resource: RESOURCE_KEYS.CUSTOMER }, // Explicit resource added
          { title: "Loyalty", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
          { title: "Subscriptions", path: ROUTE_PATHS.CUSTOMERS.SUBSCRIPTIONS, resource: RESOURCE_KEYS.SUBSCRIPTION },
          { title: "Reviews", path: ROUTE_PATHS.CUSTOMERS.REVIEWS, resource: RESOURCE_KEYS.REVIEW },
        ]
      },
      MENU_MODULES.SUPPLIERS,
      MENU_MODULES.STAFF,
      {
        ...MENU_MODULES.SUPPORT,
        resource: undefined, // Removed
      },
      MENU_MODULES.CONTENT,
      MENU_MODULES.REPORTS,
      {
        ...MENU_MODULES.FINANCE,
        resource: undefined, // Removed
        children: [
            { title: "Payments", path: ROUTE_PATHS.FINANCE.PAYMENTS, resource: RESOURCE_KEYS.PAYMENT },
            { title: "Settlements", path: ROUTE_PATHS.FINANCE.SETTLEMENTS, resource: RESOURCE_KEYS.SETTLEMENT },
            { title: "Payouts", path: ROUTE_PATHS.FINANCE.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT },
            { title: "Fraud Detection", path: ROUTE_PATHS.FINANCE.FRAUD, resource: RESOURCE_KEYS.FRAUD_DETECTION },
            { title: "Audit Logs", path: ROUTE_PATHS.FINANCE.AUDIT_LOGS, resource: RESOURCE_KEYS.AUDIT_LOG },
        ]
      },
      MENU_MODULES.ACCOUNTING,
      MENU_MODULES.HRM,
      MENU_MODULES.VENDORS,
      MENU_MODULES.POS_CONFIG,
    ],
  },

  // 🔧 Common menus for all roles
  common: [
    {
      title: "Notifications",
      path: ROUTE_PATHS.COMMON.NOTIFICATIONS,
      icon: Bell,
    },
    {
      title: "My Profile",
      path: ROUTE_PATHS.COMMON.PROFILE,
      icon: User,
    },
    {
      title: "Settings",
      path: ROUTE_PATHS.COMMON.SETTINGS,
      icon: Settings,
      resource: RESOURCE_KEYS.SYSTEM
    },
    {
      title: "Help & Support",
      path: ROUTE_PATHS.COMMON.HELP,
      icon: HelpCircle,
    },
  ],
}

// Helper function to get menu for role
export const getSidebarMenu = (role: string, businessUnit: string) => {
  const commonMenu = sidebarMenuConfig.common
  
  // 1. Check if specific menu config exists for this role
  let roleMenu: any[] = [];
  
  if (Object.prototype.hasOwnProperty.call(sidebarMenuConfig.menus, role)) {
      roleMenu = sidebarMenuConfig.menus[role as keyof typeof sidebarMenuConfig.menus];
  } else {
      // 2. Fallback to Dynamic Menu for unknown rules
      // This ensures any new role gets the full operational list, 
      // which is then filtered by permissions in Sidebar.tsx
      roleMenu = sidebarMenuConfig.menus['dynamic'];
  }

  // If Super Admin is inside a Business Unit, append operational menus if needed
  // (Logic refined: Super Admin typically uses super-admin menu, but this logic adds operational items)
  if (role === 'super-admin' && businessUnit) {
    const businessAdminMenu = sidebarMenuConfig.menus['business-admin'];
    const operationalMenu = businessAdminMenu.filter(item => 
      item.title !== 'Dashboard' && 
      !roleMenu.some(existing => existing.title === item.title)
    );
    return [...roleMenu, ...operationalMenu, ...commonMenu];
  }

  return [...roleMenu, ...commonMenu]
}


