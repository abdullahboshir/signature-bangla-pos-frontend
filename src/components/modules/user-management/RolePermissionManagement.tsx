"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Shield, Save, Search, Settings, Users, ShoppingCart, Package, Building2, TrendingUp, Loader2, Pencil, Trash2, Briefcase, CreditCard, Monitor, Warehouse, ShoppingBag, Globe, Truck, FileText, MessageSquare, Megaphone, BoxIcon, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import PermissionGroupManagement from './PermissionGroupManagement';
import {
    RESOURCE_KEYS,
    PERMISSION_SCOPES,
    PERMISSION_OPERATORS,
    PERMISSION_KEYS
} from '@/config/permission-keys';

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Swal from 'sweetalert2';
import {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useGetPermissionGroupsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} from "@/redux/api/roleApi";
import { usePermissions } from "@/hooks/usePermissions";

// Exported Types
export interface Permission {
    _id: string;
    id: string; // "PRODUCT_VIEW"
    resource: string; // "product"
    action: string; // "view"
    description: string;
    scope?: string;
    operator?: string;
    value?: string;
}

export interface PermissionGroup {
    _id: string;
    name: string;
    description?: string;
    permissions: Permission[];
    isActive: boolean;
}

export interface Role {
    _id: string;
    id: string; // "super-admin"
    name: string;
    description?: string;
    permissions: string[]; // List of Permission IDs (strings)
    permissionGroups?: string[]; // List of Permission Group IDs (strings)
    inheritedRoles?: string[] | Role[]; // List of Role IDs
    hierarchyLevel?: number;
    maxDataAccess?: {
        products?: number;
        orders?: number;
        customers?: number;
    };
    usersCount?: number;
    isSystemRole?: boolean; // If true, maybe uneditable
    isDefault?: boolean; // Only one per hierarchy level
}

// Helper to map resource to icon
const getResourceIcon = (resource: string) => {
    switch (resource) {
        // Catalog
        case RESOURCE_KEYS.PRODUCT:
        case RESOURCE_KEYS.CATEGORY:
        case RESOURCE_KEYS.BRAND:
        case RESOURCE_KEYS.ATTRIBUTE:
        case RESOURCE_KEYS.UNIT:
            return Package;

        // Sales & POS
        case RESOURCE_KEYS.ORDER:
        case RESOURCE_KEYS.RETURN:
        case RESOURCE_KEYS.CART: // Was SHOPPING_CART
            return ShoppingCart;
        case RESOURCE_KEYS.TERMINAL:
        case RESOURCE_KEYS.CASH_REGISTER:
            return Monitor;
        case RESOURCE_KEYS.INVOICE:
            return FileText;

        // HRM
        case RESOURCE_KEYS.USER:
        case RESOURCE_KEYS.STAFF:
        case RESOURCE_KEYS.ATTENDANCE:
        case RESOURCE_KEYS.PAYROLL:
        case RESOURCE_KEYS.LEAVE:
        case RESOURCE_KEYS.DESIGNATION:
        case RESOURCE_KEYS.DEPARTMENT:
            return Users;

        // Business
        case RESOURCE_KEYS.ROLE:
        case RESOURCE_KEYS.PERMISSION:
            return Shield;
        case RESOURCE_KEYS.BUSINESS_UNIT:
        case RESOURCE_KEYS.OUTLET:
            return Building2;

        // System
        case RESOURCE_KEYS.SYSTEM:
        case RESOURCE_KEYS.SYSTEM: // Was SETTINGS
            return Settings;

        // Inventory
        case RESOURCE_KEYS.INVENTORY:
        case RESOURCE_KEYS.PURCHASE:
        case RESOURCE_KEYS.SUPPLIER:
        case RESOURCE_KEYS.STOCK_TRANSFER: // legacy
        case RESOURCE_KEYS.TRANSFER:
        case RESOURCE_KEYS.ADJUSTMENT:
            return BoxIcon;
        case RESOURCE_KEYS.WAREHOUSE:
            return Warehouse;

        // Finance
        case RESOURCE_KEYS.PAYMENT:
        case RESOURCE_KEYS.EXPENSE:
        case RESOURCE_KEYS.EXPENSE_CATEGORY:
        case RESOURCE_KEYS.BUDGET:
        case RESOURCE_KEYS.ACCOUNT:
        case RESOURCE_KEYS.TRANSACTION:
        case RESOURCE_KEYS.SETTLEMENT:
        case RESOURCE_KEYS.PAYOUT:
            return CreditCard;

        // Marketing
        case RESOURCE_KEYS.STOREFRONT:
        case RESOURCE_KEYS.AD_CAMPAIGN:
        case RESOURCE_KEYS.PROMOTION:
        case RESOURCE_KEYS.COUPON:
        case RESOURCE_KEYS.AFFILIATE:
        case RESOURCE_KEYS.LOYALTY:
        case RESOURCE_KEYS.PIXEL:
        case RESOURCE_KEYS.AUDIENCE:
        case RESOURCE_KEYS.AD_CAMPAIGN: // Was MARKETING
            return Megaphone;

        // Content
        case RESOURCE_KEYS.CONTENT:
        case RESOURCE_KEYS.LANDING_PAGE:
        case RESOURCE_KEYS.EMAIL_TEMPLATE:
        case RESOURCE_KEYS.SMS_TEMPLATE:
            return FileText;

        // Reports
        case RESOURCE_KEYS.REPORT:
        case RESOURCE_KEYS.ANALYTICS:
        case RESOURCE_KEYS.SALES_REPORT:
        case RESOURCE_KEYS.PURCHASE_REPORT:
        case RESOURCE_KEYS.STOCK_REPORT:
        case RESOURCE_KEYS.PROFIT_LOSS_REPORT:
        case RESOURCE_KEYS.AUDIT_LOG:
            return TrendingUp;

        // Support
        case RESOURCE_KEYS.TICKET:
        case RESOURCE_KEYS.CHAT:
        case RESOURCE_KEYS.DISPUTE:
        case RESOURCE_KEYS.QUESTION:
            return MessageSquare;

        // Logistics
        case RESOURCE_KEYS.SHIPPING:
        case RESOURCE_KEYS.DELIVERY:
        case RESOURCE_KEYS.COURIER:
        case RESOURCE_KEYS.PARCEL:
            return Truck;

        // Risk
        case RESOURCE_KEYS.FRAUD_DETECTION:
        case RESOURCE_KEYS.BLACKLIST:
        case RESOURCE_KEYS.RISK_RULE:
        case RESOURCE_KEYS.RISK_PROFILE:
            return Shield;

        // Global/Common
        case RESOURCE_KEYS.SYSTEM: // Was GLOBAL
            return Globe;

        default:
            return Shield;
    }
};

