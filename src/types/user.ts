export interface IPermissionAssignment {
  role: any;
  scopeType: "global" | "business-unit" | "outlet";
  scopeId?: string | null;
  scopeModel?: "BusinessUnit" | "Outlet" | null;
}

export interface User {
  _id: string;
  id: string;
  email: string; // Unique, required
  name?: {
    firstName: string;
    lastName: string;
  };
  fullName?: string; // Virtual property often coming from backend
  phone?: string;

  // Enterprise Access Model
  globalRoles?: any[]; // Global Roles
  businessAccess?: any[]; // Scoped Access

  // Auth & Roles (Legacy Compatibility)
  role: string[];
  roles: any[];
  permissions: any[]; // Legacy or simple strings
  isSuperAdmin?: boolean;

  // Organization
  businessUnits?: any[];
  branches?: string[];

  // User Details
  designation?: string;
  profileImg?: string;
  avatar?: string;

  // Status
  status?: string;
  isActive?: boolean;
  isDeleted?: boolean;

  // Authorization Context (Effective Permissions)
  hierarchyLevel?: number;
  dataScope?: string; // e.g. 'global', 'business', 'outlet', 'own'
  maxDataAccess?: {
    products: number;
    orders: number;
    customers: number;
  };
  effectivePermissions?: any[]; // Populated permission objects

  createdAt?: string;
  updatedAt?: string;
  context?: {
    primary?: {
      businessUnit?: { _id: string; slug: string; id: string };
      organization?: { _id: string; name: string; slug: string };
      outlet?: { _id: string; name: string };
      role?: string;
    };
    available?: Array<{
      organization: { _id: string; slug: string; id: string; name: string };
      businessUnit: { _id: string; slug: string; id: string; name: string };
      outlets: Array<{ _id: string; name: string }>;
      outletCount: number;
    }>;
  };
}
