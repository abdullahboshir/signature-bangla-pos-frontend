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
import { RESOURCE_KEYS, ACTION_KEYS } from "./permission-keys"
import { APP_MODULES, ROUTE_PATHS } from "./module-registry"

// Re-export or alias for compatibility if needed, using the registry
const MENU_MODULES = APP_MODULES;


export const sidebarMenuConfig = {
  // 👥 Role-based menu items
  menus: {
    // 👑 Super Admin - Manages everything
    // 👑 Super Admin - Manages everything (GLOBAL Context)
    "super-admin": [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.BUSINESS_UNITS,
      // Operational modules removed to enforce context-switching
      // MENU_MODULES.OUTLETS, -> Inside Business Unit
      // MENU_MODULES.CATALOG, -> Inside Business Unit
      // MENU_MODULES.INVENTORY, -> Inside Business Unit
      // MENU_MODULES.SALES, -> Inside Business Unit
      // ...
      
      MENU_MODULES.USER_MANAGEMENT, // Global User Management
      MENU_MODULES.FINANCE, // Global Finance (Subscriptions, Payouts)
      MENU_MODULES.REPORTS, // Global Aggregated Reports
      MENU_MODULES.SUPPORT, // Global Support Tickets
      MENU_MODULES.SYSTEM, // Global Settings
      
      // Optional: Keep Logistics/Providors if they are global integrations?
      // MENU_MODULES.LOGISTICS, -> Courier config is global? Yes.
      // But Parcel management is per order (BU). 
      // Let's keep Logistics for Courier Configuration.
      MENU_MODULES.LOGISTICS, 
      MENU_MODULES.SUPPLIERS, // Global Suppliers? Or BU specific? Usually BU specific. Removing.
      // MENU_MODULES.RISK_MANAGEMENT, // Global Risk Rules? Yes.
      MENU_MODULES.RISK_MANAGEMENT,
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
           { title: "Warranties", path: "/catalog/warranties", resource: RESOURCE_KEYS.WARRANTY },
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
          { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
          { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.ADJUST },
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
      {
        ...MENU_MODULES.STAFF,
        // resource: undefined, // Removed to enforce permission check
      },
      {
        ...MENU_MODULES.SUPPORT,
        resource: undefined, // Removed
      },
      MENU_MODULES.CONTENT,
      MENU_MODULES.REPORTS, // Uses the updated definition with children
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
      MENU_MODULES.LOGISTICS,
      MENU_MODULES.RISK_MANAGEMENT,
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
export const getSidebarMenu = (role: string, businessUnit: string, outletId?: string) => {
  // Determine Base URL for relative paths
  // [UPDATED] Removed role from base URL. 
  // If businessUnit exists -> /${businessUnit}
  // If no BU and super-admin -> /global (was /super-admin)
  // Else -> / (or handle as needed)
  
  let baseUrl = "/";
  if (businessUnit) {
      baseUrl = `/${businessUnit}`;
  } else if (role === 'super-admin') {
      baseUrl = `/global`; 
  } else {
      // Fallback for staff/others without BU context (shouldn't happen often)
      baseUrl = `/global`; 
  }

  // Helper to prefix relative paths
  // [FIX] Ensure we don't fix paths that are already absolute or start with base
  const prefixMenuPaths = (items: any[]): any[] => {
    return items.map(item => {
      const newItem = { ...item };
      
      if (newItem.path !== undefined) {
         if (newItem.path === "") {
             newItem.path = baseUrl;
         } else if (newItem.path && !newItem.path.startsWith('/') && !newItem.path.startsWith('http')) {
             // Only prefix if purely relative
             newItem.path = `${baseUrl}/${newItem.path}`;
         }
         // If it starts with '/', we leave it alone.
         // This assumes manually defined absolute paths (like /marketing/seo) are correct.
         // If they were meant to be relative to scoped user, they should have been defined without '/'.
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
            path: `/outlets/${outletId}`, 
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

  // 3. [NEW] Universal Dynamic Merge
  // Even if a role has a fixed list, we append any missing modules from the 'dynamic' master list.
  if (role !== 'dynamic') { // Avoid merging dynamic with itself
    const existingTitles = new Set(roleMenu.map((item: any) => item.title));
    const extraItems = dynamicMenu.filter((item: any) => !existingTitles.has(item.title));
    roleMenu = [...roleMenu, ...extraItems];
  }

  // Deduplicate before returning
   const uniqueMenu = roleMenu.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.title === item.title
    ))
  );

  return prefixMenuPaths([...uniqueMenu, ...commonMenu]);
}


