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

// 📦 Reusable Menu Modules (DRY Principle)
const MENU_MODULES = {
  DASHBOARD: {
    title: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    exact: true,
    resource: "system"
  },
  BUSINESS_UNITS: {
    title: "Business Units",
    path: "business-units",
    icon: Store,
    resource: "businessUnit",
    children: [
      { title: "All Units", path: "business-units" },
      { title: "Add New Unit", path: "business-units/new", action: "create" },
      { title: "Analytics", path: "business-units/analytics", resource: "analytics" },
    ],
  },
  OUTLETS: {
    title: "Outlets",
    path: "outlets",
    icon: Store,
    resource: "outlet",
    children: [
      { title: "All Outlets", path: "outlets", resource: "outlet" },
      { title: "Add Outlet", path: "outlets/new", action: "create" },
    ]
  },
  USER_MANAGEMENT: {
    title: "User Management",
    path: "user-management",
    icon: Users,
    resource: "user",
    children: [
      { title: "All Users", path: "user-management/all-users" },
      { title: "Roles & Permissions", path: "user-management/roles-permissions", resource: "role" },
    ],
  },
  CATALOG: { // Full Catalog Structure
    title: "Catalog",
    path: "catalog",
    icon: Package,
    resource: "product",
    children: [
      { title: "Products", path: "catalog/product", resource: "product" }, // Using "Products" as standard
      { title: "Add Product", path: "catalog/product/add", action: "create" },
      { title: "Categories", path: "catalog/category", resource: "category" },
      { title: "Sub-Categories", path: "catalog/sub-category", resource: "category" },
      { title: "Child-Categories", path: "catalog/child-category", resource: "category" },
      { title: "Brands", path: "catalog/brand", resource: "brand" },
      { title: "Units", path: "catalog/unit", resource: "unit" },
      { title: "Attributes", path: "catalog/attribute", resource: "attribute" },
      { title: "Attribute Groups", path: "catalog/attribute-groups", resource: "attributeGroup" },
      { title: "Tax", path: "catalog/tax", resource: "tax" },
    ],
  },
  INVENTORY: {
    title: "Inventory",
    path: "inventory",
    icon: Package,
    resource: "inventory",
    children: [
      { title: "Stock Levels", path: "inventory" },
      { title: "Purchases", path: "inventory/purchase", resource: "purchase" },
      { title: "Adjustments", path: "inventory/adjustments", action: "update" },
      { title: "Stock Ledger", path: "inventory/ledger" },
      { title: "Warehouses", path: "inventory/warehouses", resource: "warehouse" },
      // { title: "Stock Transfers", path: "inventory/transfers", action: "update" }, // Added from Store Manager
      // { title: "Low Stock Alerts", path: "inventory/alerts" }, // Added from Store Manager
    ]
  },
  PURCHASES: {
    title: "Purchases",
    path: "inventory/purchase",
    icon: ShoppingCart,
    resource: "purchase",
    children: [
      { title: "All Purchases", path: "purchases" },
    ]
  },
  SALES: {
    title: "Sales & Orders", // Standardized Title
    path: "sales",
    icon: ShoppingCart,
    resource: "order",
    children: [
      { title: "All Orders", path: "sales", resource: "order" },
      { title: "POS", path: "pos", resource: "order" },
      { title: "Shipping", path: "sales/shipping", resource: "shipping" },
      { title: "Delivery", path: "sales/delivery", resource: "delivery" },
      { title: "Returns", path: "sales/returns", resource: "return" },
    ]
  },
  MARKETING: {
    title: "Marketing",
    path: "marketing",
    icon: Megaphone,
    resource: "promotion",
    children: [
      { title: "Promotions", path: "marketing/promotions", resource: "promotion" },
      { title: "Coupons", path: "marketing/coupons", resource: "coupon" },
      { title: "Ad Campaigns", path: "marketing/campaigns", resource: "adCampaign" },
      { title: "Affiliates", path: "marketing/affiliates", resource: "affiliate" },
      { title: "Loyalty", path: "marketing/loyalty", resource: "loyalty" },
      { title: "SEO", path: "marketing/seo", resource: "seo" },
    ]
  },
  CUSTOMERS: {
    title: "Customers",
    path: "customers",
    icon: User,
    resource: "customer",
    children: [
      { title: "Customer List", path: "customers", resource: "customer" },
      { title: "Add Customer", path: "customers/new", action: "create" },
      { title: "Loyalty Program", path: "customers/loyalty", resource: "loyalty" },
      { title: "Subscriptions", path: "customers/subscriptions", resource: "subscription" },
      { title: "Reviews", path: "customers/reviews", resource: "review" },
    ]
  },
  SUPPORT: {
    title: "Support",
    path: "support",
    icon: Headphones,
    resource: "ticket",
    children: [
      { title: "Tickets", path: "support/tickets", resource: "ticket" },
      { title: "Chat", path: "support/chat", resource: "chat" },
      { title: "Disputes", path: "support/disputes", resource: "dispute" },
    ]
  },
  CONTENT: {
    title: "Content",
    path: "content",
    icon: FileText,
    resource: "content",
  },
  FINANCE: {
    title: "Financials",
    path: "finance",
    icon: DollarSign,
    resource: "payment",
    children: [
      { title: "Payments", path: "finance/payments", resource: "payment" },
      { title: "Settlements", path: "finance/settlements", resource: "settlement" },
      { title: "Payouts", path: "finance/payouts", resource: "payout" },
      { title: "Fraud Detection", path: "finance/fraud", resource: "fraudDetection" },
      { title: "Reports", path: "finance/reports", resource: "report" },
      { title: "Analytics", path: "finance/analytics", resource: "analytics" },
      { title: "Audit Logs", path: "finance/audit-logs", resource: "auditLog" },
    ]
  },
  SYSTEM: {
    title: "System",
    path: "system",
    icon: Settings,
    resource: "system",
    children: [
      { title: "Audit Logs", path: "system/audit-logs", resource: "auditLog" },
      { title: "Notifications", path: "system/notifications", resource: "notification" },
      { title: "Settings", path: "settings", resource: "system" },
    ]
  },
  SUPPLIERS: {
    title: "Suppliers",
    path: "suppliers",
    icon: Truck,
    resource: "supplier"
  },
  REPORTS: {
    title: "Reports",
    path: "reports",
    icon: BarChart3,
    resource: "report"
  },
  POS_TERMINAL: {
    title: "POS Terminal",
    path: "pos",
    icon: ShoppingCart,
    resource: "order"
  },
  STAFF: {
    title: "Staff Management",
    path: "staff",
    icon: Users,
    resource: "user"
  },
  STOREFRONT: {
    title: "Online Store",
    path: "online-store",
    icon: Globe,
    resource: "storefront",
    children: [
      { title: "Store Builder", path: "online-store/ui-builder", resource: "storefront" },
      { title: "Pages", path: "online-store/pages", resource: "storefront" },
      { title: "Settings", path: "online-store/settings", resource: "storefront" },
    ]
  }
};


