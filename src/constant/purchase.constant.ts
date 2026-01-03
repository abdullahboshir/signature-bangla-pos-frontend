export const PURCHASE_STATUS = {
  PENDING: 'pending',
  ORDERED: 'ordered',
  RECEIVED: 'received',
} as const;

export const PURCHASE_STATUS_OPTIONS = [
  { value: PURCHASE_STATUS.PENDING, label: 'Pending' },
  { value: PURCHASE_STATUS.ORDERED, label: 'Ordered' },
  { value: PURCHASE_STATUS.RECEIVED, label: 'Received' },
];

export const PURCHASE_PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
} as const;

export const PURCHASE_PAYMENT_STATUS_OPTIONS = [
  { value: PURCHASE_PAYMENT_STATUS.PENDING, label: 'Pending' },
  { value: PURCHASE_PAYMENT_STATUS.PARTIAL, label: 'Partial' },
  { value: PURCHASE_PAYMENT_STATUS.PAID, label: 'Paid' },
];

export const PURCHASE_PAYMENT_METHOD = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_BANKING: 'mobile_banking',
  CHEQUE: 'cheque',
  CREDIT: 'credit',
} as const;

export const PURCHASE_PAYMENT_METHOD_OPTIONS = [
  { value: PURCHASE_PAYMENT_METHOD.CASH, label: 'Cash' },
  { value: PURCHASE_PAYMENT_METHOD.CARD, label: 'Card' },
  { value: PURCHASE_PAYMENT_METHOD.BANK_TRANSFER, label: 'Bank Transfer' },
  { value: PURCHASE_PAYMENT_METHOD.MOBILE_BANKING, label: 'Mobile Banking' },
  { value: PURCHASE_PAYMENT_METHOD.CHEQUE, label: 'Cheque' },
  { value: PURCHASE_PAYMENT_METHOD.CREDIT, label: 'Credit' },
];

export const PURCHASE_MODULE = {
  POS: 'pos',
  ERP: 'erp',
  SYSTEM: 'system',
} as const;
