"use client"

import React, { useState } from 'react';
import {
    useGetPermissionGroupsQuery,
    useCreatePermissionGroupMutation,
    useUpdatePermissionGroupMutation,
    useDeletePermissionGroupMutation,
    useGetPermissionsQuery
} from '@/redux/api/iam/roleApi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Trash2,
    Edit,
    Plus,
    Shield,
    Search,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Permission, PermissionGroup } from './RolePermissionManagement';
import { PERMISSION_STRATEGIES, PERMISSION_EFFECTS, PERMISSION_KEYS } from '@/config/permission-keys';
import { usePermissions } from '@/hooks/usePermissions';

export default function PermissionGroupManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissions: [] as string[] });
    const [searchQuery, setSearchQuery] = useState('');

    const { hasPermission } = usePermissions();


    const { data: groupsData, isLoading: isGroupsLoading } = useGetPermissionGroupsQuery({});
    const { data: permissionsData, isLoading: isPermissionsLoading } = useGetPermissionsQuery({ limit: 1000 });

    const [createGroup, { isLoading: isCreating }] = useCreatePermissionGroupMutation();
    const [updateGroup, { isLoading: isUpdating }] = useUpdatePermissionGroupMutation();
    const [deleteGroup, { isLoading: isDeleting }] = useDeletePermissionGroupMutation();

    const groups = groupsData?.result || [];
    const allPermissions = permissionsData?.result || permissionsData || [];

    // Group permissions by resource for the modal
    const permissionsByResource = allPermissions.reduce((acc: any, perm: Permission) => {
        if (!acc[perm.resource]) acc[perm.resource] = [];
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    const handleCreate = async () => {
        if (!hasPermission(PERMISSION_KEYS.PERMISSION.CREATE)) return;
        try {
            await createGroup({
                ...formData,
                resolver: {
                    strategy: PERMISSION_STRATEGIES.PRIORITY_BASED,
                    priority: 0,
                    override: false,
                    fallback: PERMISSION_EFFECTS.DENY
                }
            }).unwrap();
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '', permissions: [] });
            Swal.fire('Success', 'Permission group created successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error?.data?.message || 'Failed to create group', 'error');
        }
    };

    const handleUpdate = async () => {
        if (!editingGroup || !hasPermission(PERMISSION_KEYS.PERMISSION.UPDATE)) return;
        try {
            await updateGroup({
                id: editingGroup._id,
                ...formData,
                resolver: {
                    strategy: PERMISSION_STRATEGIES.PRIORITY_BASED,
                    priority: 0,
                    override: false,
                    fallback: PERMISSION_EFFECTS.DENY
                }
            }).unwrap();
            setEditingGroup(null);
            setFormData({ name: '', description: '', permissions: [] });
            Swal.fire('Success', 'Permission group updated successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error?.data?.message || 'Failed to update group', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!hasPermission(PERMISSION_KEYS.PERMISSION.DELETE)) return;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteGroup(id).unwrap();
                Swal.fire('Deleted!', 'Permission group has been deleted.', 'success');
            } catch (error: any) {
                Swal.fire('Error', error?.data?.message || 'Failed to delete group', 'error');
            }
        }
    };

    const openEditModal = (group: PermissionGroup) => {
        setEditingGroup(group);
        setFormData({
            name: group.name,
            description: group.description || '',
            permissions: group.permissions.map((p: Permission) => p._id)
        });
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(id => id !== permId)
                : [...prev.permissions, permId]
        }));
    };

    const toggleResource = (resource: string) => {
        const resourcePerms = permissionsByResource[resource].map((p: Permission) => p._id);
        const allSelected = resourcePerms.every((id: string) => formData.permissions.includes(id));

        if (allSelected) {
            setFormData(prev => ({
                ...prev,
                permissions: prev.permissions.filter(id => !resourcePerms.includes(id))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                permissions: [...new Set([...prev.permissions, ...resourcePerms])]
            }));
        }
    };

    const filteredGroups = groups.filter((g: PermissionGroup) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Dialog open={isCreateModalOpen || !!editingGroup} onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateModalOpen(false);
                        setEditingGroup(null);
                        setFormData({ name: '', description: '', permissions: [] });
                    }
                }}>
                    <DialogTrigger asChild>
                        {hasPermission(PERMISSION_KEYS.PERMISSION.CREATE) && (
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> New Group
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="max-w-[50vw] max-h-[95vh] h-[90vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="p-6 pb-4 border-b">
                            <DialogTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Group Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Data Entry Clerk"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Input
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the purpose of this group"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-md p-4">
                                    <h3 className="font-semibold mb-4 flex items-center">
                                        <Shield className="h-4 w-4 mr-2" /> Assign Permissions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(permissionsByResource).map(([resource, perms]: [string, any]) => (
                                            <div key={resource} className="border rounded p-3 space-y-3 bg-muted/50">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium capitalize">{resource}</span>
                                                    <Checkbox
                                                        checked={perms.every((p: Permission) => formData.permissions.includes(p._id))}
                                                        onCheckedChange={() => toggleResource(resource)}
                                                    />
                                                </div>
                                                <div className="space-y-2 ml-1">
                                                    {perms.map((perm: Permission) => (
                                                        <div key={perm._id} className="flex flex-col space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={perm._id}
                                                                    checked={formData.permissions.includes(perm._id)}
                                                                    onCheckedChange={() => togglePermission(perm._id)}
                                                                />
                                                                <label htmlFor={perm._id} className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium">
                                                                    {perm.action}
                                                                </label>
                                                            </div>
                                                            {(perm.scope || perm.operator) && (
                                                                <div className="flex flex-wrap gap-1 ml-6">
                                                                    {perm.scope && (
                                                                        <Badge variant="outline" className="text-[10px] h-3 py-0 px-1 border-blue-200 text-blue-600">
                                                                            {perm.scope}
                                                                        </Badge>
                                                                    )}
                                                                    {perm.operator && (
                                                                        <Badge variant="outline" className="text-[10px] h-3 py-0 px-1 border-orange-200 text-orange-600">
                                                                            {perm.operator}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t mt-auto flex justify-end space-x-2 bg-background">
                            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setEditingGroup(null); }}>Cancel</Button>
                            <Button onClick={editingGroup ? handleUpdate : handleCreate} disabled={isCreating || isUpdating}>
                                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingGroup ? 'Update Group' : 'Create Group'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isGroupsLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading groups...</TableCell>
                            </TableRow>
                        ) : filteredGroups.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No groups found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredGroups.map((group: PermissionGroup) => (
                                <TableRow key={group._id}>
                                    <TableCell className="font-medium">{group.name}</TableCell>
                                    <TableCell>{group.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{group.permissions.length} permissions</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={group.isActive ? "bg-green-500" : "bg-red-500"}>
                                            {group.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {hasPermission(PERMISSION_KEYS.PERMISSION.UPDATE) && (
                                            <Button variant="ghost" size="sm" onClick={() => openEditModal(group)}>
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                        )}
                                        {hasPermission(PERMISSION_KEYS.PERMISSION.DELETE) && (
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(group._id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

