'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Shield, Save, Search, Settings, Users, ShoppingCart, Package, Building2, TrendingUp, Loader2, Pencil, Trash2 } from 'lucide-react';
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
import Swal from 'sweetalert2';
import {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} from "@/redux/api/roleApi";

// Types based on the user provided data
interface Permission {
    _id: string;
    id: string; // "PRODUCT_VIEW"
    resource: string; // "product"
    action: string; // "view"
    description: string;
}

interface Role {
    _id: string;
    id: string; // "super-admin"
    name: string;
    description?: string;
    permissions: string[]; // List of Permission IDs (strings)
    usersCount?: number;
    isSystem?: boolean; // If true, maybe uneditable
}

// Helper to map resource to icon
const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
        case 'product': return Package;
        case 'pos': return ShoppingCart;
        case 'sales': return TrendingUp;
        case 'user': return Users;
        case 'role': return Shield;
        case 'business-unit': return Building2;
        case 'settings': return Settings;
        default: return Shield;
    }
};

export default function RolesPermissionsPage() {
    // RTK Query Hooks
    const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery({ limit: 1000 });
    const { data: permissionsData, isLoading: isPermsLoading } = useGetPermissionsQuery(undefined);

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

                return {
                    ...role,
                    permissions: uniquePerms
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

    // Group Permissions by Resource
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const resource = perm.resource || 'Other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    const isSuperAdmin = (role: Role | null | undefined) => {
        if (!role) return false;

        // Debugging
        console.log("Checking Super Admin:", role.name, role.id, role.isSystem);

        // Check ID, or Name (case-insensitive) - REMOVED isSystem check to allow other system roles to be edited
        const nameLower = role.name ? role.name.toLowerCase() : '';
        return (
            role.id === 'super-admin' ||
            nameLower === 'super admin' ||
            nameLower === 'super-admin'
        );
    };

    const handleCreateRole = async () => {
        if (!newRoleName) return;

        try {
            const payload = {
                name: newRoleName,
                description: newRoleDesc,
                permissions: [],
                permissionGroups: []
            };

            const response: any = await createRole(payload).unwrap();

            // The mutation invalidates 'role' tag, so useGetRolesQuery will refetch.
            // We just need to handle UI success state.
            // However, RTK refetch is async. We might want to select the new role when it appears.
            // For now, simple success message.

            setIsCreateDialogOpen(false);
            setNewRoleName('');
            setNewRoleDesc('');

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
        if (!selectedRole || isSuperAdmin(selectedRole)) return;
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

    const handleSave = async () => {
        if (!selectedRole || isSuperAdmin(selectedRole)) return;
        try {
            const payload = { permissions: selectedRole.permissions };
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

    const handleEditRole = () => {
        if (!selectedRole || isSuperAdmin(selectedRole)) return;
        setEditingRoleName(selectedRole.name);
        setEditingRoleDesc(selectedRole.description || '');
        setIsEditDialogOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!selectedRole || !editingRoleName || isSuperAdmin(selectedRole)) return;
        try {
            await updateRole({
                id: selectedRole._id,
                name: editingRoleName,
                description: editingRoleDesc
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
        if (!selectedRole || isSuperAdmin(selectedRole)) return;

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
                    <p className="text-muted-foreground">
                        Manage dynamic role-based access control.
                    </p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Role
                        </Button>
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
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input
                                    id="desc"
                                    value={newRoleDesc}
                                    onChange={(e) => setNewRoleDesc(e.target.value)}
                                    placeholder="Role description..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateRole} disabled={!newRoleName}>Create Role</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                                />
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdateRole} disabled={!editingRoleName}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Left Column: Roles List */}
                <Card className="lg:col-span-4 flex flex-col h-full overflow-hidden">
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
                                .map((role) => (
                                    <div
                                        key={role._id}
                                        onClick={() => setSelectedRoleId(role._id)}
                                        className={`
                                        p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/60
                                        ${selectedRoleId === role._id ? 'border-primary bg-muted shadow-sm' : 'border-transparent'}
                                    `}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-sm">{role.name}</span>
                                            {role.id === 'super-admin' && <Badge className="text-[10px] h-5">System</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {role.description}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Card>

                {/* Right Column: Permission Matrix */}
                <Card className="lg:col-span-8 flex flex-col h-full overflow-hidden border-2 border-primary/10">
                    {/* Stats Calculation */}
                    {(() => {
                        const totalPermissions = permissions.length;
                        const selectedPermissionsCount = selectedRole?.permissions?.length || 0;

                        const uniqueResources = Array.from(new Set(permissions.map(p => p.resource)));
                        const totalModules = uniqueResources.length;

                        // Calculate selected modules based on selected permissions
                        const selectedPermissionObjects = permissions.filter(p => selectedRole?.permissions?.includes(p._id));
                        const selectedModulesCount = new Set(selectedPermissionObjects.map(p => p.resource)).size;

                        return (
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 bg-muted/20 gap-4">
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
                            </CardHeader>
                        );
                    })()}

                    <div className="flex-1 overflow-auto bg-muted/10">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-8">
                                {Object.entries(groupedPermissions).map(([resource, perms]) => {
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
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                </Card>
            </div>
        </div>
    );
}
