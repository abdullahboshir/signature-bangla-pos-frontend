import { PERMISSION_KEYS, RESOURCE_KEYS, ACTION_KEYS } from "@/config/permission-keys";

export type permissionResource = keyof typeof RESOURCE_KEYS;
export type PermissionAction = keyof typeof ACTION_KEYS;

export enum PermissionResourceType {
    USER = "USER",
    ROLE = "ROLE",
    PERMISSION = "PERMISSION",
    PRODUCT = "PRODUCT",
    CATEGORY = "CATEGORY",
    ORDER = "ORDER",
    INVENTORY = "INVENTORY",
    BUSINESS_UNIT = "BUSINESS_UNIT",
    OUTLET = "OUTLET",
    REPORT = "REPORT",
    SETTINGS = "SETTINGS",
    // Add missing ones from RESOURCE_KEYS if needed
}

export enum PermissionActionType {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    MANAGE = "MANAGE",
}

export interface Permission {
  _id: string;
  name: string;
  code: string;
  resource: PermissionResourceType;
  action: PermissionActionType;
  description?: string;
}
