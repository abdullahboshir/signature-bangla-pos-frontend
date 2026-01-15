export const MODULES = {
  POS: "pos",
  ERP: "erp",
  HRM: "hrm",
  ECOMMERCE: "ecommerce",
  CRM: "crm",
  LOGISTICS: "logistics",
  GOVERNANCE: "governance",
  INTEGRATIONS: "integrations",
  SAAS: "saas",
  MARKETING: "marketing",
} as const;

export type ModuleType = (typeof MODULES)[keyof typeof MODULES];

export const MODULE_OPTIONS = [
  { value: MODULES.POS, label: "Point of Sale (POS)" },
  { value: MODULES.ERP, label: "Enterprise Resource Planning (ERP)" },
  { value: MODULES.HRM, label: "Human Resource Management (HRM)" },
  { value: MODULES.ECOMMERCE, label: "E-Commerce" },
  { value: MODULES.CRM, label: "Customer Relationship Management" },
  { value: MODULES.LOGISTICS, label: "Logistics & Supply Chain" },
  { value: MODULES.MARKETING, label: "Marketing Automation" },
  { value: MODULES.GOVERNANCE, label: "Governance & Compliance" },
  { value: MODULES.INTEGRATIONS, label: "Third-Party Integrations" },
  { value: MODULES.SAAS, label: "SaaS Platform Features" },
];

// Helper to filter modules based on context if needed
export const getModuleOptions = (exclude: ModuleType[] = []) => {
  return MODULE_OPTIONS.filter((opt) => !exclude.includes(opt.value));
};
