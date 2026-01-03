export const CUSTOMER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
} as const;

export const CUSTOMER_STATUS_OPTIONS = [
    { label: 'Active', value: CUSTOMER_STATUS.ACTIVE },
    { label: 'Inactive', value: CUSTOMER_STATUS.INACTIVE }
];

export const CUSTOMER_MODULE = {
    POS: 'pos',
    ERP: 'erp',
    HRM: 'hrm',
    ECOMMERCE: 'ecommerce',
    CRM: 'crm',
    LOGISTICS: 'logistics',
    SYSTEM: 'system'
} as const;

export const CUSTOMER_MODULE_OPTIONS = [
    { label: 'POS', value: CUSTOMER_MODULE.POS },
    { label: 'ERP', value: CUSTOMER_MODULE.ERP },
    { label: 'HRM', value: CUSTOMER_MODULE.HRM },
    { label: 'E-Commerce', value: CUSTOMER_MODULE.ECOMMERCE },
    { label: 'CRM', value: CUSTOMER_MODULE.CRM },
    { label: 'Logistics', value: CUSTOMER_MODULE.LOGISTICS },
    { label: 'System', value: CUSTOMER_MODULE.SYSTEM }
];

export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
} as const;

export const GENDER_OPTIONS = [
    { label: 'Male', value: GENDER.MALE },
    { label: 'Female', value: GENDER.FEMALE },
    { label: 'Other', value: GENDER.OTHER }
];

export const LANGUAGE = {
    ENGLISH: 'en',
    BANGLA: 'bn'
} as const;

export const LANGUAGE_OPTIONS = [
    { label: 'English', value: LANGUAGE.ENGLISH },
    { label: 'Bangla', value: LANGUAGE.BANGLA }
];

export const CURRENCY = {
    BDT: 'BDT',
    USD: 'USD'
} as const;

export const CURRENCY_OPTIONS = [
    { label: 'BDT', value: CURRENCY.BDT },
    { label: 'USD', value: CURRENCY.USD }
];

export const MEMBERSHIP_TIER = {
    REGULAR: 'regular',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum'
} as const;

export const MEMBERSHIP_TIER_OPTIONS = [
    { label: 'Regular', value: MEMBERSHIP_TIER.REGULAR },
    { label: 'Silver', value: MEMBERSHIP_TIER.SILVER },
    { label: 'Gold', value: MEMBERSHIP_TIER.GOLD },
    { label: 'Platinum', value: MEMBERSHIP_TIER.PLATINUM }
];
