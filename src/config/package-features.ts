
// Central Configuration for SaaS Package Features & Limits
// This file dictates what can be toggled or limited in a Plan.

export const PACKAGE_FEATURES = [
    { key: 'pos', label: 'POS Terminal', description: 'Point of Sale interface for cashiers' },
    { key: 'erp', label: 'ERP Core', description: 'Inventory, Purchasing, and Supplier management' },
    { key: 'hrm', label: 'HRM & Payroll', description: 'Staff, Attendance, and Payroll management' },
    { key: 'crm', label: 'CRM & Marketing', description: 'Customer management, Loyalty, and Campaigns' },
    { key: 'ecommerce', label: 'Online Store', description: 'E-commerce storefront and builder' },
    { key: 'logistics', label: 'Logistics', description: 'Delivery, Driver, and Vehicle management' },
    { key: 'accounting', label: 'Accounting', description: 'Financial accounting, Chart of Accounts' },
    { key: 'reports', label: 'Advanced Reporting', description: 'Deep analytics and financial reports' },
    { key: 'api_access', label: 'API Access', description: 'Access to developer APIs and Webhooks' },
] as const;

export const PACKAGE_LIMITS = [
    { key: 'maxUsers', label: 'Max Users', type: 'number', description: 'Maximum staff accounts allowed' },
    { key: 'maxOutlets', label: 'Max Outlets', type: 'number', description: 'Maximum business outlets/branches' },
    { key: 'maxBusinessUnits', label: 'Max Business Units', type: 'number', description: 'Maximum business units/companies' },
    { key: 'maxStorage', label: 'Storage (MB)', type: 'number', description: 'File storage limit in MB' },
    { key: 'maxProducts', label: 'Max Products', type: 'number', description: 'Maximum number of products in catalog' },
    { key: 'maxOrders', label: 'Orders / Month', type: 'number', description: 'Order processing limit per month' },
] as const;

export const SUPPORT_PRIORITIES = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
] as const;

export const SUPPORT_CHANNELS = [
    { label: "Email Support", value: "email" },
    { label: "Live Chat", value: "chat" },
    { label: "Phone Support", value: "phone" },
    { label: "Dedicated Manager", value: "manager" },
    { label: "Community Forum", value: "community" },
] as const;

export const SUBSCRIPTION_CYCLES = [
    { label: "Monthly", value: "monthly", durationDays: 30 },
    { label: "Yearly", value: "yearly", durationDays: 365 },
    { label: "Lifetime", value: "lifetime", durationDays: 36500 },
] as const;

export type PackageFeatureKey = typeof PACKAGE_FEATURES[number]['key'];
export type PackageLimitKey = typeof PACKAGE_LIMITS[number]['key'];
