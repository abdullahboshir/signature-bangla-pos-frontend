export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
} as const;

export const ORDER_STATUS_OPTIONS = [
    { label: 'Pending', value: ORDER_STATUS.PENDING },
    { label: 'Confirmed', value: ORDER_STATUS.CONFIRMED },
    { label: 'Processing', value: ORDER_STATUS.PROCESSING },
    { label: 'Shipped', value: ORDER_STATUS.SHIPPED },
    { label: 'Delivered', value: ORDER_STATUS.DELIVERED },
    { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
    { label: 'Returned', value: ORDER_STATUS.RETURNED }
];

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    PARTIAL: 'partial',
    REFUNDED: 'refunded',
    FAILED: 'failed'
} as const;

export const PAYMENT_STATUS_OPTIONS = [
    { label: 'Pending', value: PAYMENT_STATUS.PENDING },
    { label: 'Paid', value: PAYMENT_STATUS.PAID },
    { label: 'Partial', value: PAYMENT_STATUS.PARTIAL },
    { label: 'Refunded', value: PAYMENT_STATUS.REFUNDED },
    { label: 'Failed', value: PAYMENT_STATUS.FAILED }
];

export const PAYMENT_METHOD = {
    CASH: 'cash',
    CARD: 'card',
    MOBILE_BANKING: 'mobile_banking',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT: 'credit'
} as const;

export const PAYMENT_METHOD_OPTIONS = [
    { label: 'Cash', value: PAYMENT_METHOD.CASH },
    { label: 'Card', value: PAYMENT_METHOD.CARD },
    { label: 'Mobile Banking', value: PAYMENT_METHOD.MOBILE_BANKING },
    { label: 'Bank Transfer', value: PAYMENT_METHOD.BANK_TRANSFER },
    { label: 'Credit', value: PAYMENT_METHOD.CREDIT }
];

export const ORDER_SOURCE_MODULE = {
    POS: 'pos',
    ECOMMERCE: 'ecommerce',
    CRM: 'crm',
    SYSTEM: 'system'
} as const;

export const ORDER_SOURCE_MODULE_OPTIONS = [
    { label: 'POS', value: ORDER_SOURCE_MODULE.POS },
    { label: 'E-Commerce', value: ORDER_SOURCE_MODULE.ECOMMERCE },
    { label: 'CRM', value: ORDER_SOURCE_MODULE.CRM },
    { label: 'System', value: ORDER_SOURCE_MODULE.SYSTEM }
];
