// ========================================
// ENTERPRISE HIERARCHY TYPES
// ========================================
// Strict type definitions for Organization > Business Unit > Outlet structure
// This ensures future multi-country / franchise support

/**
 * Organization (Top Level)
 * Represents the entire business entity
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Business Unit (Second Level)
 * Represents a branch, division, or department within a organization
 * Examples: "Dhaka Branch", "Chittagong Division"
 */
export interface BusinessUnit {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  type: "branch" | "division" | "franchise" | "department";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Outlet (Third Level - Physical Location)
 * Represents a physical store/POS location
 */
export interface Outlet {
  id: string;
  businessUnitId: string;
  name: string;
  code: string;
  type: "retail" | "wholesale" | "kiosk" | "popup";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Warehouse (Third Level - Storage Location)
 * Represents an inventory storage facility
 */
export interface Warehouse {
  id: string;
  businessUnitId: string;
  name: string;
  code: string;
  capacity?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Storefront (Third Level - Online Presence)
 * Represents an online store instance
 */
export interface Storefront {
  id: string;
  businessUnitId: string;
  name: string;
  domain: string;
  themeId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// HIERARCHY VALIDATION HELPERS
// ========================================

/**
 * Validates that a user has access to a specific business unit
 */
export function validateBusinessUnitAccess(
  userBusinessUnitIds: string[],
  targetBusinessUnitId: string
): boolean {
  return userBusinessUnitIds.includes(targetBusinessUnitId);
}

/**
 * Validates that an outlet belongs to a specific business unit
 */
export function validateOutletOwnership(
  outlet: Outlet,
  businessUnitId: string
): boolean {
  return outlet.businessUnitId === businessUnitId;
}

/**
 * Validates that a warehouse belongs to a specific business unit
 */
export function validateWarehouseOwnership(
  warehouse: Warehouse,
  businessUnitId: string
): boolean {
  return warehouse.businessUnitId === businessUnitId;
}

/**
 * Hierarchy Level Enum
 */
export enum HierarchyLevel {
  COMPANY = "organization",
  BUSINESS_UNIT = "business_unit",
  OUTLET = "outlet",
  WAREHOUSE = "warehouse",
  STOREFRONT = "storefront",
}

/**
 * Data Ownership Context
 * Every API call should include this context
 */
export interface DataOwnershipContext {
  companyId?: string;
  businessUnitId?: string;
  outletId?: string;
  warehouseId?: string;
  storefrontId?: string;
}
