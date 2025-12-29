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
  ShieldAlert,
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
  EXPENSES: {
    title: "Expenses",
    path: ROUTE_PATHS.ACCOUNTING.EXPENSES,
    icon: DollarSign,
    resource: RESOURCE_KEYS.EXPENSE,
    module: "erp"
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
  
  LOGISTICS: {
    title: "Logistics",
    path: ROUTE_PATHS.LOGISTICS.ROOT,
    icon: Truck,
    resource: RESOURCE_KEYS.COURIER,
    module: "logistics",
    children: [
      { title: "Couriers", path: ROUTE_PATHS.LOGISTICS.COURIER, resource: RESOURCE_KEYS.COURIER, action: ACTION_KEYS.MANAGE },
      { title: "Parcels", path: ROUTE_PATHS.LOGISTICS.PARCEL, resource: RESOURCE_KEYS.PARCEL },
      { title: "Reports", path: ROUTE_PATHS.LOGISTICS.REPORTS, resource: RESOURCE_KEYS.DELIVERY, action: ACTION_KEYS.VIEW },
    ]
  },
  
  CONTENT: {
    title: "Content",
    path: ROUTE_PATHS.CONTENT.ROOT,
    icon: FileText,
    resource: RESOURCE_KEYS.CONTENT,
    module: "ecommerce"
  },

  RISK_MANAGEMENT: {
    title: "Risk & Fraud",
    path: ROUTE_PATHS.RISK.ROOT,
    icon: ShieldAlert,
    resource: RESOURCE_KEYS.FRAUD_DETECTION,
    children: [
       { title: "Fraud Detection", path: ROUTE_PATHS.RISK.FRAUD, resource: RESOURCE_KEYS.FRAUD_DETECTION },
       { title: "Blacklist", path: ROUTE_PATHS.RISK.BLACKLIST, resource: RESOURCE_KEYS.BLACKLIST },
       { title: "Risk Rules", path: ROUTE_PATHS.RISK.RULES, resource: RESOURCE_KEYS.RISK_RULE },
       { title: "Risk Profiles", path: "/risk/profiles", resource: RESOURCE_KEYS.RISK_PROFILE },
       { title: "Analytics", path: ROUTE_PATHS.RISK.ANALYTICS, resource: RESOURCE_KEYS.ANALYTICS },
    ]
  },
  // ... (keeping existing structure, but I need to insert EXPENSES before or near Business Units or where appropriate)
  // Actually, I should use replace_file_content to insert it in MENU_MODULES and then usages.

  // Let's do it in two chunks? No, replace_file_content doesn't support multiple non-contiguous unless I use multi_replace.
  // I will use multi_replace_file_content.
  OUTLETS: {
    title: "Outlets",
    path: ROUTE_PATHS.OUTLETS.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.OUTLET,
    module: "pos",
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
    module: "erp",
    children: [
      { title: "Products", path: ROUTE_PATHS.CATALOG.PRODUCT.ROOT, resource: RESOURCE_KEYS.PRODUCT }, // Using "Products" as standard
      { title: "Add Product", path: ROUTE_PATHS.CATALOG.PRODUCT.ADD, action: ACTION_KEYS.CREATE },
      { title: "Categories", path: ROUTE_PATHS.CATALOG.CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Sub-Categories", path: ROUTE_PATHS.CATALOG.SUB_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Child-Categories", path: ROUTE_PATHS.CATALOG.CHILD_CATEGORY, resource: RESOURCE_KEYS.CATEGORY },
      { title: "Variants", path: "/catalog/variants", resource: RESOURCE_KEYS.VARIANT },
      { title: "Brands", path: ROUTE_PATHS.CATALOG.BRAND, resource: RESOURCE_KEYS.BRAND },
      { title: "Units", path: ROUTE_PATHS.CATALOG.UNIT, resource: RESOURCE_KEYS.UNIT },
      { title: "Attributes", path: ROUTE_PATHS.CATALOG.ATTRIBUTE, resource: RESOURCE_KEYS.ATTRIBUTE },
      { title: "Attribute Groups", path: ROUTE_PATHS.CATALOG.ATTRIBUTE_GROUP, resource: RESOURCE_KEYS.ATTRIBUTE_GROUP },
      { title: "Warranties", path: "/catalog/warranties", resource: RESOURCE_KEYS.WARRANTY },
      { title: "Tax", path: ROUTE_PATHS.CATALOG.TAX, resource: RESOURCE_KEYS.TAX },
    ],
  },
  INVENTORY: {
    title: "Inventory",
    path: ROUTE_PATHS.INVENTORY.ROOT,
    icon: Package,
    resource: RESOURCE_KEYS.INVENTORY,
    module: "erp",
    children: [
      { title: "Stock Levels", path: ROUTE_PATHS.INVENTORY.ROOT },
      { title: "Purchases", path: ROUTE_PATHS.INVENTORY.PURCHASE, resource: RESOURCE_KEYS.PURCHASE },
      { title: "Stock Ledger", path: ROUTE_PATHS.INVENTORY.LEDGER, resource: RESOURCE_KEYS.INVENTORY, action: ACTION_KEYS.TRACK },
      { title: "Warehouses", path: ROUTE_PATHS.INVENTORY.WAREHOUSES, resource: RESOURCE_KEYS.WAREHOUSE },
      { title: "Transfers", path: ROUTE_PATHS.INVENTORY.TRANSFERS, resource: RESOURCE_KEYS.TRANSFER, action: ACTION_KEYS.CREATE },
      { title: "Adjustments", path: ROUTE_PATHS.INVENTORY.ADJUSTMENTS, resource: RESOURCE_KEYS.ADJUSTMENT, action: ACTION_KEYS.ADJUST },
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
    module: "erp", // Shared, but primarily ERP order management
    children: [
      { title: "All Orders", path: ROUTE_PATHS.SALES.ROOT, resource: RESOURCE_KEYS.ORDER },
      { title: "POS", path: ROUTE_PATHS.SALES.POS, resource: RESOURCE_KEYS.ORDER, module: "pos" }, // Override for POS
      { title: "Shipping", path: ROUTE_PATHS.SALES.SHIPPING, resource: RESOURCE_KEYS.SHIPPING },
      { title: "Delivery", path: ROUTE_PATHS.SALES.DELIVERY, resource: RESOURCE_KEYS.DELIVERY },
      { title: "Returns", path: ROUTE_PATHS.SALES.RETURNS, resource: RESOURCE_KEYS.RETURN },
      { title: "Invoices", path: ROUTE_PATHS.SALES.INVOICES, resource: RESOURCE_KEYS.INVOICE },
    ]
  },
  MARKETING: {
    title: "Marketing",
    path: ROUTE_PATHS.MARKETING.ROOT,
    icon: Megaphone,
    resource: RESOURCE_KEYS.PROMOTION,
    module: "crm",
    children: [
      { title: "Promotions", path: ROUTE_PATHS.MARKETING.PROMOTIONS, resource: RESOURCE_KEYS.PROMOTION },
      { title: "Coupons", path: ROUTE_PATHS.MARKETING.COUPONS, resource: RESOURCE_KEYS.COUPON },
      { title: "Ad Campaigns", path: ROUTE_PATHS.MARKETING.CAMPAIGNS, resource: RESOURCE_KEYS.AD_CAMPAIGN },
      { title: "Affiliates", path: ROUTE_PATHS.MARKETING.AFFILIATES, resource: RESOURCE_KEYS.AFFILIATE },
      { title: "Loyalty", path: ROUTE_PATHS.MARKETING.LOYALTY, resource: RESOURCE_KEYS.LOYALTY },
      { title: "SEO", path: "/marketing/seo", resource: RESOURCE_KEYS.SEO },
      { title: "Pixel & Events", path: ROUTE_PATHS.MARKETING.PIXEL, resource: RESOURCE_KEYS.PIXEL },
      { title: "Events", path: "/marketing/events", resource: RESOURCE_KEYS.EVENT },
      { title: "Audiences", path: "/marketing/audiences", resource: RESOURCE_KEYS.AUDIENCE },
    ]
  },
  CUSTOMERS: {
    title: "Customers",
    path: ROUTE_PATHS.CUSTOMERS.ROOT,
    icon: User,
    resource: RESOURCE_KEYS.CUSTOMER,
    module: "crm",
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
    module: "crm",
    children: [
      { title: "Tickets", path: ROUTE_PATHS.SUPPORT.TICKETS, resource: RESOURCE_KEYS.TICKET },
      { title: "Chat", path: "/support/chat", resource: RESOURCE_KEYS.CHAT },
      { title: "Disputes", path: "/support/disputes", resource: RESOURCE_KEYS.DISPUTE },
    ]
  },

  FINANCE: {
    title: "Financials",
    path: ROUTE_PATHS.FINANCE.ROOT,
    icon: DollarSign,
    resource: RESOURCE_KEYS.PAYMENT,
    module: "erp",
    children: [
      { title: "Payments", path: ROUTE_PATHS.FINANCE.PAYMENTS, resource: RESOURCE_KEYS.PAYMENT },
      { title: "Settlements", path: ROUTE_PATHS.FINANCE.SETTLEMENTS, resource: RESOURCE_KEYS.SETTLEMENT },
      { title: "Payouts", path: ROUTE_PATHS.FINANCE.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT },
      { title: "Reconciliations", path: "/finance/reconciliation", resource: RESOURCE_KEYS.RECONCILIATION },

      { title: "Fraud Detection", path: ROUTE_PATHS.FINANCE.FRAUD, resource: RESOURCE_KEYS.FRAUD_DETECTION },
      // { title: "Reports", path: ROUTE_PATHS.FINANCE.REPORTS, resource: RESOURCE_KEYS.REPORT }, // Removed in favor of main Reports module
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
    resource: RESOURCE_KEYS.SUPPLIER,
    module: "erp"
  },
  REPORTS: {
    title: "Reports",
    path: ROUTE_PATHS.REPORTS.ROOT,
    icon: BarChart3,
    resource: RESOURCE_KEYS.REPORT,
    module: "erp",
    children: [
      { title: "Sales Analysis", path: ROUTE_PATHS.REPORTS.SALES, resource: RESOURCE_KEYS.SALES_REPORT },
      { title: "Purchase History", path: ROUTE_PATHS.REPORTS.PURCHASES, resource: RESOURCE_KEYS.PURCHASE_REPORT },
      { title: "Stock Valuation", path: ROUTE_PATHS.REPORTS.STOCK, resource: RESOURCE_KEYS.STOCK_REPORT },
      { title: "Profit & Loss", path: ROUTE_PATHS.REPORTS.PROFIT_LOSS, resource: RESOURCE_KEYS.PROFIT_LOSS_REPORT },
      { title: "Expense Report", path: ROUTE_PATHS.REPORTS.EXPENSE, resource: RESOURCE_KEYS.EXPENSE_CATEGORY }, // Using Expense Category or general Expense? Expense Report key doesn't exist? Ah, I added EXPENSE_REPORT? No, check permission-keys. Added EXPENSE_CATEGORY. Maybe use PROFIT_LOSS_REPORT or just REPORT for now? Wait, looking at permission-keys.ts... "SALES_REPORT", "PURCHASE_REPORT", "STOCK_REPORT", "PROFIT_LOSS_REPORT". No "EXPENSE_REPORT". I should keep generic REPORT or use PROFIT_LOSS? Let's stick to REPORT for Expense for now or use EXPENSE with READ. Let's use RESOURCE_KEYS.EXPENSE and ACTION_KEYS.READ (implied). Or View. 
    ]
  },
  POS_TERMINAL: {
    title: "POS Terminal",
    path: ROUTE_PATHS.SALES.POS,
    icon: ShoppingCart,
    resource: RESOURCE_KEYS.ORDER,
    module: "pos"
  },
  STAFF: {
    title: "Staff Management",
    path: ROUTE_PATHS.STAFF.ROOT,
    icon: Users,
    resource: RESOURCE_KEYS.USER,
    module: "hrm"
  },
  HRM: {
    title: "HRM & Payroll",
    path: ROUTE_PATHS.HRM.ROOT,
    icon: Users,
    resource: RESOURCE_KEYS.STAFF,
    module: "hrm",
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
    module: "erp",
    children: [
      { title: "Chart of Accounts", path: ROUTE_PATHS.ACCOUNTING.ACCOUNTS, resource: RESOURCE_KEYS.ACCOUNT },
      { title: "Transactions", path: ROUTE_PATHS.ACCOUNTING.TRANSACTIONS, resource: RESOURCE_KEYS.TRANSACTION },
      { title: "Expenses", path: ROUTE_PATHS.ACCOUNTING.EXPENSES, resource: RESOURCE_KEYS.EXPENSE },
      { title: "Expense Categories", path: "/accounting/expense-categories", resource: RESOURCE_KEYS.EXPENSE_CATEGORY },
      { title: "Budgets", path: ROUTE_PATHS.ACCOUNTING.BUDGETS, resource: RESOURCE_KEYS.BUDGET },
      { title: "Tax Rules", path: ROUTE_PATHS.ACCOUNTING.TAX, resource: RESOURCE_KEYS.TAX },
    ]
  },
  VENDORS: {
    title: "Vendors",
    path: ROUTE_PATHS.VENDORS.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.VENDOR,
    module: "erp",
    children: [
      { title: "All Vendors", path: ROUTE_PATHS.VENDORS.ROOT, resource: RESOURCE_KEYS.VENDOR },
      { title: "Onboarding", path: ROUTE_PATHS.VENDORS.ONBOARDING, resource: RESOURCE_KEYS.VENDOR, action: ACTION_KEYS.CREATE },
      { title: "Payouts", path: ROUTE_PATHS.VENDORS.PAYOUTS, resource: RESOURCE_KEYS.PAYOUT, action: ACTION_KEYS.MANAGE },
    ]
  },
  POS_CONFIG: {
    title: "POS Config",
    path: ROUTE_PATHS.POS_CONFIG.ROOT,
    icon: Store,
    resource: RESOURCE_KEYS.TERMINAL,
    module: "pos",
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
    module: "ecommerce",
    children: [
      { title: "Store Builder", path: ROUTE_PATHS.STOREFRONT.UI_BUILDER, resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Pages", path: ROUTE_PATHS.STOREFRONT.PAGES, resource: RESOURCE_KEYS.STOREFRONT },
      { title: "Landing Pages", path: ROUTE_PATHS.STOREFRONT.LANDING_PAGES, resource: RESOURCE_KEYS.LANDING_PAGE },
      { title: "Themes", path: ROUTE_PATHS.STOREFRONT.THEMES, resource: RESOURCE_KEYS.THEME },
      { title: "Plugins", path: ROUTE_PATHS.STOREFRONT.PLUGINS, resource: RESOURCE_KEYS.PLUGIN },
      { title: "Questions", path: "/online-store/questions", resource: RESOURCE_KEYS.QUESTION },
      { title: "Abandoned Carts", path: "/online-store/abandoned-carts", resource: RESOURCE_KEYS.ABANDONED_CART },
      { title: "Settings", path: ROUTE_PATHS.STOREFRONT.SETTINGS, resource: RESOURCE_KEYS.STOREFRONT },
    ]
  }
};


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
  const baseUrl = businessUnit ? `/${role}/${businessUnit}` : `/${role}`;

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


