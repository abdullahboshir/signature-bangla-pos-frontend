"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, MinusIcon } from "lucide-react"
import { useGetRolesQuery, useGetPermissionsQuery, useGetPermissionGroupsQuery, useGetPermissionResourcesQuery } from "@/redux/api/iam/roleApi"
import { isSuperAdmin } from "@/config/auth-constants"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"
import { useGetSystemSettingsQuery } from "@/redux/api/system/settingsApi";
import { OutletMultiSelect } from "@/components/modules/user-management/OutletMultiSelect"
import { User } from "@/types/user";
import { RESOURCE_KEYS, PLATFORM_RESOURCES, MODULE_RESOURCE_MAP } from "@/config/permission-keys";
import { PermissionSelectorShared } from "@/components/modules/user-management/PermissionSelectorShared"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface UserFormProps {
    initialData?: any;
    mode: "create" | "edit";
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
    apiError?: any;
    targetScope?: 'GLOBAL' | 'BUSINESS';
    initialBusinessUnitSlug?: string;
}

export function UserForm({ initialData, mode, onSubmit, isSubmitting, onCancel, apiError, targetScope, initialBusinessUnitSlug }: UserFormProps) {
    const { data: rolesData } = useGetRolesQuery({}, { refetchOnMountOrArgChange: true })
    const { data: businessUnitsData } = useGetBusinessUnitsQuery(undefined)
    const { data: permissionGroupsData } = useGetPermissionGroupsQuery({ limit: 1000 })
    const { data: permissionsDataForLookup } = useGetPermissionsQuery({ limit: 5000 }, { refetchOnMountOrArgChange: true })
    const { data: allResources } = useGetPermissionResourcesQuery(undefined);
    const { data: systemSettings } = useGetSystemSettingsQuery(undefined);

    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" })
    const [roleAssignments, setRoleAssignments] = useState<{ role: string; businessUnit: string; outlets: string[]; tempId: string; }[]>([]);
    const [directPermissions, setDirectPermissions] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({})

    const roles = Array.isArray(rolesData) ? rolesData : (rolesData as any)?.data?.result || (rolesData as any)?.data || (rolesData as any)?.result || [];
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData : ((businessUnitsData as any)?.data?.result || (businessUnitsData as any)?.data || []);
    const permissionGroups = Array.isArray(permissionGroupsData) ? permissionGroupsData : (permissionGroupsData as any)?.data?.result || (permissionGroupsData as any)?.data || permissionGroupsData?.result || [];

    // [REFINED] Context-aware module filtering for permissions
    const filteredResources = useMemo(() => {
        if (!allResources) return [];
        let resources = allResources;

        // Determine which modules are active for the CURRENT SELECTION
        // For simplicity in the multi-assignment UI, we look at the first assignment's BU 
        // OR the system-wide settings as a fallback.
        const firstBUId = roleAssignments[0]?.businessUnit;
        const selectedBU = businessUnits.find((bu: any) => bu._id === firstBUId || bu.id === firstBUId);

        // Priority: Selected BU Modules > System Modules
        const activeModules = selectedBU?.activeModules || systemSettings?.enabledModules;

        if (activeModules) {
            const blockedResources = new Set<string>();
            Object.entries(activeModules).forEach(([moduleKey, isEnabled]) => {
                if (isEnabled === false) {
                    const resourcesToBlock = MODULE_RESOURCE_MAP[moduleKey] || MODULE_RESOURCE_MAP[moduleKey.toLowerCase()];
                    if (resourcesToBlock) resourcesToBlock.forEach(r => blockedResources.add(r));
                }
            });
            resources = resources.filter((r: string) => !blockedResources.has(r));
        }

        if (targetScope === 'GLOBAL') return resources;
        return resources.filter((r: string) => !PLATFORM_RESOURCES.includes(r as any) && !PLATFORM_RESOURCES.includes(r.toLowerCase() as any));
    }, [allResources, targetScope, systemSettings, roleAssignments, businessUnits]);

    const lockedBusinessUnitId = useMemo(() => {
        if (!initialBusinessUnitSlug || !businessUnits || businessUnits.length === 0) return undefined;
        const matched = businessUnits.find((b: any) => (b.slug && b.slug.toLowerCase() === initialBusinessUnitSlug.toLowerCase()) || b.id === initialBusinessUnitSlug || b._id === initialBusinessUnitSlug);
        return matched?._id || matched?.id;
    }, [initialBusinessUnitSlug, businessUnits]);

    useEffect(() => {
        if (mode === 'create' && roleAssignments.length === 0 && lockedBusinessUnitId) {
            setRoleAssignments([{ role: "", businessUnit: lockedBusinessUnitId, outlets: [], tempId: Math.random().toString(36).substr(2, 9) }]);
        }
    }, [mode, lockedBusinessUnitId, roleAssignments.length]);

    useEffect(() => {
        if (apiError && apiError.data && apiError.data.errorSources) {
            const newErrors: Record<string, string> = {};
            apiError.data.errorSources.forEach((err: any) => {
                const field = err.path === "name.firstName" ? "firstName" : err.path === "name.lastName" ? "lastName" : err.path;
                newErrors[field] = err.message;
            });
            setErrors(newErrors);
        }
    }, [apiError]);

    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({ firstName: initialData.name?.firstName || "", lastName: initialData.name?.lastName || "", email: initialData.email || "", phone: initialData.phone || "", password: "", });
            const groupedAssignments = new Map<string, { role: string, businessUnit: string, outlets: string[], tempId: string }>();
            if (initialData.businessAccess && Array.isArray(initialData.businessAccess)) {
                initialData.businessAccess.forEach((access: any) => {
                    const rId = access.role?._id || access.role;
                    const buId = access.businessUnit?._id || access.businessUnit;
                    const outletId = access.outlet?._id || access.outlet;
                    if (!rId) return;
                    const key = buId ? `${rId}-${buId}` : `${rId}-global`;
                    const safeBuId = buId || "";
                    if (!groupedAssignments.has(key)) groupedAssignments.set(key, { role: rId, businessUnit: safeBuId, outlets: [], tempId: Math.random().toString(36).substr(2, 9) });
                    const group = groupedAssignments.get(key)!;
                    if (outletId) group.outlets.push(outletId);
                });
            }
            if (initialData.globalRoles && Array.isArray(initialData.globalRoles)) {
                initialData.globalRoles.forEach((role: any) => {
                    const rId = role._id || role;
                    const key = `${rId}-global`;
                    groupedAssignments.set(key, { role: rId, businessUnit: "", outlets: [], tempId: Math.random().toString(36).substr(2, 9) });
                });
            }
            setRoleAssignments(Array.from(groupedAssignments.values()));
            if (initialData.directPermissions) {
                const allowList = initialData.directPermissions.allow || [];
                const directIds = Array.isArray(allowList) ? allowList.map((p: any) => typeof p === 'object' ? p._id : p) : [];
                if (Array.isArray(initialData.directPermissions)) directIds.push(...initialData.directPermissions.map((p: any) => typeof p === 'object' ? p._id : p));
                setDirectPermissions([...new Set(directIds)]);
            }
        }
    }, [initialData, mode]);

    useEffect(() => {
        const autoSelectedGroupIds = new Set<string>();
        roleAssignments.forEach(assignment => {
            if (assignment.role) {
                const role = roles.find((r: any) => r._id === assignment.role);
                if (role?.permissionGroups) role.permissionGroups.forEach((pgId: string) => autoSelectedGroupIds.add(pgId));
            }
        });
        if (autoSelectedGroupIds.size > 0) {
            setDirectPermissions(prev => {
                const newSelected = [...prev];
                autoSelectedGroupIds.forEach(pgId => { if (!newSelected.includes(pgId)) newSelected.push(pgId); });
                return newSelected;
            });
        }
    }, [roleAssignments, roles]);

    const rolePermissionGroupIds = useMemo(() => {
        const groupIds = new Set<string>();
        roleAssignments.forEach(assignment => {
            if (assignment.role) {
                const role = roles.find((r: any) => r._id === assignment.role);
                if (role?.permissionGroups) role.permissionGroups.forEach((pgId: string) => groupIds.add(pgId));
            }
        });
        return Array.from(groupIds);
    }, [roleAssignments, roles]);

    const { rolePermissionIds, rolePermissionCounts } = useMemo(() => {
        const permIds = new Set<string>();
        const counts: Record<string, number> = {};
        const allPermissions = Array.isArray(permissionsDataForLookup) ? permissionsDataForLookup : (permissionsDataForLookup as any)?.result || (permissionsDataForLookup as any)?.data || [];
        const addCount = (resource: string) => { if (!resource) return; const key = resource.toLowerCase(); counts[key] = (counts[key] || 0) + 1; };
        roleAssignments.forEach(assignment => {
            if (assignment.role) {
                const role = roles.find((r: any) => r._id === assignment.role);
                if (!role) return;
                if (role.permissions) {
                    role.permissions.forEach((p: any) => {
                        let permId = null; let resource = null;
                        if (typeof p === 'object' && p !== null) { permId = p._id || p.id; resource = p.resource; } else permId = p;
                        if (permId && !resource) { const perm = allPermissions.find((ap: any) => ap._id === permId); resource = perm?.resource; }
                        if (permId) { permIds.add(permId); if (resource) addCount(resource); }
                    });
                }
                if (role.permissionGroups) {
                    role.permissionGroups.forEach((pg: any) => {
                        const pgId = (typeof pg === 'object' && pg !== null) ? (pg._id || pg.id) : pg;
                        const group = permissionGroups.find((g: any) => (g._id || g.id) === pgId);
                        if (group?.permissions) {
                            group.permissions.forEach((perm: any) => {
                                let permId, resource;
                                if (typeof perm === 'string') { permId = perm; const found = allPermissions.find((p: any) => p._id === perm); resource = found?.resource; }
                                else { permId = perm._id || perm.id; resource = perm.resource; }
                                if (permId) { permIds.add(permId); if (resource) addCount(resource); }
                            });
                        }
                    });
                }
            }
        });
        return { rolePermissionIds: Array.from(permIds), rolePermissionCounts: counts };
    }, [roleAssignments, roles, permissionGroups, permissionsDataForLookup]);

    useEffect(() => {
        if (rolePermissionIds.length > 0) setDirectPermissions(prev => Array.from(new Set([...prev, ...rolePermissionIds])));
    }, [rolePermissionIds]);

    const addRoleAssignment = () => setRoleAssignments(prev => [...prev, { role: "", businessUnit: "", outlets: [], tempId: Math.random().toString(36).substr(2, 9) }]);
    const removeRoleAssignment = (tempId: string) => setRoleAssignments(prev => prev.filter(r => r.tempId !== tempId));
    const updateRoleAssignment = (tempId: string, field: string, value: any) => setRoleAssignments(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
    const toggleDirectPermission = useCallback((id: string) => setDirectPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]), []);
    const toggleGroup = useCallback((resource: string, idsInGroup: string[], allSelected: boolean) => {
        if (allSelected) setDirectPermissions(prev => prev.filter(id => !idsInGroup.includes(id)));
        else setDirectPermissions(prev => [...new Set([...prev, ...idsInGroup])]);
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email) { toast.error("Please fill all required fields"); return; }
        if (roleAssignments.length === 0) { toast.error("Please assign at least one role"); return; }
        const permissionsPayload: any[] = [];
        roleAssignments.forEach(r => {
            if (r.businessUnit) {
                if (r.outlets.length > 0) r.outlets.forEach(outletId => permissionsPayload.push({ role: r.role, businessUnit: r.businessUnit, outlet: outletId, scope: 'OUTLET', isPrimary: false }));
                else permissionsPayload.push({ role: r.role, businessUnit: r.businessUnit, outlet: null, scope: 'BUSINESS', isPrimary: false, status: 'ACTIVE' });
            } else permissionsPayload.push({ role: r.role, businessUnit: null, outlet: null, scope: 'GLOBAL', isPrimary: false, status: 'ACTIVE' });
        });
        if (permissionsPayload.length > 0) permissionsPayload[0].isPrimary = true;
        const payload: any = {
            name: { firstName: formData.firstName, lastName: formData.lastName },
            email: formData.email,
            phone: formData.phone,
            permissions: permissionsPayload,
            businessAccess: permissionsPayload,
            directPermissions: directPermissions.map(permId => ({ permissionId: permId, type: 'allow', assignedScope: targetScope === 'BUSINESS' ? 'BUSINESS' : 'GLOBAL', })),
            roles: permissionsPayload.map(p => p.role),
            businessUnits: permissionsPayload.map(p => p.businessUnit).filter(Boolean),
            businessUnit: permissionsPayload.find(p => p.businessUnit)?.businessUnit || null,
        };
        if (formData.password) payload.password = formData.password;
        else if (mode === 'create') payload.password = "@Abcd1234@";
        await onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>User Details</CardTitle><CardDescription>Personal information.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required className={errors.firstName ? "border-red-500" : ""} /></div>
                            <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} disabled={mode === 'edit'} className={mode === 'edit' ? "bg-muted" : ""} required /></div>
                            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="password">{mode === 'create' ? "Password (Optional)" : "New Password (Optional)"}</Label><Input id="password" type="password" placeholder={mode === 'create' ? "Default: @Abcd1234@" : "Leave empty to keep current"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} /></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3"><div className="flex items-center justify-between"><div><CardTitle>Role Assignments</CardTitle><CardDescription>Assign Scoped Roles.</CardDescription></div><Button type="button" size="sm" onClick={addRoleAssignment} variant="outline"><Plus className="h-4 w-4" /></Button></div></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {roleAssignments.length === 0 ? <div className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-md">No roles assigned.</div> : (
                                    <div className="space-y-3">
                                        {roleAssignments.map((assignment) => (
                                            <div key={assignment.tempId} className="border rounded-md p-3 relative bg-card">
                                                <div className="absolute top-2 right-2"><Button variant="ghost" size="icon" onClick={() => removeRoleAssignment(assignment.tempId)} className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"><MinusIcon className="h-3 w-3" /></Button></div>
                                                <div className="space-y-3 text-sm ">
                                                    <div className="space-y-1"><Label className="text-xs text-muted-foreground">Business Unit</Label>{targetScope === 'GLOBAL' ? <div className="flex h-9 w-full items-center px-3 py-2 text-sm border rounded-md bg-muted text-muted-foreground">Global (Platform User)</div> : (
                                                        <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={assignment.businessUnit} onChange={(e) => { updateRoleAssignment(assignment.tempId, "businessUnit", e.target.value); updateRoleAssignment(assignment.tempId, "outlets", []); updateRoleAssignment(assignment.tempId, "role", ""); }} disabled={!!lockedBusinessUnitId}><option value="">Global (No Business Unit)</option>{businessUnits.map((bu: any) => <option key={bu._id} value={bu._id}>{bu.name}</option>)}</select>
                                                    )}</div>
                                                    {assignment.businessUnit && <div className="space-y-1"><Label className="text-xs text-muted-foreground">Outlets (Optional)</Label><OutletMultiSelect businessUnitId={assignment.businessUnit} selectedOutlets={assignment.outlets} onChange={(newOutlets) => { updateRoleAssignment(assignment.tempId, "outlets", newOutlets); updateRoleAssignment(assignment.tempId, "role", ""); }} /></div>}
                                                    <div className="space-y-1"><Label className="text-xs text-muted-foreground">Role</Label><Select value={assignment.role} onValueChange={(val) => updateRoleAssignment(assignment.tempId, "role", val)}><SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger><SelectContent className="max-h-116">
                                                        {roles.filter((r: any) => {
                                                            if (isSuperAdmin(r.id)) return false;
                                                            const hasOutlets = assignment.outlets && assignment.outlets.length > 0;
                                                            if (hasOutlets) return r.roleScope === 'OUTLET';
                                                            if (targetScope === 'GLOBAL') return r.roleScope === 'GLOBAL';
                                                            return r.roleScope === 'BUSINESS' || r.roleScope === 'GLOBAL';
                                                        }).map((role: any) => {
                                                            let scopeBadge = null;
                                                            if (role.roleScope === 'GLOBAL') scopeBadge = <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-600 rounded">Global</span>;
                                                            else if (role.roleScope === 'BUSINESS') scopeBadge = <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-600 rounded">Business</span>;
                                                            else if (role.roleScope === 'OUTLET') scopeBadge = <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-600 rounded">Outlet</span>;
                                                            return <SelectItem key={role._id} value={role._id}><div className="flex items-center justify-between w-full"><span>{role.name}</span>{scopeBadge}</div></SelectItem>;
                                                        })}
                                                    </SelectContent></Select></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Direct Permissions</CardTitle><CardDescription>Select individual permissions for this user</CardDescription></CardHeader>
                        <CardContent className="p-0">
                            <PermissionSelectorShared selectedPermissionIds={directPermissions} onTogglePermission={toggleDirectPermission} showSelectAll={true} rolePermissionIds={rolePermissionIds} rolePermissionCounts={rolePermissionCounts} gridCols={2} allowedResources={filteredResources} />
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === 'create' ? "Create User" : "Save Changes"}</Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
