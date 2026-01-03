export const PAYMENT_METHOD = {
  CASH: 'cash',
  BANK: 'bank',
  MOBILE_MONEY: 'mobile_money',
  OTHER: 'other',
} as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHOD.CASH, label: 'Cash' },
  { value: PAYMENT_METHOD.BANK, label: 'Bank Transfer' },
  { value: PAYMENT_METHOD.MOBILE_MONEY, label: 'Mobile Money' },
  { value: PAYMENT_METHOD.OTHER, label: 'Other' },
];

export const EXPENSE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const EXPENSE_STATUS_OPTIONS = [
  { value: EXPENSE_STATUS.PENDING, label: 'Pending' },
  { value: EXPENSE_STATUS.APPROVED, label: 'Approved' },
  { value: EXPENSE_STATUS.REJECTED, label: 'Rejected' },
];

export const EXPENSE_CATEGORY_TYPE = {
  FIXED: 'fixed',
  VARIABLE: 'variable',
} as const;

export const EXPENSE_CATEGORY_TYPE_OPTIONS = [
  { value: EXPENSE_CATEGORY_TYPE.FIXED, label: 'Fixed Cost' },
  { value: EXPENSE_CATEGORY_TYPE.VARIABLE, label: 'Variable Cost' },
];