export const sidebarMenuConfig = {
  // 🏪 Business Unit specific menus
  businessUnits: {
    telemedicine: {
      name: "Telemedicine",
      icon: Sparkles,
      color: "text-blue-600",
    },
    clothing: {
      name: "Clothing",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    grocery: {
      name: "Grocery",
      icon: Package,
      color: "text-green-600",
    },
    books: {
      name: "Books",
      icon: FileText,
      color: "text-orange-600",
    },
  },

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
      MENU_MODULES.SALES,
      MENU_MODULES.MARKETING,
      MENU_MODULES.CUSTOMERS,
      MENU_MODULES.SUPPORT,
      MENU_MODULES.CONTENT,
      MENU_MODULES.FINANCE,
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
          { title: "All Products", path: "catalog/product" },
          { title: "Add Product", path: "catalog/product/add", action: "create" },
          { title: "Categories", path: "catalog/category", resource: "category" },
          { title: "Sub-Categories", path: "catalog/sub-category", resource: "category" },
          { title: "Child-Categories", path: "catalog/child-category", resource: "category" },
          { title: "Brands", path: "catalog/brand", resource: "brand" },
          { title: "Units", path: "catalog/unit", resource: "unit" },
          { title: "Attributes", path: "catalog/attribute", resource: "attribute" },
          { title: "Tax", path: "catalog/tax", resource: "tax" },
        ],
      },
      MENU_MODULES.STOREFRONT, // Added
      {
        ...MENU_MODULES.INVENTORY,
        children: [
            { title: "Stock Levels", path: "inventory" },
            { title: "Purchases", path: "inventory/purchase", resource: "purchase" },
            { title: "Adjustments", path: "inventory/adjustments", action: "update" },
            { title: "Stock Ledger", path: "inventory/ledger" },
            { title: "Warehouses", path: "inventory/warehouses", resource: "warehouse" },
        ]
      },
      {
        ...MENU_MODULES.SALES, 
        title: "Sales", // Override title to just "Sales" if preferred
        icon: CreditCard, // Changed icon for Business Admin Sales
        children: [
          { title: "All Sales", path: "sales" },
          { title: "Today's Sales", path: "sales/today" },
          { title: "Returns", path: "sales/returns", resource: "return" },
        ],
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        children: [
          { title: "Customer List", path: "customers" },
          { title: "Add Customer", path: "customers/new", action: "create" },
          { title: "Loyalty Program", path: "customers/loyalty", resource: "loyalty" },
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
            { title: "All Products", path: "catalog/product" },
            { title: "Brands", path: "catalog/brand", resource: "brand" },
         ]
      },
      {
        ...MENU_MODULES.SALES,
        title: "Sales",
        icon: CreditCard,
        children: [
          { title: "All Sales", path: "sales" },
          { title: "Today's Sales", path: "sales/today" },
        ]
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        children: [
            { title: "Customer List", path: "customers" },
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
        path: "quick-sales",
        icon: CreditCard,
        resource: "order"
      },
      {
        title: "Today's Summary",
        path: "today",
        icon: BarChart3,
        resource: "report"
      },
      {
        title: "My Sales",
        path: "my-sales",
        icon: FileText,
        resource: "order"
      },
    ],

    // 📦 Store Manager
    "store-manager": [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.INVENTORY,
        children: [
          { title: "Stock Levels", path: "inventory" },
          { title: "Stock Transfers", path: "inventory/transfers", action: "update" },
          { title: "Stock Adjustment", path: "inventory/adjustments", action: "update" },
          { title: "Low Stock Alerts", path: "inventory/alerts" },
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
        resource: "analytics" // Keep this as it is a specific page
      },
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.CATALOG,
        resource: undefined, // Removed to allow granular child access
        children: [
           { title: "Products", path: "catalog/product", resource: "product" },
           { title: "Categories", path: "catalog/category", resource: "category" },
           { title: "Brands", path: "catalog/brand", resource: "brand" },
           { title: "Units", path: "catalog/unit", resource: "product" },
           { title: "Attributes", path: "catalog/attribute", resource: "attribute" },
           { title: "Attribute Groups", path: "catalog/attribute-groups", resource: "attributeGroup" },
           { title: "Tax", path: "catalog/tax", resource: "system" },
        ]
      },
      {
        ...MENU_MODULES.SALES,
        resource: undefined, // Removed
        icon: CreditCard, // Changed icon for dynamic Sales
        children: [
          { title: "All Sales", path: "sales", resource: "order" },
          { title: "Today's Sales", path: "sales/today", resource: "order" },
          { title: "Returns", path: "sales/returns", resource: "return" },
          { title: "Shipping", path: "sales/shipping", resource: "shipping" },
          { title: "Delivery", path: "sales/delivery", resource: "delivery" },
        ]
      },
      MENU_MODULES.STOREFRONT, // Added
      {
        ...MENU_MODULES.INVENTORY,
        icon: Package, // Revert icon to Package for dynamic
        children: [
          { title: "Stock Levels", path: "inventory" },
          { title: "Transfers", path: "inventory/transfers", action: "update" },
          { title: "Adjustments", path: "inventory/adjustments", action: "update" },
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
          { title: "Customer List", path: "customers", resource: "customer" }, // Explicit resource added
          { title: "Loyalty", path: "customers/loyalty", resource: "loyalty" },
          { title: "Subscriptions", path: "customers/subscriptions", resource: "subscription" },
          { title: "Reviews", path: "customers/reviews", resource: "review" },
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
            { title: "Payments", path: "finance/payments", resource: "payment" },
            { title: "Settlements", path: "finance/settlements", resource: "settlement" },
            { title: "Payouts", path: "finance/payouts", resource: "payout" },
            { title: "Fraud Detection", path: "finance/fraud", resource: "fraudDetection" },
            { title: "Audit Logs", path: "finance/audit-logs", resource: "auditLog" },
        ]
      }
    ],
  },

  // 🔧 Common menus for all roles
  common: [
    {
      title: "Notifications",
      path: "notifications",
      icon: Bell,
    },
    {
      title: "My Profile",
      path: "profile",
      icon: User,
    },
    {
      title: "Settings",
      path: "settings",
      icon: Settings,
      resource: "system"
    },
    {
      title: "Help & Support",
      path: "help",
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

// Helper to get business unit info
export const getBusinessUnitInfo = (businessUnit: string) => {
  if (!businessUnit) return undefined;
  const units = sidebarMenuConfig.businessUnits;
  if (Object.prototype.hasOwnProperty.call(units, businessUnit)) {
    return units[businessUnit as keyof typeof units];
  }
  return undefined;
}
