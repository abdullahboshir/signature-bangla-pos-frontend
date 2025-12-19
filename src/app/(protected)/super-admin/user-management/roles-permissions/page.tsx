'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Shield, AlertTriangle, Save, Search, Settings, Users, ShoppingCart, Package, Building2, TrendingUp, Loader2 } from 'lucide-react';
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
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useGetPermissionsQuery
} from '@/redux/api/roleApi';

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
    permissionGroups?: any[];
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
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Create Role State
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDesc, setNewRoleDesc] = useState('');

    // Local state for tracking unsaved permission changes
    const [unsavedPermissions, setUnsavedPermissions] = useState<Record<string, string[]>>({});

    // RTK Query Hooks
    const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery({});
    const { data: permissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery({});

    const [createRole] = useCreateRoleMutation();
    const [updateRole] = useUpdateRoleMutation();

    const isLoading = isLoadingRoles || isLoadingPermissions;

    // Set default selected role
    if (!selectedRoleId && roles.length > 0) {
        setSelectedRoleId(roles[0]._id);
    }

    const selectedRole = roles.find((r: any) => r._id === selectedRoleId);

    // Group Permissions by Resource
    const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
        const resource = perm.resource || 'Other';
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    const handleCreateRole = async () => {
        if (!newRoleName) return;

        try {
            await createRole({
                name: newRoleName,
                description: newRoleDesc,
                permissions: [],
                permissionGroups: []
            }).unwrap();

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
        } catch (error: any) {
            console.error("Create role error", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.data?.message || 'Failed to create role.',
            });
        }
    };

    const handleTogglePermission = (permissionId: string) => {
        if (!selectedRole || !selectedRoleId) return;

        // Get current permissions from state or fallback to role permissions
        const currentPermissions = unsavedPermissions[selectedRoleId] || selectedRole.permissions || [];

        let newPermissions;
        if (currentPermissions.includes(permissionId)) {
            newPermissions = currentPermissions.filter(id => id !== permissionId);
        } else {
            newPermissions = [...currentPermissions, permissionId];
        }

        setUnsavedPermissions({
            ...unsavedPermissions,
            [selectedRoleId]: newPermissions
        });
    };

    const handleSelectAll = (resourcePerms: Permission[]) => {
        if (!selectedRole || !selectedRoleId) return;

        const currentPermissions = unsavedPermissions[selectedRoleId] || selectedRole.permissions || [];
        const idsToToggle = resourcePerms.map(p => p.id);
        const allSelected = idsToToggle.every(id => currentPermissions.includes(id));

        let newPermissions;
        if (allSelected) {
            newPermissions = currentPermissions.filter(id => !idsToToggle.includes(id));
        } else {
            newPermissions = [...new Set([...currentPermissions, ...idsToToggle])];
        }

        setUnsavedPermissions({
            ...unsavedPermissions,
            [selectedRoleId]: newPermissions
        });
    };

    const handleSave = async () => {
        if (!selectedRole || !selectedRoleId) return;

        const permissionsToSave = unsavedPermissions[selectedRoleId];
        if (!permissionsToSave) return; // No changes logic could be better, but acceptable for now

        try {
            await updateRole({
                id: selectedRole._id,
                permissions: permissionsToSave
            }).unwrap();

            // Clear unsaved state for this role
            const newUnsaved = { ...unsavedPermissions };
            delete newUnsaved[selectedRoleId];
            setUnsavedPermissions(newUnsaved);

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
                                .filter((r: any) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((role: any) => (
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
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-muted/20">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                {selectedRole?.name} Permissions
                            </CardTitle>
                            <CardDescription>
                                {selectedRole?.id === 'super-admin'
                                    ? 'Super Admin has full system access.'
                                    : 'Configure what this role can access and modify.'}
                            </CardDescription>
                        </div>
                        {selectedRole?.id !== 'super-admin' && (
                            <div className="flex gap-2">
                                {unsavedPermissions[selectedRole?._id] && (
                                    <span className="text-xs text-amber-500 flex items-center font-medium">
                                        <AlertTriangle className="h-3 w-3 mr-1" /> Unsaved Changes
                                    </span>
                                )}
                                <Button onClick={handleSave} size="sm" className="gap-2" disabled={!unsavedPermissions[selectedRole?._id]}>
                                    <Save className="h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <div className="flex-1 overflow-auto bg-muted/10">
                        {selectedRole?.id === 'super-admin' ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                <Shield className="h-16 w-16 mb-4 text-primary/20" />
                                <h3 className="text-lg font-medium text-foreground">Unlimited Access</h3>
                                <p className="max-w-md mt-2">
                                    The Super Admin role is the highest level of authority and has implied access to all current and future modules.
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-full">
                                <div className="p-6 space-y-8">
                                    {Object.entries(groupedPermissions).map(([resource, perms]: [string, any]) => {
                                        const ModuleIcon = getResourceIcon(resource);
                                        const rolePerms = unsavedPermissions[selectedRole?._id] || selectedRole?.permissions || [];
                                        const allSelected = perms.every((p: any) => rolePerms.includes(p.id));

                                        return (
                                            <div key={resource} className="space-y-3">
                                                <div className="flex items-center justify-between pb-2 border-b">
                                                    <h3 className="font-medium flex items-center gap-2 text-foreground capitalize">
                                                        <div className="p-1 bg-primary/10 rounded">
                                                            <ModuleIcon className="h-4 w-4 text-primary" />
                                                        </div>
                                                        {resource} Module
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-xs text-muted-foreground hover:text-primary"
                                                        onClick={() => handleSelectAll(perms as any[])}
                                                    >
                                                        {allSelected ? 'Deselect All' : 'Select All'}
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {perms.map((perm: any) => {
                                                        const isSelected = rolePerms.includes(perm.id);
                                                        return (
                                                            <div
                                                                key={perm.id}
                                                                onClick={() => handleTogglePermission(perm.id)}
                                                                className={`
                                                                    flex items-center space-x-3 p-3 rounded-md border text-sm cursor-pointer transition-all
                                                                    ${isSelected
                                                                        ? 'bg-primary/5 border-primary/50'
                                                                        : 'bg-background hover:border-primary/30'}
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
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
