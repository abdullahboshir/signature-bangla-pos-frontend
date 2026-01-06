export const PACKAGE_STATUS = {
    ACTIVE: true,
    INACTIVE: false
} as const;

export const PACKAGE_MODULE = {
    POS: 'pos',
    ERP: 'erp',
    HRM: 'hrm',
    ECOMMERCE: 'ecommerce',
    CRM: 'crm',
    LOGISTICS: 'logistics'
} as const;

export const SUPPORT_TYPE = {
    BASIC: 'basic',
    PRIORITY: 'priority',
    DEDICATED: 'dedicated'
} as const;

export const PACKAGE_STATUS_OPTIONS = [
    { label: "Active", value: true },
    { label: "Inactive", value: false }
];

export const PACKAGE_MODULE_OPTIONS = Object.values(PACKAGE_MODULE).map(m => ({ label: m.toUpperCase(), value: m }));
