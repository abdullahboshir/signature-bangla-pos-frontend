export interface IPermissionAssignment {
  role: any;
  scopeType: 'global' | 'business-unit' | 'outlet';
  scopeId?: string | null;
  scopeModel?: 'BusinessUnit' | 'Outlet' | null;
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
  
  // Auth & Roles
  role: string[]; // Legacy: array of role names
  roles: any[];   // Legacy: populated role objects
  permissions: IPermissionAssignment[]; // New Scoped Permissions
  isSuperAdmin?: boolean;
  
  // Organization
  businessUnits?: any[];
  branches?: string[];
  
  // User Details
  designation?: string; // Often added in frontend for UI
  profileImg?: string; // Avatar URL
  avatar?: string;
  
  // Status
  status?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  
  createdAt?: string;
  updatedAt?: string;
}
