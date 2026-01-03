export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const SUPPLIER_STATUS_OPTIONS = [
  { value: SUPPLIER_STATUS.ACTIVE, label: 'Active' },
  { value: SUPPLIER_STATUS.INACTIVE, label: 'Inactive' },
];

export const SUPPLIER_MODULE = {
  POS: 'pos',
  ERP: 'erp',
  HRM: 'hrm',
  ECOMMERCE: 'ecommerce',
  CRM: 'crm',
  LOGISTICS: 'logistics',
  SYSTEM: 'system',
} as const;

export const SUPPLIER_MODULE_OPTIONS = [
  { value: SUPPLIER_MODULE.POS, label: 'POS' },
  { value: SUPPLIER_MODULE.ERP, label: 'ERP' },
  { value: SUPPLIER_MODULE.HRM, label: 'HRM' },
  { value: SUPPLIER_MODULE.ECOMMERCE, label: 'Ecommerce' },
  { value: SUPPLIER_MODULE.CRM, label: 'CRM' },
  { value: SUPPLIER_MODULE.LOGISTICS, label: 'Logistics' },
  { value: SUPPLIER_MODULE.SYSTEM, label: 'System' },
];
