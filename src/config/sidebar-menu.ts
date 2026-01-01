// config/sidebar-menu.ts
import {
  Bell,
  User,
  HelpCircle,
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  DollarSign,
  Users,
  Store,
  CreditCard,
  Truck,
  FileText,
  Settings
} from "lucide-react"
import { RESOURCE_KEYS, ACTION_KEYS, BUSINESS_PERMISSIONS } from "./permission-keys"
import { APP_MODULES, ROUTE_PATHS } from "./module-registry"

// Re-export or alias for compatibility if needed, using the registry
const MENU_MODULES = APP_MODULES;


export const sidebarMenuConfig = {
  // 👥 Role-based menu items
  menus: {
    // 👑 SUPER ADMIN - Platform Management (Industry Standard Structure)
    "super-admin": [
      // 📊 1. OVERVIEW
      MENU_MODULES.DASHBOARD,
      
      // 🏢 2. TENANT MANAGEMENT
      MENU_MODULES.BUSINESS_UNITS,
      
      // 💼 3. BILLING & FINANCE
      MENU_MODULES.FINANCE, // Subscriptions, Invoices, Payouts, Revenue
      
      // 📦 4. PACKAGES & LICENSING (NEW - Critical for SaaS)
      MENU_MODULES.PACKAGES, // Plans, Features, Licenses, Trials
      
      // 👥 5. USER & ACCESS MANAGEMENT
      // 👥 5. USER & ACCESS MANAGEMENT
      {
        ...MENU_MODULES.USER_MANAGEMENT,
        children: [
           { title: "Platform Users", path: "/global/user-management/platform-users" },
           { title: "Platform Roles", path: "/global/user-management/platform-roles" },
           { title: "Business Users", path: "/global/user-management/business-users" },
           { title: "Business Roles", path: "/global/user-management/business-roles" },
        ]
      },
      
      // 🎫 6. SUPPORT & TICKETS
      MENU_MODULES.SUPPORT,
      
      // 📈 7. ANALYTICS & REPORTS
      MENU_MODULES.REPORTS,
      
      // 🔒 8. SECURITY & RISK
      MENU_MODULES.RISK_MANAGEMENT,
      
      // 🔌 9. INTEGRATIONS (NEW - Third-party services)
      MENU_MODULES.INTEGRATIONS, // Payment, Shipping, Email/SMS, Webhooks, API Keys
      
      // 🚚 10. OPERATIONS
      MENU_MODULES.LOGISTICS, // Courier providers (Global config)
      
      // 🔔 11. NOTIFICATIONS (NEW - Platform alerts)
      MENU_MODULES.NOTIFICATIONS, // Alert Center, Announcements
      
      // ⚙️ 12. SYSTEM SETTINGS (Keep at bottom)
      MENU_MODULES.SYSTEM, // Module Toggles, Templates, Localization, Backups
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
          { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
          { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.UNIT },
          { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
          { title: "Attribute Groups", path: ROUTE_PATHS.CATALOG.ATTRIBUTE_GROUP, resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
          { title: "Warranties", path: "/catalog/warranties", resource: RESOURCE_KEYS.WARRANTY },
          { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.TAX },
        ],
      },
      MENU_MODULES.STOREFRONT,
      {
        ...MENU_MODULES.INVENTORY,
        children: [
            { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
            { title: "Purchases", path: ROUTE_PATHS.INVENTORY.PURCHASE, resource: RESOURCE_KEYS.PURCHASE },
            { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
            { title: "Stock Ledger", path: ROUTE_PATHS.INVENTORY.LEDGER },
            { title: "Warehouses", path: ROUTE_PATHS.INVENTORY.WAREHOUSES, resource: RESOURCE_KEYS.WAREHOUSE },
            { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
        ]
      },
      {
        ...MENU_MODULES.SALES, 
        title: "Sales & Orders",
        icon: CreditCard,
        children: [
          { title: "All Orders", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
          { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
          { title: "Invoices", path: ROUTE_PATHS.SALES.INVOICES, resource: RESOURCE_KEYS.INVOICE },
        ],
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT },
          { title: "Add Customer", path: ROUTE_PATHS.CUSTOMERS.NEW, action: ACTION_KEYS.CREATE },
          { title: "Loyalty Program", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
          { title: "Subscriptions", path: ROUTE_PATHS.CUSTOMERS.SUBSCRIPTIONS, resource: RESOURCE_KEYS.SUBSCRIPTION },
          { title: "Reviews", path: ROUTE_PATHS.CUSTOMERS.REVIEWS, resource: RESOURCE_KEYS.REVIEW },
        ],
      },
      {
        ...MENU_MODULES.MARKETING,
        children: [
            { title: "Promotions", path: ROUTE_PATHS.MARKETING.PROMOTIONS, resource: RESOURCE_KEYS.PROMOTION },
            { title: "Coupons", path: ROUTE_PATHS.MARKETING.COUPONS, resource: RESOURCE_KEYS.COUPON },
            { title: "Ad Campaigns", path: ROUTE_PATHS.MARKETING.CAMPAIGNS, resource: RESOURCE_KEYS.AD_CAMPAIGN },
        ] 
      },
      MENU_MODULES.SUPPLIERS,
      MENU_MODULES.VENDORS,
      MENU_MODULES.EXPENSES,
      MENU_MODULES.ACCOUNTING,
      MENU_MODULES.HRM,
      MENU_MODULES.REPORTS,
      MENU_MODULES.POS_CONFIG,
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

    "dynamic": [
      {
        ...MENU_MODULES.DASHBOARD,
        resource: RESOURCE_KEYS.ANALYTICS 
      },
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.CATALOG,
        resource: undefined, 
        children: [
           { title: "Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT, resource: RESOURCE_KEYS.PRODUCT },
           { title: "Add Product", path: ROUTE_PATHS.CATALOG.PRODUCT.ADD, action: ACTION_KEYS.CREATE, resource: RESOURCE_KEYS.PRODUCT },
           { title: "Categories", path: ROUTE_PATHS.CATALOG.CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
           { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
           { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.UNIT },
           { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
           { title: "Attribute Groups", path: ROUTE_PATHS.CATALOG.ATTRIBUTE_GROUP, resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
           { title: "Warranties", path: "/catalog/warranties", resource: RESOURCE_KEYS.WARRANTY },
           { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.TAX },
        ]
      },
      {
        ...MENU_MODULES.SALES,
        resource: undefined, 
        icon: CreditCard,
        children: [
          { title: "All Sales", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
          { title: "Today's Sales", path: ROUTE_PATHS.SALES.TODAY, resource: RESOURCE_KEYS.ORDER },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
          { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
          { title: "Delivery", path: ROUTE_PATHS.SALES.DELIVERY, resource: RESOURCE_KEYS.DELIVERY },
        ]
      },
      {
        ...MENU_MODULES.STOREFRONT,
        resource: undefined,
      }, 
      {
        ...MENU_MODULES.INVENTORY,
        icon: Package, 
        children: [
          { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT, resource: RESOURCE_KEYS.INVENTORY },
          { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
          { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.ADJUST },
        ]
      },
      {
        ...MENU_MODULES.MARKETING,
        resource: undefined, 
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        resource: undefined, 
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT, resource: RESOURCE_KEYS.CUSTOMER }, 
          { title: "Loyalty", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
          { title: "Subscriptions", path: ROUTE_PATHS.CUSTOMERS.SUBSCRIPTIONS, resource: RESOURCE_KEYS.SUBSCRIPTION },
          { title: "Reviews", path: ROUTE_PATHS.CUSTOMERS.REVIEWS, resource: RESOURCE_KEYS.REVIEW },
        ]
      },
      {
        ...MENU_MODULES.SUPPLIERS,
        resource: RESOURCE_KEYS.SUPPLIER,
      },
      {
        ...MENU_MODULES.STAFF,
        resource: RESOURCE_KEYS.STAFF, 
      },
      {
        ...MENU_MODULES.SUPPORT,
        resource: RESOURCE_KEYS.TICKET,
      },
      {
        ...MENU_MODULES.CONTENT,
        resource: RESOURCE_KEYS.CONTENT, 
      },
      {
        ...MENU_MODULES.REPORTS,  
        resource: RESOURCE_KEYS.REPORT, 
      },
      {
        ...MENU_MODULES.FINANCE,
        resource: undefined, 
        children: [
            { title: "Payments", path: ROUTE_PATHS.FINANCE.PAYMENTS, resource: RESOURCE_KEYS.PAYMENT },
            { title: "Settlements", path: ROUTE_PATHS.FINANCE.SETTLEMENTS, resource: RESOURCE_KEYS.SETTLEMENT },
            { title: "Payouts", path: ROUTE_PATHS.FINANCE.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT },
            { title: "Fraud Detection", path: ROUTE_PATHS.FINANCE.FRAUD, resource: RESOURCE_KEYS.FRAUD_DETECTION },
            { title: "Audit Logs", path: ROUTE_PATHS.FINANCE.AUDIT_LOGS, resource: RESOURCE_KEYS.AUDIT_LOG },
        ]
      },
      {
        ...MENU_MODULES.ACCOUNTING,
        resource: undefined, 
      },
      {
        ...MENU_MODULES.LOGISTICS,
        resource: undefined, 
      },
      {
        ...MENU_MODULES.RISK_MANAGEMENT,
        resource: undefined, 
      },
      {
        ...MENU_MODULES.HRM,
        resource: undefined, 
      },
      {
        ...MENU_MODULES.VENDORS,
        resource: undefined,
      },
      {
        ...MENU_MODULES.POS_CONFIG,
        resource: undefined, 
      },
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
export const getSidebarMenu = (role: string, businessUnit: string, outletId?: string) => {
  
  let baseUrl = "/";
  if (businessUnit) {
      baseUrl = `/${businessUnit}`;
  } else if (role === 'super-admin') {
      baseUrl = `/global`; 
  } else {
      baseUrl = `/global`; 
  }
  const prefixMenuPaths = (items: any[]): any[] => {
    return items.map(item => {
      const newItem = { ...item };
      
      if (newItem.path !== undefined) {
         if (newItem.path === "") {
             newItem.path = baseUrl;
         } else if (newItem.path && !newItem.path.startsWith('/') && !newItem.path.startsWith('http')) {
             newItem.path = `${baseUrl}/${newItem.path}`;
         }
      }

      if (newItem.children) {
        newItem.children = prefixMenuPaths(newItem.children);
      }
      return newItem;
    });
  };

  const commonMenu = sidebarMenuConfig.common
  const dynamicMenu = sidebarMenuConfig.menus['dynamic'];

  // 0. Outlet Context Logic 🏪
  // If user is inside an Outlet (URL has outletId), show Outlet-specific menu
  if (outletId) {
      const rawOutletMenu = [
          {
            title: "Outlet Dashboard",
            path: ``, 
            icon: LayoutDashboard,
            exact: true,
          },
          {
            title: "POS Terminal",
            path: ROUTE_PATHS.SALES.POS, 
            icon: ShoppingCart,
            badge: "Live"
          },
          {
            title: "Sales History",
             path: ROUTE_PATHS.SALES.ROOT
          },
          {
              title: "Inventory",
              icon: Package,
              children: [
                  { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
                  { title: "Transfer Requests", path: ROUTE_PATHS.INVENTORY.TRANSFERS },
                  { title: "Low Stock", path: ROUTE_PATHS.INVENTORY.ALERTS },
              ]
          },
          {
              title: "Cash Management",
              icon: DollarSign,
              children: [
                   { title: "Registers", path: ROUTE_PATHS.POS_CONFIG.REGISTERS },
                   { title: "Expenses", path: ROUTE_PATHS.ACCOUNTING.EXPENSES },
              ]
          },
          {
              title: "Customers",
              path: ROUTE_PATHS.CUSTOMERS.ROOT,
              icon: Users
          },
          {
              title: "Reports",
              icon: BarChart3,
              children: [
                  { title: "Daily Summary", path: ROUTE_PATHS.REPORTS.SALES }, 
                  { title: "Z-Report", path: ROUTE_PATHS.REPORTS.SALES } 
              ]
          }
      ];

      // Recursive helper to append outletId to all paths
      // [UPDATED] Handles Query Params & ensures absolute path first
      const appendOutletToMenu = (items: any[]): any[] => {
        return items.map(item => {
          const newItem = { ...item };
          
          if (newItem.path) {
              const separator = newItem.path.includes('?') ? '&' : '?';
              if (!newItem.path.includes('outlet=')) {
                  newItem.path = `${newItem.path}${separator}outlet=${outletId}`;
              }
          }

          if (newItem.children) {
              newItem.children = appendOutletToMenu(newItem.children);
          }
          return newItem;
        });
      };

      // 1. Prefix relative paths first
      const prefixedOutletMenu = prefixMenuPaths(rawOutletMenu);
      const prefixedCommonMenu = prefixMenuPaths(commonMenu);

      // 2. Then append outlet query param
      const outletMenu = appendOutletToMenu(prefixedOutletMenu);
      const scopedCommonMenu = appendOutletToMenu(prefixedCommonMenu);
      
      return [...outletMenu, ...scopedCommonMenu];
  }

  // 1. Context Isolation Logic 🛡️
  // If Super Admin enters a Business Unit, show ONLY Business Admin menu (Context Switching)
  if (role === 'super-admin' && businessUnit) {
      // Return 'business-admin' menu directly, bypassing 'super-admin' global menu
      const businessAdminMenu = sidebarMenuConfig.menus['business-admin'];
      return prefixMenuPaths([...businessAdminMenu, ...commonMenu]);
  }

  // 2. Get the base menu (Specified Role or Default Dynamic)
  let roleMenu: any[] = [];
  
  if (Object.prototype.hasOwnProperty.call(sidebarMenuConfig.menus, role)) {
      roleMenu = sidebarMenuConfig.menus[role as keyof typeof sidebarMenuConfig.menus];
  } else {
      roleMenu = dynamicMenu;
  }


  // Deduplicate before returning
   const uniqueMenu = roleMenu.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.title === item.title
    ))
  );

  return prefixMenuPaths([...uniqueMenu, ...commonMenu]);
}


