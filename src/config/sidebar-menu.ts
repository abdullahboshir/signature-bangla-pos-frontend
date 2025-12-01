// config/sidebar-menu.ts
import {
  LayoutDashboard,
  Users,
  UserCog,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Bell,
  User,
  Key,
  HelpCircle,
  CreditCard,
  Truck,
  FileText,
  PieChart,
  Store,
  ClipboardList,
  Wallet,
  Sparkles,
  MessageSquare,
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
      },
      {
        title: "Business Overview",
        path: "overview",
        icon: BarChart3,
      },
      {
        title: "Business Units",
        path: "business-units",
        icon: Store,
        children: [
          {
            title: "All Units",
            path: "business-units",
          },
          {
            title: "Add New Unit", 
            path: "business-units/new",
          },
          {
            title: "Unit Analytics",
            path: "business-units/analytics",
          },
        ],
      },
      {
        title: "User Management",
        path: "user-management",
        icon: Users,
        children: [
          {
            title: "All Users",
            path: "user-management/all-users",
          },
          {
            title: "Add User",
            path: "user-management/add-user",
          },
          {
            title: "Roles & Permissions",
            path: "user-management/roles-permissions",
          },
        ],
      },
      {
        title: "Financial Reports",
        path: "reports",
        icon: PieChart,
        children: [
          {
            title: "Revenue",
            path: "reports/revenue",
          },
          {
            title: "Expenses", 
            path: "reports/expenses",
          },
          {
            title: "Profit & Loss",
            path: "reports/profit-loss",
          },
        ],
      },
    ],

    // 🏢 Business Admin - Manages specific business unit
    "business-admin": [
      {
        title: "Dashboard", 
        path: "",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "POS Terminal",
        path: "pos",
        icon: ShoppingCart,
        badge: "Live",
      },
      {
        title: "Products",
        path: "products",
        icon: Package,
        children: [
          {
            title: "All Products",
            path: "products",
          },
          {
            title: "Add Product",
            path: "products/add",
          },
          {
            title: "Categories",
            path: "products/categories",
          },
          {
            title: "Inventory",
            path: "products/inventory",
          },
          {
            title: "Price Update",
            path: "products/pricing",
          },
          {
            title: "Print Labels",
            path: "products/labels",
          },
        ],
      },
      {
        title: "Sales",
        path: "sales",
        icon: CreditCard,
        children: [
          {
            title: "All Sales",
            path: "sales",
          },
          {
            title: "Today's Sales",
            path: "sales/today",
          },
          {
            title: "Returns",
            path: "sales/returns",
          },
        ],
      },
      {
        title: "Customers",
        path: "customers", 
        icon: Users,
        children: [
          {
            title: "Customer List",
            path: "customers",
          },
          {
            title: "Add Customer",
            path: "customers/new",
          },
          {
            title: "Loyalty Program",
            path: "customers/loyalty",
          },
        ],
      },
      {
        title: "Suppliers",
        path: "suppliers",
        icon: Truck,
      },
      {
        title: "Reports",
        path: "reports",
        icon: BarChart3,
      },
    ],

    // 💰 Cashier - POS focused
    cashier: [
      {
        title: "POS Terminal",
        path: "pos",
        icon: ShoppingCart,
        exact: true,
      },
      {
        title: "Quick Sales",
        path: "quick-sales",
        icon: CreditCard,
      },
      {
        title: "Today's Summary",
        path: "today",
        icon: BarChart3,
      },
      {
        title: "My Sales",
        path: "my-sales",
        icon: FileText,
      },
    ],

    // 📦 Store Manager
    "store-manager": [
      {
        title: "Dashboard",
        path: "",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "POS",
        path: "pos",
        icon: ShoppingCart,
      },
      {
        title: "Inventory",
        path: "inventory",
        icon: Package,
        children: [
          {
            title: "Stock Levels",
            path: "inventory",
          },
          {
            title: "Stock Transfers",
            path: "inventory/transfers",
          },
          {
            title: "Stock Adjustment",
            path: "inventory/adjustments",
          },
          {
            title: "Low Stock Alerts",
            path: "inventory/alerts",
          },
        ],
      },
      {
        title: "Staff Management",
        path: "staff",
        icon: Users,
      },
      {
        title: "Daily Reports",
        path: "reports",
        icon: BarChart3,
      },
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
  const roleMenu = sidebarMenuConfig.menus[role as keyof typeof sidebarMenuConfig.menus] || []
  const commonMenu = sidebarMenuConfig.common
  
  return [...roleMenu, ...commonMenu]
}

// Helper to get business unit info
export const getBusinessUnitInfo = (businessUnit: string) => {
  return sidebarMenuConfig.businessUnits[businessUnit as keyof typeof sidebarMenuConfig.businessUnits]
}