export function RolePermissionManagement() {
    const { hasPermission } = usePermissions();
    // RTK Query Hooks
    const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery({ limit: 1000 });
    const { data: permissionsData, isLoading: isPermsLoading } = useGetPermissionsQuery({ limit: 5000 });
    const { data: groupsData } = useGetPermissionGroupsQuery({ limit: 1000 });
    console.log("rolesData", rolesData);
    console.log("permissionsData", permissionsData);
    console.log("groupsData", groupsData);

    // Mutations
    const [createRole] = useCreateRoleMutation();
    const [updateRole] = useUpdateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();

    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Create Role State
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDesc, setNewRoleDesc] = useState('');
    const [newIsDefault, setNewIsDefault] = useState(false);
    const [newHierarchy, setNewHierarchy] = useState(1);
    const [newDataAccess, setNewDataAccess] = useState({ products: 0, orders: 0, customers: 0 });
    const [viewingGroup, setViewingGroup] = useState<PermissionGroup | null>(null);
    const [groupSearchQuery, setGroupSearchQuery] = useState('');

    // Sync RTK Data to Local State
    useEffect(() => {
        if (rolesData) {
            // Normalize Roles like before
            let fetchedRoles: Role[] = Array.isArray(rolesData) ? rolesData : rolesData?.data?.result || rolesData?.data || [];

            // Normalize Permissions array in roles
            fetchedRoles = fetchedRoles.map((role: any) => {
                const rawPerms = Array.isArray(role.permissions)
                    ? role.permissions.map((p: any) => (typeof p === 'object' && p !== null && p._id) ? p._id : p)
                    : [];

                // Deduplicate permissions
                const uniquePerms = Array.from(new Set(rawPerms)) as string[];

                // Normalize Permission Groups
                const rawGroups = Array.isArray(role.permissionGroups)
                    ? role.permissionGroups.map((g: any) => (typeof g === 'object' && g !== null && g._id) ? g._id : g)
                    : [];
                const uniqueGroups = Array.from(new Set(rawGroups)) as string[];

                // Normalize Inherited Roles
                const rawInherited = Array.isArray(role.inheritedRoles)
                    ? role.inheritedRoles.map((r: any) => (typeof r === 'object' && r !== null && r._id) ? r._id : r)
                    : [];
                const uniqueInherited = Array.from(new Set(rawInherited)) as string[];

                return {
                    ...role,
                    permissions: uniquePerms,
                    permissionGroups: uniqueGroups,
                    inheritedRoles: uniqueInherited,
                    hierarchyLevel: role.hierarchyLevel || 1, // Default to 1 if missing
                    maxDataAccess: role.maxDataAccess || { products: 0, orders: 0, customers: 0 },
                    isSystemRole: role.isSystemRole || (role as any).isSystem || false,
                    isDefault: role.isDefault || false
                };
            });

            setRoles(fetchedRoles);

            // Set default selected role if not set
            if (fetchedRoles.length > 0 && !selectedRoleId) {
                // If previously selected role still exists, keep it, else select first
                setSelectedRoleId(fetchedRoles[0]._id);
            }
        }
    }, [rolesData]); // Only update when API data changes (e.g., after refetch)

    useEffect(() => {
        if (permissionsData) {
            const fetchedPermissions: Permission[] = Array.isArray(permissionsData) ? permissionsData : permissionsData?.data || [];
            console.log("Fetched Permissions Count:", fetchedPermissions.length);
            setPermissions(fetchedPermissions);
        }
    }, [permissionsData]);


    const isLoading = isRolesLoading || isPermsLoading;
    const selectedRole = roles.find(r => r._id === selectedRoleId);

    // Group Permissions by Resource - Memoized for performance
    const groupedPermissions = React.useMemo(() => {
        return permissions.reduce((acc, perm) => {
            const resource = perm.resource || 'Other';
            if (!acc[resource]) {
                acc[resource] = [];
            }
            acc[resource].push(perm);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions]);



    const isSuperAdmin = (role: Role | null | undefined) => {
        if (!role) return false;

        // Debugging
        console.log("Checking Super Admin:", role.name, role.id, role.isSystemRole);

        // Check ID, or Name (case-insensitive) - REMOVED isSystem check to allow other system roles to be edited
        const nameLower = role.name ? role.name.toLowerCase() : '';
        return (
            role.id === 'super-admin' ||
            nameLower === 'super admin' ||
            nameLower === 'super-admin'
        );
    };

    const isSystemRole = (role: Role | null | undefined) => {
        return !!role?.isSystemRole;
    };

    const handleCreateRole = async () => {
        if (!newRoleName) return;

        try {
            const payload = {
                name: newRoleName,
                description: newRoleDesc,
                permissions: [],
                permissionGroups: [],
                hierarchyLevel: newHierarchy,
                maxDataAccess: newDataAccess,
                isDefault: newIsDefault
            };

            const response: any = await createRole(payload).unwrap();

            // The mutation invalidates 'role' tag, so useGetRolesQuery will refetch.
            // We just need to handle UI success state.
            // However, RTK refetch is async. We might want to select the new role when it appears.
            // For now, simple success message.

            setIsCreateDialogOpen(false);
            setNewRoleName('');
            setNewRoleDesc('');
            setNewIsDefault(false);
            setNewHierarchy(1);
            setNewDataAccess({ products: 0, orders: 0, customers: 0 });

            Swal.fire({
                icon: 'success',
                title: 'Role Created',
                text: `${newRoleName} has been created successfully.`,
                timer: 1500,
                showConfirmButton: false,
            });

            // Note: selectedRoleId update logic is handled in useEffect when new list arrives or we can explicitly set it here if we key it 
            // But we rely on refetch for list update.

        } catch (error: any) {
            console.error("Create role error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.data?.message || 'Failed to create role. Ensure name is unique and valid.',
            });
        }
    };

    const handleTogglePermission = (permissionId: string) => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;
        // Optimistic update locally
        const updatedRoles = roles.map(role => {
            if (role._id === selectedRole._id) {
                const hasPerm = role.permissions.includes(permissionId);
                return {
                    ...role,
                    permissions: hasPerm
                        ? role.permissions.filter(p => p !== permissionId)
                        : [...role.permissions, permissionId]
                };
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    const handleToggleGroup = (groupId: string) => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;

        const group = groupsData?.result?.find((g: PermissionGroup) => g._id === groupId);
        if (!group) return;

        const groupPermissionIds = group.permissions.map((p: Permission) => p._id);

        // Check if all permissions in this group are already selected
        const allSelected = groupPermissionIds.every((id: string) => selectedRole.permissions.includes(id));

        // Ensure permissionGroups is treated as string[] for local updates
        let newGroups = selectedRole.permissionGroups ? [...selectedRole.permissionGroups] : [];
        // Handle case where it might be objects (though normalized to IDs in useEffect)
        newGroups = newGroups.map((g: any) => typeof g === 'object' ? g._id : g);

        let newPermissions;
        if (allSelected) {
            // Deselect all permissions from this group
            newPermissions = selectedRole.permissions.filter(id => !groupPermissionIds.includes(id));
            // Remove group ID
            newGroups = newGroups.filter((id: any) => id !== groupId);
        } else {
            // Select all permissions from this group (additive)
            newPermissions = [...new Set([...selectedRole.permissions, ...groupPermissionIds])];
            // Add group ID if not present
            if (!newGroups.includes(groupId)) {
                newGroups.push(groupId as any); // Cast for mixed array handling if needed
            }
        }

        const updatedRoles = roles.map(role => {
            if (role._id === selectedRole._id) {
                return { ...role, permissions: newPermissions, permissionGroups: newGroups as any }; // Cast to satisfy mismatched types temporarily
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    const handleToggleInheritedRole = (targetRoleId: string) => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;
        if (targetRoleId === selectedRole._id) return; // Cannot inherit self

        const currentInherited = selectedRole.inheritedRoles ? [...selectedRole.inheritedRoles] : [];
        // Normalize to strings if needed
        let newInherited = currentInherited.map((r: any) => typeof r === 'object' ? r._id : r);

        if (newInherited.includes(targetRoleId)) {
            newInherited = newInherited.filter(id => id !== targetRoleId);
        } else {
            newInherited.push(targetRoleId);
        }

        const updatedRoles = roles.map(role => {
            if (role._id === selectedRole._id) {
                return { ...role, inheritedRoles: newInherited as any };
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    const handleSave = async () => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;
        try {
            const payload = {
                permissions: selectedRole.permissions,
                permissionGroups: selectedRole.permissionGroups,
                inheritedRoles: selectedRole.inheritedRoles
            };
            await updateRole({ id: selectedRole._id, ...payload }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Permissions Updated',
                text: `Permissions for ${selectedRole.name} saved.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error: any) {
            console.error("Save permissions error", error);
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: error?.data?.message || 'Could not update permissions.',
            });
        }
    };

    const handleSelectAll = (resourcePerms: Permission[]) => {
        if (!selectedRole || isSuperAdmin(selectedRole)) return;

        // Use _id (Mongo ID) for selection/saving
        const idsToToggle = resourcePerms.map(p => p._id);
        const currentRolePerms = selectedRole.permissions || [];
        const allSelected = idsToToggle.every(id => currentRolePerms.includes(id));

        let newPerms;
        if (allSelected) {
            newPerms = currentRolePerms.filter(id => !idsToToggle.includes(id));
        } else {
            newPerms = [...new Set([...currentRolePerms, ...idsToToggle])];
        }

        const updatedRoles = roles.map(r => r._id === selectedRole._id ? { ...r, permissions: newPerms } : r);
        setRoles(updatedRoles);
    };

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoleName, setEditingRoleName] = useState('');
    const [editingRoleDesc, setEditingRoleDesc] = useState('');
    const [editingIsDefault, setEditingIsDefault] = useState(false);
    const [editingHierarchy, setEditingHierarchy] = useState(1);
    const [editingDataAccess, setEditingDataAccess] = useState({ products: 0, orders: 0, customers: 0 });

    const handleEditRole = () => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;
        setEditingRoleName(selectedRole.name);
        setEditingRoleDesc(selectedRole.description || '');
        setEditingHierarchy(selectedRole.hierarchyLevel || 1);
        setEditingIsDefault(selectedRole.isDefault || false);
        setEditingDataAccess({
            products: selectedRole.maxDataAccess?.products ?? 0,
            orders: selectedRole.maxDataAccess?.orders ?? 0,
            customers: selectedRole.maxDataAccess?.customers ?? 0
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!selectedRole || !editingRoleName || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.UPDATE)) return;
        try {
            await updateRole({
                id: selectedRole._id,
                name: editingRoleName,
                description: editingRoleDesc,
                hierarchyLevel: editingHierarchy,
                maxDataAccess: editingDataAccess,
                isDefault: editingIsDefault
            }).unwrap();

            setIsEditDialogOpen(false);

            Swal.fire({
                icon: 'success',
                title: 'Role Updated',
                text: 'Role details have been updated successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error: any) {
            console.error("Update role error", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error?.data?.message || 'Failed to update role.',
            });
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole || isSuperAdmin(selectedRole) || !hasPermission(PERMISSION_KEYS.ROLE.DELETE)) return;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete the role "${selectedRole.name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteRole(selectedRole._id).unwrap();

                // Optimistic UI update (optional, usually refetch handles it, but deleting selected ID needs care)
                const remainingRoles = roles.filter(r => r._id !== selectedRole._id);
                setRoles(remainingRoles);
                if (remainingRoles.length > 0) {
                    setSelectedRoleId(remainingRoles[0]._id);
                } else {
                    setSelectedRoleId(null);
                }

                Swal.fire(
                    'Deleted!',
                    'The role has been deleted.',
                    'success'
                );
            } catch (error: any) {
                console.error("Delete role error", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: error?.data?.message || 'Failed to delete role. It might be assigned to users.',
                });
            }
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 h-[calc(100vh-80px)] flex flex-col">
            <Tabs defaultValue="roles" className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <TabsList className="grid w-[400px] grid-cols-2">
                            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                            <TabsTrigger value="groups">Permission Groups</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Create Role Button */}
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                {hasPermission(PERMISSION_KEYS.ROLE.CREATE) && (
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create New Role
                                    </Button>
                                )}
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Role</DialogTitle>
                                    <DialogDescription>
                                        Add a new custom role.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Role Name</Label>
                                        <Input
                                            id="name"
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                            placeholder="e.g. Regional Manager"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="isDefault" checked={newIsDefault} onCheckedChange={(c: any) => setNewIsDefault(!!c)} />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Set as Default Role
                                            </Label>
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                New users with this hierarchy level will get this role automatically.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input
                                            id="desc"
                                            value={newRoleDesc}
                                            onChange={(e) => setNewRoleDesc(e.target.value)}
                                            placeholder="Role description..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="hierarchy">Hierarchy Level (1-100)</Label>
                                            <Input
                                                id="hierarchy"
                                                type="number"
                                                min={1}
                                                max={100}
                                                value={newHierarchy}
                                                onChange={(e) => setNewHierarchy(parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="border p-3 rounded-md space-y-2">
                                        <Label>Max Data Access Limit (0 = Unlimited)</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="grid gap-1">
                                                <Label htmlFor="access-products" className="text-xs">Products</Label>
                                                <Input
                                                    id="access-products"
                                                    type="number"
                                                    min={0}
                                                    value={newDataAccess.products}
                                                    onChange={(e) => setNewDataAccess({ ...newDataAccess, products: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label htmlFor="access-orders" className="text-xs">Orders</Label>
                                                <Input
                                                    id="access-orders"
                                                    type="number"
                                                    min={0}
                                                    value={newDataAccess.orders}
                                                    onChange={(e) => setNewDataAccess({ ...newDataAccess, orders: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label htmlFor="access-customers" className="text-xs">Customers</Label>
                                                <Input
                                                    id="access-customers"
                                                    type="number"
                                                    min={0}
                                                    value={newDataAccess.customers}
                                                    onChange={(e) => setNewDataAccess({ ...newDataAccess, customers: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateRole} disabled={!newRoleName}>Create Role</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <TabsContent value="groups" className="flex-1 overflow-auto p-1">
                    <PermissionGroupManagement />
                </TabsContent>

                <TabsContent value="roles" className="flex-1 flex flex-col overflow-hidden data-[state=active]:flex">

                    {/* Edit Role Dialog (Hidden logic, triggered by state) */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>
                                    Update role details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Role Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingRoleName}
                                        onChange={(e) => setEditingRoleName(e.target.value)}
                                        placeholder="Role Name"
                                        disabled={isSystemRole(selectedRole)}
                                    />
                                    {isSystemRole(selectedRole) && <p className="text-[10px] text-orange-500">System roles cannot be renamed.</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="edit-isDefault" checked={editingIsDefault} onCheckedChange={(c: any) => setEditingIsDefault(!!c)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="edit-isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Set as Default Role
                                        </Label>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-desc">Description</Label>
                                    <Input
                                        id="edit-desc"
                                        value={editingRoleDesc}
                                        onChange={(e) => setEditingRoleDesc(e.target.value)}
                                        placeholder="Description"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-hierarchy">Hierarchy Level</Label>
                                        <Input
                                            id="edit-hierarchy"
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={editingHierarchy}
                                            onChange={(e) => setEditingHierarchy(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="border p-3 rounded-md space-y-2">
                                    <Label>Max Data Access Limit (0 = Unlimited)</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="grid gap-1">
                                            <Label htmlFor="edit-access-products" className="text-xs">Products</Label>
                                            <Input
                                                id="edit-access-products"
                                                type="number"
                                                min={0}
                                                value={editingDataAccess.products}
                                                onChange={(e) => setEditingDataAccess({ ...editingDataAccess, products: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor="edit-access-orders" className="text-xs">Orders</Label>
                                            <Input
                                                id="edit-access-orders"
                                                type="number"
                                                min={0}
                                                value={editingDataAccess.orders}
                                                onChange={(e) => setEditingDataAccess({ ...editingDataAccess, orders: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor="edit-access-customers" className="text-xs">Customers</Label>
                                            <Input
                                                id="edit-access-customers"
                                                type="number"
                                                min={0}
                                                value={editingDataAccess.customers}
                                                onChange={(e) => setEditingDataAccess({ ...editingDataAccess, customers: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateRole} disabled={!editingRoleName}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
                        {/* Left Column: Roles List */}
                        <Card className="lg:col-span-3 flex flex-col h-full overflow-hidden">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle>Roles</CardTitle>
                                <div className="pt-2 relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search roles..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <div className="flex-1 overflow-auto p-2">
                                <div className="space-y-2">
                                    {roles
                                        .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((role) => {
                                            // Calculate assigned groups names (moved logic here)
                                            const assignedGroupNames = (role.permissionGroups || []).map(gid => {
                                                const allGroups = Array.isArray(groupsData) ? groupsData : (groupsData?.result || []);
                                                const g = allGroups.find((grp: any) => grp._id === gid);
                                                return g ? g.name : null;
                                            }).filter(Boolean);

                                            return (
                                                <TooltipProvider key={role._id}>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                onClick={() => setSelectedRoleId(role._id)}
                                                                className={`
                                                                p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/60
                                                                ${selectedRoleId === role._id ? 'border-primary bg-muted shadow-sm' : 'border-transparent'}
                                                            `}
                                                            >
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                        <span className="font-medium truncate">{role.name}</span>
                                                                        {role.id === 'super-admin' ?
                                                                            <Badge className="text-[10px] h-5 bg-purple-600">Super Admin</Badge>
                                                                            : isSystemRole(role) ?
                                                                                <Badge className="text-[10px] h-5" variant="secondary">System</Badge>
                                                                                : null
                                                                        }
                                                                        {role.isDefault && <Badge variant="outline" className="text-[10px] h-5 border-blue-500 text-blue-500">Default</Badge>}
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                                    {role.description}
                                                                </p>
                                                            </div>
                                                        </TooltipTrigger>
                                                        {assignedGroupNames.length > 0 && (
                                                            <TooltipContent side="right" className="max-w-[300px] p-0 overflow-hidden z-50">
                                                                <div className="bg-primary px-3 py-2 border-b">
                                                                    <p className="font-semibold text-xs text-primary-foreground">Assigned Groups</p>
                                                                </div>
                                                                <div className="p-2 bg-background flex flex-wrap gap-1.5">
                                                                    {assignedGroupNames.map((name: any) => (
                                                                        <Badge key={name} variant="secondary" className="text-[10px] h-5 font-normal border-muted-foreground/20">{name}</Badge>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                </div>
                            </div>
                        </Card>

                        {/* Right Column: Permission Matrix */}
                        <Card className="lg:col-span-9 flex flex-col h-full overflow-hidden border-2 border-primary/10">
                            <Tabs defaultValue="direct" className="flex flex-col h-full">
                                {/* Stats Calculation */}
                                {(() => {
                                    const totalPermissions = permissions.length;
                                    const isSuper = isSuperAdmin(selectedRole);

                                    // Calculate Effective Permissions (Direct + Group)
                                    let effectiveCount = 0;
                                    if (isSuper) {
                                        effectiveCount = totalPermissions;
                                    } else {
                                        const directIds = new Set(selectedRole?.permissions || []);
                                        // Add group permissions if manageable
                                        const allGroups = Array.isArray(groupsData) ? groupsData : (groupsData?.result || []);
                                        selectedRole?.permissionGroups?.forEach(groupId => {
                                            const group = allGroups.find((g: any) => g._id === groupId);
                                            if (group && Array.isArray(group.permissions)) {
                                                group.permissions.forEach((p: any) => directIds.add(typeof p === 'object' ? p._id : p));
                                            }
                                        });
                                        effectiveCount = directIds.size;
                                    }

                                    const selectedPermissionsCount = effectiveCount;

                                    const uniqueResources = Array.from(new Set(permissions.map(p => p.resource)));
                                    const totalModules = uniqueResources.length;

                                    // Calculate selected modules based on selected permissions
                                    const selectedPermissionObjects = permissions.filter(p => selectedRole?.permissions?.includes(p._id));
                                    const selectedModulesCount = isSuper ? totalModules : new Set(selectedPermissionObjects.map(p => p.resource)).size;

                                    return (
                                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 bg-muted/20 gap-4 flex-none">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    {selectedRole?.name} Permissions
                                                </CardTitle>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <Badge variant="outline" className="font-normal bg-background">
                                                        Modules: <span className="font-bold ml-1 text-foreground">{selectedModulesCount}/{totalModules}</span>
                                                    </Badge>
                                                    <Badge variant="outline" className="font-normal bg-background">
                                                        Permissions: <span className="font-bold ml-1 text-foreground">{selectedPermissionsCount}/{totalPermissions}</span>
                                                    </Badge>
                                                </div>


                                                <CardDescription className="mt-1">
                                                    {isSuperAdmin(selectedRole)
                                                        ? 'Super Admin has full system access.'
                                                        : 'Configure what this role can access and modify.'}
                                                </CardDescription>
                                            </div>

                                            <div className="flex flex-col items-end gap-3">
                                                {!isSuperAdmin(selectedRole) && (
                                                    <div className="flex gap-2">
                                                        <Button onClick={handleEditRole} variant="outline" size="sm" className="gap-2">
                                                            <Pencil className="h-4 w-4" /> Edit
                                                        </Button>
                                                        <Button onClick={handleDeleteRole} variant="destructive" size="sm" className="gap-2">
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </Button>
                                                        <Button onClick={handleSave} size="sm" className="gap-2">
                                                            <Save className="h-4 w-4" /> Save
                                                        </Button>
                                                    </div>
                                                )}
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="direct">Direct Permissions</TabsTrigger>
                                                    <TabsTrigger value="groups">Group Permissions</TabsTrigger>
                                                </TabsList>
                                            </div>
                                        </CardHeader>
                                    );
                                })()}

                                <TabsContent value="direct" className="flex-1 overflow-auto p-0 m-0 border-0 bg-muted/10">
                                    <div className="h-full">
                                        <div className="p-6 space-y-8">
                                            {/* Granular Permissions */}
                                            {(() => {
                                                const entries = Object.entries(groupedPermissions);
                                                console.log("Direct Permissions Debug:", {
                                                    entriesCount: entries.length,
                                                    totalPerms: permissions.length,
                                                    sample: entries.slice(0, 2)
                                                });
                                                return entries.map(([resource, perms]) => {
                                                    const ModuleIcon = getResourceIcon(resource);
                                                    // Use _id for checking selection
                                                    // For Super Admin, EVERYTHING is selected
                                                    const isSuper = isSuperAdmin(selectedRole);
                                                    const allSelected = isSuper || perms.every(p => selectedRole?.permissions?.includes(p._id));

                                                    return (
                                                        <div key={resource} className="space-y-3">
                                                            <div className="flex items-center justify-between pb-2 border-b">
                                                                <h3 className="font-medium flex items-center gap-2 text-foreground capitalize">
                                                                    <div className="p-1 bg-primary/10 rounded">
                                                                        <ModuleIcon className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                    {resource} Module
                                                                </h3>
                                                                {!isSuper && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 text-xs text-muted-foreground hover:text-primary"
                                                                        onClick={() => handleSelectAll(perms)}
                                                                    >
                                                                        {allSelected ? 'Deselect All' : 'Select All'}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {perms.map((perm) => {
                                                                    const isSelected = isSuper || selectedRole?.permissions?.includes(perm._id);
                                                                    return (
                                                                        <div
                                                                            key={perm._id}
                                                                            onClick={() => !isSuper && handleTogglePermission(perm._id)}
                                                                            className={`
                                                                            flex items-center space-x-3 p-3 rounded-md border text-sm transition-all
                                                                            ${isSelected
                                                                                    ? 'bg-primary/5 border-primary/50'
                                                                                    : 'bg-background hover:border-primary/30'}
                                                                            ${isSuper ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                                                                        `}
                                                                        >
                                                                            <div className={`
                                                                            h-4 w-4 rounded border flex items-center justify-center transition-colors
                                                                            ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}
                                                                        `}>
                                                                                {isSelected && <Check className="h-3 w-3" />}
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <span className={isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'} >
                                                                                    {perm.action.replace(/_/g, ' ').toUpperCase()}
                                                                                </span>
                                                                                <span className="text-[10px] text-muted-foreground/70">{perm.description}</span>
                                                                                {/* Dynamic Scope Badge */}
                                                                                {(perm.scope || perm.operator) && (
                                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                                        {perm.scope && (
                                                                                            <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 border-blue-200 text-blue-600">
                                                                                                {perm.scope}
                                                                                            </Badge>
                                                                                        )}
                                                                                        {perm.operator && (
                                                                                            <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 border-orange-200 text-orange-600">
                                                                                                {perm.operator}
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}

                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="groups" className="flex-1 overflow-auto p-0 m-0 border-0 bg-muted/10">
                                    <ScrollArea className="h-full">
                                        <div className="p-6 space-y-8">
                                            {/* Inherited Roles Section */}
                                            <div className="space-y-3 pb-6 border-b border-primary/20">
                                                <h3 className="font-medium flex items-center gap-2 text-foreground">
                                                    <div className="p-1 bg-primary/10 rounded">
                                                        <Users className="h-4 w-4 text-primary" />
                                                    </div>
                                                    Inherited Roles (Parent Roles)
                                                </h3>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    Select roles to inherit permissions from. This role will automatically gain all permissions from selected roles.
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {roles
                                                        .filter(r => r._id !== selectedRole?._id) // Cannot inherit self
                                                        .map((role) => {
                                                            const isSelected = (selectedRole?.inheritedRoles || []).map((r: any) => (typeof r === 'object' ? r._id : r)).includes(role._id);
                                                            const isSuper = isSuperAdmin(selectedRole);

                                                            return (
                                                                <div
                                                                    key={role._id}
                                                                    onClick={() => !isSuper && handleToggleInheritedRole(role._id)}
                                                                    className={`
                                                                        flex items-center space-x-3 p-3 rounded-md border text-sm transition-all
                                                                        ${isSelected
                                                                            ? 'bg-purple-500/10 border-purple-500/60'
                                                                            : 'bg-background hover:border-purple-500/30'}
                                                                        ${isSuper ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                                                                    `}
                                                                >
                                                                    <div className={`
                                                                        h-4 w-4 rounded border flex items-center justify-center transition-colors
                                                                        ${isSelected
                                                                            ? 'bg-purple-600 border-purple-600 text-white'
                                                                            : 'border-muted-foreground/30'}
                                                                    `}>
                                                                        {isSelected && <Check className="h-3 w-3" />}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className={isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'} >
                                                                            {role.name}
                                                                        </span>
                                                                        <span className="text-[10px] text-muted-foreground/70">Level {role?.hierarchyLevel || 1}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>

                                            {/* Permission Groups Section */}
                                            <div className="space-y-3 pb-6 border-b border-primary/20">
                                                <h3 className="font-medium flex items-center gap-2 text-foreground">
                                                    <div className="p-1 bg-primary/10 rounded">
                                                        <Shield className="h-4 w-4 text-primary" />
                                                    </div>
                                                    Permission Groups (Quick Select)
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {groupsData?.result?.map((group: PermissionGroup) => {
                                                        const groupPermissionIds = group.permissions.map((p: any) => (typeof p === 'object' && p !== null ? p._id : p));
                                                        const isSuper = isSuperAdmin(selectedRole);

                                                        // Check if Group ID is explicitly assigned OR all permissions are present
                                                        const isGroupAssigned = selectedRole?.permissionGroups?.includes(group._id);
                                                        const areAllPermissionsAssigned = groupPermissionIds.length > 0 && groupPermissionIds.every(id => selectedRole?.permissions?.includes(id));

                                                        const isSelected = isSuper || isGroupAssigned || areAllPermissionsAssigned;

                                                        // Check if SOME but not all (and group not assigned)
                                                        const isPartial = !isSelected && !isSuper && groupPermissionIds.some(id => selectedRole?.permissions?.includes(id));

                                                        return (
                                                            <div
                                                                key={group._id}
                                                                onClick={() => !isSuper && handleToggleGroup(group._id)}
                                                                className={`
                                                                    relative group flex items-start space-x-3 p-3 rounded-md border text-sm transition-all
                                                                    ${isSelected
                                                                        ? 'bg-primary/10 border-primary/60'
                                                                        : isPartial
                                                                            ? 'bg-orange-500/10 border-orange-500/50'
                                                                            : 'bg-background hover:border-primary/30'}
                                                                    ${isSuper ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                                                                `}
                                                            >
                                                                <div className={`
                                                                    mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors
                                                                    ${isSelected
                                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                                        : isPartial
                                                                            ? 'bg-orange-500 border-orange-500 text-white'
                                                                            : 'border-muted-foreground/30'}
                                                                `}>
                                                                    {isSelected && <Check className="h-3 w-3" />}
                                                                    {isPartial && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    <span className={isSelected || isPartial ? 'font-medium text-foreground' : 'text-muted-foreground'} >
                                                                        {group.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground/70">{group.permissions.length} Permissions</span>
                                                                </div>
                                                                <div
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setViewingGroup(group);
                                                                    }}
                                                                >
                                                                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <Dialog open={!!viewingGroup} onOpenChange={(open) => !open && setViewingGroup(null)}>
                                                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <Shield className="h-5 w-5 text-primary" />
                                                            {viewingGroup?.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            This group contains {viewingGroup?.permissions?.length} permissions.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="flex-1 overflow-hidden border rounded-md p-2">
                                                        <ScrollArea className="h-[400px]">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                                                                {viewingGroup?.permissions?.map((permOrId: any) => {
                                                                    // Resolve permission object if it's just an ID
                                                                    const permId = typeof permOrId === 'object' && permOrId !== null ? permOrId._id : permOrId;
                                                                    const perm = permissions.find(p => p._id === permId) || (typeof permOrId === 'object' ? permOrId : { id: permId, description: 'Unknown Permission' });

                                                                    return (
                                                                        <div key={perm._id || perm.id} className="flex items-start gap-2 text-sm border p-2 rounded bg-muted/20">
                                                                            <div className={`mt-1 h-1.5 w-1.5 rounded-full ${perm.action === 'delete' ? 'bg-red-500' : 'bg-green-500'}`} />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-mono text-xs text-muted-foreground uppercase">{perm.resource || '???'}</span>
                                                                                <span className="font-medium">{perm.description || perm.id}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </ScrollArea>
                                                    </div>

                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setViewingGroup(null)}>Close</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
