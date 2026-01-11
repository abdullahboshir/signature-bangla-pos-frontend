// Operational Model (How the business operates)
export const BUSINESS_MODEL = {
    RETAIL: 'retail',             // B2C, Physical/Online Store
    WHOLESALE: 'wholesale',       // B2B, Bulk Selling
    DISTRIBUTOR: 'distributor',   // Logistics & Supply Chain
    MANUFACTURING: 'manufacturing', // Production
    SERVICE: 'service',           // Service-based (Salon, Repair)
    ONLINE_ONLY: 'online_only',   // E-commerce/Dark Store
    HYBRID: 'hybrid',             // Retail + Wholesale
    MARKETPLACE: 'marketplace',   // Multi-vendor Platform
} as const;

export const BUSINESS_MODEL_OPTIONS = [
    { value: BUSINESS_MODEL.RETAIL, label: 'Retail Store' },
    { value: BUSINESS_MODEL.WHOLESALE, label: 'Wholesale' },
    { value: BUSINESS_MODEL.DISTRIBUTOR, label: 'Distributor' },
    { value: BUSINESS_MODEL.MANUFACTURING, label: 'Manufacturing' },
    { value: BUSINESS_MODEL.SERVICE, label: 'Service Provider' },
    { value: BUSINESS_MODEL.ONLINE_ONLY, label: 'Online Only (E-com)' },
    { value: BUSINESS_MODEL.HYBRID, label: 'Hybrid (Retail + Wholesale)' },
    { value: BUSINESS_MODEL.MARKETPLACE, label: 'Marketplace Platform' },
];

// Industry / Market Segment (What the business sells)
export const BUSINESS_INDUSTRY = {
    FASHION: 'fashion',             // Apparel, Accessories
    ELECTRONICS: 'electronics',     // Gadgets, Appliances
    GROCERY: 'grocery',             // Supermarket, FMCG
    PHARMACY: 'pharmacy',           // Medicine, Healthcare
    RESTAURANT: 'restaurant',       // F&B, Cafe
    BEAUTY: 'beauty',               // Cosmetics, Salon
    FURNITURE: 'furniture',         // Home Decor
    AUTOMOTIVE: 'automotive',       // Parts, Vehicles
    BOOKS_STATIONERY: 'books_stationery',
    STORE: 'store',                 // General Store
    GENERAL: 'general',             // Departmental Store
    OTHER: 'other'
} as const;

export const BUSINESS_INDUSTRY_OPTIONS = [
    { value: BUSINESS_INDUSTRY.FASHION, label: 'Fashion & Apparel' },
    { value: BUSINESS_INDUSTRY.ELECTRONICS, label: 'Electronics & Gadgets' },
    { value: BUSINESS_INDUSTRY.GROCERY, label: 'Grocery & Supermarket' },
    { value: BUSINESS_INDUSTRY.PHARMACY, label: 'Pharmacy & Healthcare' },
    { value: BUSINESS_INDUSTRY.RESTAURANT, label: 'Restaurant & Food' },
    { value: BUSINESS_INDUSTRY.BEAUTY, label: 'Beauty & Cosmetics' },
    { value: BUSINESS_INDUSTRY.FURNITURE, label: 'Furniture & Decor' },
    { value: BUSINESS_INDUSTRY.AUTOMOTIVE, label: 'Automotive' },
    { value: BUSINESS_INDUSTRY.BOOKS_STATIONERY, label: 'Books & Stationery' },
    { value: BUSINESS_INDUSTRY.STORE, label: 'General Store' },
    { value: BUSINESS_INDUSTRY.GENERAL, label: 'General / Department Store' },
    { value: BUSINESS_INDUSTRY.OTHER, label: 'Other' },
];

export const BUSINESS_UNIT_STATUS = {
    DRAFT: 'draft',
    UNDER_REVIEW: 'under_review',
    PUBLISHED: 'published',
    SUSPENDED: 'suspended',
    ARCHIVED: 'archived',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const;

export const BUSINESS_UNIT_STATUS_OPTIONS = [
    { value: BUSINESS_UNIT_STATUS.PUBLISHED, label: 'Published' },
    { value: BUSINESS_UNIT_STATUS.DRAFT, label: 'Draft' },
    { value: BUSINESS_UNIT_STATUS.UNDER_REVIEW, label: 'Under Review' },
    { value: BUSINESS_UNIT_STATUS.SUSPENDED, label: 'Suspended' },
    { value: BUSINESS_UNIT_STATUS.ARCHIVED, label: 'Archived' },
    { value: BUSINESS_UNIT_STATUS.ACTIVE, label: 'Active' },
    { value: BUSINESS_UNIT_STATUS.INACTIVE, label: 'Inactive' },
];

// System Modules (Access Control Checks)
export const SYSTEM_MODULES = {
    POS: 'pos',             // Point of Sale
    ERP: 'erp',             // Inventory, Purchasing, Accounts
    HRM: 'hrm',             // Staff, Attendance, Payroll
    ECOMMERCE: 'ecommerce', // Online Storefront
    CRM: 'crm',             // Customers, Marketing, Tickets
    LOGISTICS: 'logistics', // Couriers, Shipments
} as const;
