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
import { USER_ROLES, matchesRole } from "./auth-constants"

// Re-export or alias for compatibility if needed, using the registry
const MENU_MODULES = APP_MODULES;


export const sidebarMenuConfig = {
  // 👥 Role-based menu items
  menus: {
    // 👑 SUPER ADMIN - Platform Management (Level 1)
    // Should ONLY contain platform-level items, NOT business-level items
    [USER_ROLES.SUPER_ADMIN]: [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.COMPANIES,
      {
        // Platform Finance - SaaS billing, subscription revenue
        title: "SaaS Finance",
        path: "finance",
        icon: DollarSign,
        module: 'platform',
        children: [
          { title: "Subscriptions", path: "finance/subscriptions", resource: RESOURCE_KEYS.SUBSCRIPTION },
          { title: "Platform Payments", path: "finance/payments", resource: RESOURCE_KEYS.PAYMENT },
          { title: "Revenue Analytics", path: "finance/revenue", resource: RESOURCE_KEYS.ANALYTICS_REPORT },
        ]
      },
      MENU_MODULES.PACKAGES,
      {
        ...MENU_MODULES.USER_MANAGEMENT,
        children: [
           { title: "Platform Users", path: "/global/user-management/platform-users" },
           { title: "Platform Roles", path: "/global/user-management/platform-roles" },
        ]
      },
      MENU_MODULES.SUPPORT,
      {
        // Platform Reports - company stats, usage analytics
        title: "Platform Reports",
        path: "reports",
        icon: BarChart3,
        module: 'platform',
        children: [
          { title: "Company Analytics", path: "reports/companies", resource: RESOURCE_KEYS.ANALYTICS_REPORT },
          { title: "Usage Statistics", path: "reports/usage", resource: RESOURCE_KEYS.REPORT },
          { title: "Platform Health", path: "reports/health", resource: RESOURCE_KEYS.REPORT },
        ]
      },
      MENU_MODULES.INTEGRATIONS,
      MENU_MODULES.NOTIFICATIONS,
      MENU_MODULES.PLATFORM_SETTINGS,
      MENU_MODULES.SYSTEM,
    ],

    // 🏢 Business Admin - Manages specific business unit
    "business-admin": [
      MENU_MODULES.DASHBOARD,
      { ...MENU_MODULES.POS_TERMINAL, badge: "Live", module: 'pos' },
      { ...MENU_MODULES.OUTLETS, module: 'pos' },
      {
        ...MENU_MODULES.CATALOG,
        module: 'erp',
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
      {
        ...MENU_MODULES.INVENTORY,
        module: 'erp',
        children: [
            { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
            { title: "Purchases", path: ROUTE_PATHS.INVENTORY.PURCHASE, resource: RESOURCE_KEYS.PURCHASE },
            { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
            { title: "Stock Ledger", path: ROUTE_PATHS.INVENTORY.LEDGER },
            { title: "Warehouses", path: ROUTE_PATHS.INVENTORY.WAREHOUSES, resource: RESOURCE_KEYS.WAREHOUSE },
            { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
            { title: "Suppliers", path: ROUTE_PATHS.SUPPLIERS.ROOT, resource: RESOURCE_KEYS.SUPPLIER },
            { title: "Logistics", path: ROUTE_PATHS.LOGISTICS.ROOT, resource: RESOURCE_KEYS.COURIER },
        ]
      },
      {
        ...MENU_MODULES.SALES, 
        title: "Sales & Orders",
        icon: CreditCard,
        module: 'erp',
        children: [
          { title: "All Orders", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
          { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
          { title: "Invoices", path: ROUTE_PATHS.SALES.INVOICES, resource: RESOURCE_KEYS.INVOICE },
        ],
      },
      { ...MENU_MODULES.STOREFRONT, title: "E-Commerce", module: 'ecommerce' },
      {
        ...MENU_MODULES.CUSTOMERS,
        title: "CRM & Customers",
        module: 'crm',
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT },
          { title: "Add Customer", path: ROUTE_PATHS.CUSTOMERS.NEW, action: ACTION_KEYS.CREATE },
          { title: "Loyalty Program", path: ROUTE_PATHS.CUSTOMERS.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
          { title: "Subscriptions", path: ROUTE_PATHS.CUSTOMERS.SUBSCRIPTIONS, resource: RESOURCE_KEYS.SUBSCRIPTION },
          { title: "Marketing", path: ROUTE_PATHS.MARKETING.ROOT, resource: RESOURCE_KEYS.PROMOTION },
          { title: "Support Tickets", path: ROUTE_PATHS.SUPPORT.ROOT, resource: RESOURCE_KEYS.TICKET },
        ],
      },
      { ...MENU_MODULES.HRM, module: 'hrm' },
      {
        title: "User Management",
        path: "user-management",
        icon: Users,
        children: [
           { title: "Staff / Users", path: "user-management/business-users", resource: RESOURCE_KEYS.STAFF, action: ACTION_KEYS.MANAGE },
           { title: "Business Roles", path: "user-management/business-roles", resource: RESOURCE_KEYS.ROLE },
        ]
      },
      {
         ...MENU_MODULES.FINANCE,
         module: 'finance',
         children: [
             ...MENU_MODULES.FINANCE.children || [],
             ...MENU_MODULES.ACCOUNTING.children || [],
         ]
      },
      MENU_MODULES.REPORTS,
      {
          ...MENU_MODULES.BUSINESS_SETTINGS,
          title: "Setup & Settings",
          children: [
              { title: "Business Settings", path: "business-settings?tab=overview", resource: RESOURCE_KEYS.BUSINESS_SETTING },
              { title: "POS Configuration", path: "business-settings?tab=pos", resource: RESOURCE_KEYS.TERMINAL },
              { title: "Outlet Settings", path: "outlet-settings", resource: RESOURCE_KEYS.OUTLET_SETTING },
              { title: "Integrations", path: "integrations", resource: RESOURCE_KEYS.SYSTEM_CONFIG, module: 'integrations' }, 
          ]
      }
    ],
    
    // 🏢 COMPANY OWNER - Group MD / Chairman
    [USER_ROLES.COMPANY_OWNER]: [
      MENU_MODULES.DASHBOARD,
      {
          title: "Governance",
          path: "governance",
          icon: Users,
          module: 'governance',
          resource: RESOURCE_KEYS.SHAREHOLDER,
          children: [
             { title: "Shareholders", path: "governance/shareholders", resource: RESOURCE_KEYS.SHAREHOLDER },
             { title: "Board Meetings", path: "governance/meetings", resource: RESOURCE_KEYS.MEETING },
             { title: "Compliance", path: "governance/compliance", resource: RESOURCE_KEYS.COMPLIANCE },
          ]
      },
      { ...MENU_MODULES.BUSINESS_UNITS, path: "business-units" },
      {
          title: "Access Management",
          path: "user-management",
          icon: Users,
          children: [
             { title: "Business Admins", path: "user-management/business-users" },
             { title: "Roles & Permissions", path: "user-management/business-roles" },
          ]
      },
      {
        ...MENU_MODULES.FINANCE,
        title: "Company Finance",
        children: [
           { title: "Revenue Summary", path: "finance/revenue" },
           { title: "Subscriptions", path: "finance/subscriptions", resource: RESOURCE_KEYS.SUBSCRIPTION },
           { title: "Invoices", path: "finance/invoices" },
        ]
      },
      MENU_MODULES.REPORTS,
      { ...MENU_MODULES.COMPANY_SETTINGS, title: "Company Settings" }
    ],

    // 💰 SHAREHOLDER - Investor View
    [USER_ROLES.SHAREHOLDER]: [
        MENU_MODULES.DASHBOARD,
        {
          title: "Governance",
          path: "governance",
          icon: Users,
          children: [
             { title: "Meetings", path: "governance/meetings" },
             { title: "Compliance", path: "governance/compliance" },
          ]
        },
        MENU_MODULES.REPORTS,
        {
           ...MENU_MODULES.FINANCE,
           title: "Financials",
           children: [ { title: "P&L Summary", path: "finance/revenue" } ]
        }
    ],

    // 📋 MULTI-UNIT ADMIN / REGIONAL MANAGER
    "multi-unit-admin": [
      MENU_MODULES.DASHBOARD,
      { ...MENU_MODULES.BUSINESS_UNITS, title: "My Business Units", path: "business-units" },
      MENU_MODULES.REPORTS,
      {
          title: "Access Management",
          path: "user-management",
          icon: Users,
          children: [ { title: "Staff / Users", path: "user-management/business-users" } ]
      }
    ],

    // 💰 Cashier - POS focused
    // 💰 Cashier - POS focused
    [USER_ROLES.CASHIER]: [
      MENU_MODULES.DASHBOARD,
      { ...MENU_MODULES.POS_TERMINAL, exact: true },
      { title: "Quick Sales", path: ROUTE_PATHS.POS.QUICK_SALES, icon: CreditCard, resource: RESOURCE_KEYS.ORDER },
      { title: "Today's Summary", path: ROUTE_PATHS.POS.TODAY, icon: BarChart3, resource: RESOURCE_KEYS.REPORT },
      { title: "My Sales", path: ROUTE_PATHS.POS.MY_SALES, icon: FileText, resource: RESOURCE_KEYS.ORDER },
      // Added Standard Cashier Items
      { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, icon: Package, resource: RESOURCE_KEYS.RETURN }, 
      MENU_MODULES.CUSTOMERS,
      // Removed OUTLET_SETTINGS for security
    ],

    // 📦 Store Manager - Operational focus for a single Outlet
    "store-manager": [
      MENU_MODULES.DASHBOARD,
      MENU_MODULES.POS_TERMINAL,
      {
        ...MENU_MODULES.CATALOG,
        title: "Products & Prices",
        children: [
            { title: "Product List", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT },
        ]
      },
      {
        ...MENU_MODULES.INVENTORY,
        children: [
          { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
          { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, action: ACTION_KEYS.UPDATE },
          { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, action: ACTION_KEYS.UPDATE },
          { title: "Low Stock Alerts", path: ROUTE_PATHS.INVENTORY.ALERTS },
        ]
      },
      {
        ...MENU_MODULES.SALES,
        title: "Sales History",
        children: [
          { title: "Recent Orders", path: ROUTE_PATHS.SALES.ROOT },
          { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS },
        ]
      },
      {
        ...MENU_MODULES.CUSTOMERS,
        title: "Customer Registry",
        children: [
          { title: "Customer List", path: ROUTE_PATHS.CUSTOMERS.ROOT },
        ]
      },
      MENU_MODULES.STAFF,
      { ...MENU_MODULES.REPORTS, title: "Daily Reports" },
      MENU_MODULES.OUTLET_SETTINGS,
    ],

    "dynamic": [
      { ...MENU_MODULES.DASHBOARD, resource: RESOURCE_KEYS.REPORT },
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
      { ...MENU_MODULES.STOREFRONT, resource: undefined }, 
      {
        ...MENU_MODULES.INVENTORY,
        icon: Package, 
        children: [
          { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT, resource: RESOURCE_KEYS.INVENTORY },
          { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
          { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.ADJUST },
        ]
      },
      { ...MENU_MODULES.MARKETING, resource: undefined },
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
      { ...MENU_MODULES.SUPPLIERS, resource: RESOURCE_KEYS.SUPPLIER },
      { ...MENU_MODULES.STAFF, resource: RESOURCE_KEYS.STAFF },
      { ...MENU_MODULES.SUPPORT, resource: RESOURCE_KEYS.TICKET },
      { ...MENU_MODULES.CONTENT, resource: RESOURCE_KEYS.CONTENT },
      { ...MENU_MODULES.REPORTS, resource: RESOURCE_KEYS.REPORT },
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
      { ...MENU_MODULES.ACCOUNTING, resource: undefined },
      { ...MENU_MODULES.LOGISTICS, resource: undefined },
      { ...MENU_MODULES.RISK_MANAGEMENT, resource: undefined },
      { ...MENU_MODULES.HRM, resource: undefined },
      { ...MENU_MODULES.VENDORS, resource: undefined },
      { ...MENU_MODULES.POS_CONFIG, resource: undefined },
      { ...MENU_MODULES.PLATFORM_SETTINGS, resource: RESOURCE_KEYS.PLATFORM_SETTING },
      { ...MENU_MODULES.COMPANY_SETTINGS, resource: RESOURCE_KEYS.COMPANY_SETTING },
      { ...MENU_MODULES.BUSINESS_SETTINGS, resource: RESOURCE_KEYS.BUSINESS_SETTING },
      { ...MENU_MODULES.OUTLET_SETTINGS, resource: RESOURCE_KEYS.OUTLET_SETTING },
      { ...MENU_MODULES.SYSTEM, resource: RESOURCE_KEYS.SYSTEM_CONFIG }
    ],
  },

  // 🔧 Common menus for all roles
  common: [
    { title: "Notifications", path: ROUTE_PATHS.COMMON.NOTIFICATIONS, icon: Bell },
    { title: "My Profile", path: ROUTE_PATHS.COMMON.PROFILE, icon: User },
    { title: "Help & Support", path: ROUTE_PATHS.COMMON.HELP, icon: HelpCircle },
  ],
}

// Helper function to get menu for role
export const getSidebarMenu = (role: string, businessUnit: string, outletId?: string, companyId?: string | null) => {
  
  let baseUrl = "/global";
  if (businessUnit) {
      baseUrl = `/${businessUnit}`;
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
      if (newItem.children) newItem.children = prefixMenuPaths(newItem.children);
      return newItem;
    });
  };

  const commonMenu = sidebarMenuConfig.common
  const dynamicMenu = sidebarMenuConfig.menus['dynamic'];

  // 0. Outlet Context Logic Specifics (POS, etc.)
  if (outletId && businessUnit) {
      const isPrivileged = matchesRole(role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.COMPANY_OWNER, 'business-admin', USER_ROLES.ADMIN]);
      
      let rawOutletMenu: any[] = [];
      
      if (isPrivileged) {
          // Streamlined "Operational Essentials" for Outlet context (even for Admins)
          rawOutletMenu = [
              MENU_MODULES.DASHBOARD,
              MENU_MODULES.POS_TERMINAL,
              {
                ...MENU_MODULES.CATALOG,
                title: "Products & Prices",
                children: [ { title: "Stock & Price List", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT } ]
              },
              {
                ...MENU_MODULES.INVENTORY,
                children: [
                    { title: "Current Stock", path: ROUTE_PATHS.INVENTORY.ROOT },
                    { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS },
                    { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS },
                ]
              },
              {
                ...MENU_MODULES.SALES,
                title: "Outlet Sales",
                children: [
                    { title: "Order History", path: ROUTE_PATHS.SALES.ROOT },
                    { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS },
                ]
              },
              {
                ...MENU_MODULES.CUSTOMERS,
                title: "Store Customers",
                children: [ { title: "Customer Registry", path: ROUTE_PATHS.CUSTOMERS.ROOT } ]
              },
              MENU_MODULES.REPORTS,
              MENU_MODULES.OUTLET_SETTINGS,
          ];
      } else if (role === 'store-manager') {
          rawOutletMenu = [...(sidebarMenuConfig.menus['store-manager'] || [])];
      } else {
          // Standard Cashiers/Staff see limited menu
          rawOutletMenu = [...(sidebarMenuConfig.menus[USER_ROLES.CASHIER] || [])];
          
          // Fallback: If no cashier menu, use dynamic as last resort
          if (rawOutletMenu.length === 0) rawOutletMenu = [...dynamicMenu];
      }
      
      // Ensure Outlet Settings is present for those who should see it
      const shouldSeeSettings = matchesRole(role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.COMPANY_OWNER, 'business-admin', 'store-manager', USER_ROLES.ADMIN]);
      const hasSettings = rawOutletMenu.some(m => m.title === MENU_MODULES.OUTLET_SETTINGS.title);
      if (shouldSeeSettings && !hasSettings) {
          rawOutletMenu.push(MENU_MODULES.OUTLET_SETTINGS);
      }

      const appendOutletToMenu = (items: any[]): any[] => {
        return items.map(item => {
          const newItem = { ...item };
          if (newItem.path) {
              const separator = newItem.path.includes('?') ? '&' : '?';
              if (!newItem.path.includes('outlet=')) newItem.path = `${newItem.path}${separator}outlet=${outletId}`;
          }
          if (newItem.children) newItem.children = appendOutletToMenu(newItem.children);
          return newItem;
        });
      };

      const prefixedOutletMenu = prefixMenuPaths(rawOutletMenu);
      const outletMenu = appendOutletToMenu(prefixedOutletMenu);
      return [...outletMenu, ...prefixMenuPaths(commonMenu)];
  }

  const appendCompanyToMenu = (items: any[]): any[] => {
    if (!companyId) return items;
    return items.map(item => {
      const newItem = { ...item };
      if (newItem.path) {
        const separator = newItem.path.includes('?') ? '&' : '?';
        if (!newItem.path.includes('company=')) newItem.path = `${newItem.path}${separator}company=${companyId}`;
      }
      if (newItem.children) newItem.children = appendCompanyToMenu(newItem.children);
      return newItem;
    });
  };

  // 1. Context switching for Super Admin & Company Owner
  if (matchesRole(role, USER_ROLES.SUPER_ADMIN)) {
      if (businessUnit) {
          const businessAdminMenu = sidebarMenuConfig.menus['business-admin'];
          return appendCompanyToMenu(prefixMenuPaths([...businessAdminMenu, ...commonMenu]));
      } else if (companyId) {
          const companyOwnerMenu = sidebarMenuConfig.menus[USER_ROLES.COMPANY_OWNER];
          return appendCompanyToMenu(prefixMenuPaths([...companyOwnerMenu, ...commonMenu]));
      }
  }

  if (matchesRole(role, USER_ROLES.COMPANY_OWNER) && businessUnit) {
      const businessAdminMenu = sidebarMenuConfig.menus['business-admin'];
      return appendCompanyToMenu(prefixMenuPaths([...businessAdminMenu, ...commonMenu]));
  }

  // 2. Get the base menu
  let roleMenu: any[] = [];
  
  if (!businessUnit && !matchesRole(role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.COMPANY_OWNER])) {
      roleMenu = sidebarMenuConfig.menus['multi-unit-admin'];
  } else if (Object.prototype.hasOwnProperty.call(sidebarMenuConfig.menus, role)) {
      roleMenu = sidebarMenuConfig.menus[role as keyof typeof sidebarMenuConfig.menus];
  } else if (matchesRole(role, USER_ROLES.ADMIN)) {
      roleMenu = sidebarMenuConfig.menus['business-admin'];
  } else {
      roleMenu = dynamicMenu;
  }

  const uniqueMenu = roleMenu.filter((item, index, self) => index === self.findIndex((t) => (t.title === item.title)));
  return appendCompanyToMenu(prefixMenuPaths([...uniqueMenu, ...commonMenu]));
}
