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
  PieChart,
  Store,
  Sparkles,
  Megaphone,
  Ticket,
  MessageCircle,
  ShieldAlert,
  Gavel,
  History,
  Activity,
  Box,
  Tags,
  BadgePercent,
  RefreshCcw,
  Gift,
  Heart,
  Repeat,
  Headphones,
  DollarSign,
  Landmark,
  Scale,
  FileSearch,
} from "lucide-react"

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
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
        resource: "system"
      },
      // --- Core Business ---
      {
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
      {
        title: "Stores",
        path: "stores",
        icon: Store,
        resource: "store",
        children: [
          { title: "All Stores", path: "stores", resource: "store" },
          { title: "Add Store", path: "stores/new", action: "create" },
        ]
      },
      {
        title: "User Management",
        path: "user-management",
        icon: Users,
        resource: "user",
        children: [
          { title: "All Users", path: "user-management/all-users" },
          { title: "Add User", path: "user-management/add-user", action: "create" },
          { title: "Roles & Permissions", path: "user-management/roles-permissions", resource: "role" },
        ],
      },
      // --- Products & Inventory ---
      {
        title: "Catalog",
        path: "catalog",
        icon: Package,
        resource: "product",
        children: [
           { title: "Products", path: "catalog/product", resource: "product" },
           { title: "Add Product", path: "catalog/product/add", action: "create" },
           { title: "Categories", path: "catalog/category", resource: "category" },
           { title: "Sub-Categories", path: "catalog/sub-category", resource: "category" },
           { title: "Child-Categories", path: "catalog/child-category", resource: "category" },
           { title: "Brands", path: "catalog/brand", resource: "brand" },
           { title: "Tax", path: "catalog/tax", resource: "tax" },
           { title: "Units", path: "catalog/unit", resource: "unit" },
           // { title: "Inventory", path: "products/inventory", resource: "inventory" },
           // { title: "Suppliers", path: "products/suppliers", resource: "supplier" },
           // { title: "Vendors", path: "products/vendors", resource: "vendor" },
        ]
      },
      // --- Sales & Orders ---
      {
        title: "Sales & Orders",
        path: "sales",
        icon: ShoppingCart,
        resource: "order",
        children: [
          { title: "All Orders", path: "sales", resource: "order" },
          { title: "POS", path: "pos", resource: "order" }, // Assumed POS permission maps to order or generic
          { title: "Shipping", path: "sales/shipping", resource: "shipping" },
          { title: "Delivery", path: "sales/delivery", resource: "delivery" },
          { title: "Returns", path: "sales/returns", resource: "return" },
        ]
      },
      // --- Marketing ---
      {
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
      // --- Customers ---
      {
        title: "Customers",
        path: "customers",
        icon: User,
        resource: "customer",
        children: [
          { title: "All Customers", path: "customers", resource: "customer" },
          { title: "Subscriptions", path: "customers/subscriptions", resource: "subscription" },
          { title: "Reviews", path: "customers/reviews", resource: "review" },
        ]
      },
      // --- Support ---
      {
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
      // --- Content ---
      {
        title: "Content",
        path: "content",
        icon: FileText,
        resource: "content",
      },
      // --- Financials ---
      {
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
        ]
      },
      // --- System ---
       {
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
    ],

    // 🏢 Business Admin - Manages specific business unit
    "business-admin": [
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
        resource: "system"
      },
      {
        title: "POS Terminal",
        path: "pos",
        icon: ShoppingCart,
        badge: "Live",
        resource: "order"
      },
      {
        title: "Catalog",
        path: "catalog",
        icon: Package,
        resource: "product",
        children: [
          { title: "All Products", path: "catalog/product" },
          { title: "Add Product", path: "catalog/product/add", action: "create" },
          { title: "Categories", path: "catalog/category", resource: "category" },
          { title: "Sub-Categories", path: "catalog/sub-category", resource: "category" },
          { title: "Child-Categories", path: "catalog/child-category", resource: "category" },
          { title: "Brands", path: "catalog/brand", resource: "brand" },
          { title: "Units", path: "catalog/unit", resource: "unit" },
          { title: "Tax", path: "catalog/tax", resource: "tax" },
          // { title: "Inventory", path: "products/inventory", resource: "inventory" },
          // { title: "Price Update", path: "products/pricing", resource: "product" },
          // { title: "Print Labels", path: "products/labels", resource: "product" },
        ],
      },
      {
        title: "Sales",
        path: "sales",
        icon: CreditCard,
        resource: "order",
        children: [
          { title: "All Sales", path: "sales" },
          { title: "Today's Sales", path: "sales/today" },
          { title: "Returns", path: "sales/returns", resource: "return" },
        ],
      },
      {
        title: "Customers",
        path: "customers",
        icon: Users,
        resource: "customer",
        children: [
          { title: "Customer List", path: "customers" },
          { title: "Add Customer", path: "customers/new", action: "create" },
          { title: "Loyalty Program", path: "customers/loyalty", resource: "loyalty" },
        ],
      },
      {
        title: "Suppliers",
        path: "suppliers",
        icon: Truck,
        resource: "supplier"
      },
      {
        title: "Reports",
        path: "reports",
        icon: BarChart3,
        resource: "report"
      },
    ],
    
    // Seller - Sales & Catalog focused
    "seller": [
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
        resource: "system"
      },
      {
        title: "Catalog",
        path: "catalog",
        icon: Package,
        resource: "product",
        children: [
          { title: "All Products", path: "catalog/product" },
          { title: "Brands", path: "catalog/brand", resource: "brand" },
        ],
      },
      {
        title: "Sales",
        path: "sales",
        icon: CreditCard,
        resource: "order",
        children: [
          { title: "All Sales", path: "sales" },
          { title: "Today's Sales", path: "sales/today" },
        ],
      },
      {
        title: "Customers",
        path: "customers",
        icon: Users,
        resource: "customer",
        children: [
          { title: "Customer List", path: "customers" },
        ],
      },
    ],

    // 💰 Cashier - POS focused
    cashier: [
      {
        title: "POS Terminal",
        path: "pos",
        icon: ShoppingCart,
        exact: true,
        resource: "order"
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
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
        resource: "system"
      },
      {
        title: "POS",
        path: "pos",
        icon: ShoppingCart,
        resource: "order"
      },
      {
        title: "Inventory",
        path: "inventory",
        icon: Package,
        resource: "inventory",
        children: [
          { title: "Stock Levels", path: "inventory" },
          { title: "Stock Transfers", path: "inventory/transfers", action: "update" },
          { title: "Stock Adjustment", path: "inventory/adjustments", action: "update" },
          { title: "Low Stock Alerts", path: "inventory/alerts" },
        ],
      },
      {
        title: "Staff Management",
        path: "staff",
        icon: Users,
        resource: "user"
      },
      {
        title: "Daily Reports",
        path: "reports",
        icon: BarChart3,
        resource: "report"
      },
    ],


    // 🚀 Dynamic Role Fallback (Master List of Operational Modules)
    // This list will be filtered by permissions in the Sidebar component
    "dynamic": [
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
        resource: "analytics" // Keep this as it is a specific page
      },
      {
         title: "POS Terminal",
         path: "pos",
         icon: ShoppingCart,
         resource: "order"
      },
      {
        title: "Catalog",
        path: "catalog",
        icon: Package,
        // resource: "product", // Removed to allow granular child access
        children: [
           { title: "Products", path: "catalog/product", resource: "product" },
           { title: "Categories", path: "catalog/category", resource: "category" },
           { title: "Brands", path: "catalog/brand", resource: "brand" },
           { title: "Units", path: "catalog/unit", resource: "product" },
           { title: "Tax", path: "catalog/tax", resource: "system" },
        ]
      },
      {
        title: "Sales",
        path: "sales",
        icon: CreditCard,
        // resource: "order", // Removed
        children: [
          { title: "All Sales", path: "sales", resource: "order" },
          { title: "Today's Sales", path: "sales/today", resource: "order" },
          { title: "Returns", path: "sales/returns", resource: "return" },
          { title: "Shipping", path: "sales/shipping", resource: "shipping" },
          { title: "Delivery", path: "sales/delivery", resource: "delivery" },
        ]
      },
      {
        title: "Inventory",
        path: "inventory",
        icon: Box,
        resource: "inventory", // Keep if 'inventory' is generic. Or remove if granular.
        children: [
          { title: "Stock Levels", path: "inventory" },
          { title: "Transfers", path: "inventory/transfers", action: "update" },
          { title: "Adjustments", path: "inventory/adjustments", action: "update" },
        ]
      },
      {
        title: "Marketing",
        path: "marketing",
        icon: Megaphone,
        // resource: "promotion", // REMOVED: This blocked user with only 'adCampaign' access
        children: [
          { title: "Promotions", path: "marketing/promotions", resource: "promotion" },
          { title: "Coupons", path: "marketing/coupons", resource: "coupon" },
          { title: "Ad Campaigns", path: "marketing/campaigns", resource: "adCampaign" },
          { title: "Affiliates", path: "marketing/affiliates", resource: "affiliate" },
          { title: "Loyalty", path: "marketing/loyalty", resource: "loyalty" },
          { title: "SEO", path: "marketing/seo", resource: "seo" },
        ]
      },
      {
        title: "Customers",
        path: "customers",
        icon: Users,
        // resource: "customer", // Removed
        children: [
          { title: "Customer List", path: "customers", resource: "customer" }, // Explicit resource added
          { title: "Loyalty", path: "customers/loyalty", resource: "loyalty" },
          { title: "Subscriptions", path: "customers/subscriptions", resource: "subscription" },
          { title: "Reviews", path: "customers/reviews", resource: "review" },
        ]
      },
      {
        title: "Suppliers",
        path: "suppliers",
        icon: Truck,
        resource: "supplier" // Keep (no children with mixed resources mostly)
      },
      {
          title: "Staff Management",
          path: "staff",
          icon: Users,
          resource: "user"
      },
      {
        title: "Support",
        path: "support",
        icon: Headphones,
        // resource: "ticket", // Removed
        children: [
           { title: "Tickets", path: "support/tickets", resource: "ticket" },
           { title: "Chat", path: "support/chat", resource: "chat" },
           { title: "Disputes", path: "support/disputes", resource: "dispute" },
        ]
      },
      {
        title: "Content",
        path: "content",
        icon: FileText,
        resource: "content",
      },
      {
        title: "Reports",
        path: "reports",
        icon: BarChart3,
        resource: "report"
      },
      {
        title: "Finance",
        path: "finance",
        icon: DollarSign,
        // resource: "payment", // Removed
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
    const operationalMenu = businessAdminMenu.filter(item => item.title !== 'Dashboard');
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
