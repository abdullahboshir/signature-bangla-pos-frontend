"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, MinusIcon } from "lucide-react"
import { useGetRolesQuery } from "@/redux/api/iam/roleApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"
import { OutletMultiSelect } from "@/components/modules/user-management/OutletMultiSelect"
import { DirectPermissionSelector } from "@/components/modules/user-management/DirectPermissionSelector"
import { toast } from "sonner"

export interface UserFormProps {
    initialData?: any;
    mode: "create" | "edit";
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
    apiError?: any;
    targetScope?: 'GLOBAL' | 'BUSINESS'; // New Prop for context awareness
}

export function UserForm({ initialData, mode, onSubmit, isSubmitting, onCancel, apiError, targetScope }: UserFormProps) {
    // Query Hooks
    const { data: rolesData } = useGetRolesQuery({})
    const { data: businessUnitsData } = useGetBusinessUnitsQuery(undefined)

    const roles = Array.isArray(rolesData)
        ? rolesData
        : (rolesData as any)?.data?.result || (rolesData as any)?.data || (rolesData as any)?.result || [];

    const businessUnits = Array.isArray(businessUnitsData)
        ? businessUnitsData
        : ((businessUnitsData as any)?.data?.result || (businessUnitsData as any)?.data || []);

    // State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    })
    const [roleAssignments, setRoleAssignments] = useState<{
        role: string;
        businessUnit: string;
        outlets: string[];
        tempId: string;
    }[]>([]);
    const [directPermissions, setDirectPermissions] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Error Handling Effect
    useEffect(() => {
        if (apiError && apiError.data && apiError.data.errorSources) {
            const newErrors: Record<string, string> = {};
            apiError.data.errorSources.forEach((err: any) => {
                // Map backend paths to form fields if needed (e.g., "name.firstName" -> "firstName")
                const field = err.path === "name.firstName" ? "firstName" :
                    err.path === "name.lastName" ? "lastName" :
                        err.path;
                newErrors[field] = err.message;
            });
            setErrors(newErrors);
        }
    }, [apiError]);

    // Initialize Data
    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({
                firstName: initialData.name?.firstName || "",
                lastName: initialData.name?.lastName || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                password: "", // Don't populate password
            });

            // Populate Assignments (Grouping Logic)
            const groupedAssignments = new Map<string, { role: string, businessUnit: string, outlets: string[], tempId: string }>();

            if (initialData.businessAccess && Array.isArray(initialData.businessAccess)) {
                initialData.businessAccess.forEach((access: any) => {
                    const rId = access.role?._id || access.role;
                    const buId = access.businessUnit?._id || access.businessUnit;
                    const outletId = access.outlet?._id || access.outlet;

                    if (!rId) return;

                    // Helper to key by role+bu (or role+global)
                    const key = buId ? `${rId}-${buId}` : `${rId}-global`;
                    const safeBuId = buId || "";

                    if (!groupedAssignments.has(key)) {
                        groupedAssignments.set(key, {
                            role: rId,
                            businessUnit: safeBuId,
                            outlets: [],
                            tempId: Math.random().toString(36).substr(2, 9)
                        });
                    }

                    const group = groupedAssignments.get(key)!;
                    if (outletId) {
                        group.outlets.push(outletId);
                    }
                });
            }

            // Map Global Roles (if any, treat as empty BU)
            if (initialData.globalRoles && Array.isArray(initialData.globalRoles)) {
                initialData.globalRoles.forEach((role: any) => {
                    const rId = role._id || role;
                    const key = `${rId}-global`;
                    groupedAssignments.set(key, {
                        role: rId,
                        businessUnit: "",
                        outlets: [],
                        tempId: Math.random().toString(36).substr(2, 9)
                    });
                });
            }

            setRoleAssignments(Array.from(groupedAssignments.values()));

            if (initialData.directPermissions) {
                // Handle complex object structure { allow: [], deny: [] }
                const allowList = initialData.directPermissions.allow || [];
                const directIds = Array.isArray(allowList)
                    ? allowList.map((p: any) => typeof p === 'object' ? p._id : p)
                    : [];

                // Fallback if it's already a flat array (legacy/virtual)
                if (Array.isArray(initialData.directPermissions)) {
                    const flatIds = initialData.directPermissions.map((p: any) => typeof p === 'object' ? p._id : p);
                    directIds.push(...flatIds);
                }

                setDirectPermissions([...new Set(directIds)]);
            }
        }
    }, [initialData, mode]);

    // Handlers
    const addRoleAssignment = () => {
        setRoleAssignments(prev => [
            ...prev,
            { role: "", businessUnit: "", outlets: [], tempId: Math.random().toString(36).substr(2, 9) }
        ]);
    };

    const removeRoleAssignment = (tempId: string) => {
        setRoleAssignments(prev => prev.filter(r => r.tempId !== tempId));
    };

    const updateRoleAssignment = (tempId: string, field: string, value: any) => {
        setRoleAssignments(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
    };

    const toggleDirectPermission = useCallback((id: string) => {
        setDirectPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    }, []);

    const toggleGroup = useCallback((resource: string, idsInGroup: string[], allSelected: boolean) => {
        if (allSelected) {
            setDirectPermissions(prev => prev.filter(id => !idsInGroup.includes(id)));
        } else {
            setDirectPermissions(prev => [...new Set([...prev, ...idsInGroup])]);
        }
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.firstName || !formData.email) {
            toast.error("Please fill all required fields")
            return
        }

        if (roleAssignments.length === 0) {
            toast.error("Please assign at least one role");
            return;
        }

        // Flatten payload
        const permissionsPayload: any[] = [];
        roleAssignments.forEach(r => {
            if (r.businessUnit) {
                if (r.outlets.length > 0) {
                    r.outlets.forEach(outletId => {
                        permissionsPayload.push({
                            role: r.role,
                            businessUnit: r.businessUnit,
                            outlet: outletId,
                            scope: 'OUTLET',
                            isPrimary: false
                        });
                    });
                } else {
                    permissionsPayload.push({
                        role: r.role,
                        businessUnit: r.businessUnit,
                        outlet: null,
                        scope: 'BUSINESS',
                        isPrimary: false
                    });
                }
            } else {
                permissionsPayload.push({
                    role: r.role,
                    businessUnit: null,
                    outlet: null,
                    scope: 'GLOBAL',
                    isPrimary: false
                });
            }
        });

        // Ensure at least one is primary (required by some logic, though optional in model default is false)
        if (permissionsPayload.length > 0) {
            permissionsPayload[0].isPrimary = true;
        }

        const payload: any = {
            name: { firstName: formData.firstName, lastName: formData.lastName },
            email: formData.email,
            phone: formData.phone,
            permissions: permissionsPayload, // For Create Controller (Legacy)
            businessAccess: permissionsPayload, // For Update Service (New Model)
            directPermissions: {
                allow: directPermissions,
                deny: []
            },
            // Legacy Back-compat
            roles: permissionsPayload.map(p => p.role),
            businessUnits: permissionsPayload.map(p => p.businessUnit).filter(Boolean),
            // Fix for createStaffService which requires a single businessUnit, try to pick first valid one
            businessUnit: permissionsPayload.find(p => p.businessUnit)?.businessUnit || null,
        };

        if (formData.password) {
            payload.password = formData.password;
        } else if (mode === 'create') {
            payload.password = "DefaultPass123!"; // Fallback
        }

        await onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                            <CardDescription>Personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    required
                                    className={errors.firstName ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    disabled={mode === 'edit'}
                                    className={mode === 'edit' ? "bg-muted" : ""}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{mode === 'create' ? "Password (Optional)" : "New Password (Optional)"}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={mode === 'create' ? "Default: DefaultPass123!" : "Leave empty to keep current"}
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Role Assignments</CardTitle>
                                    <CardDescription>Assign Scoped Roles.</CardDescription>
                                </div>
                                <Button type="button" size="sm" onClick={addRoleAssignment} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {roleAssignments.length === 0 ? (
                                    <div className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-md">
                                        No roles assigned.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {roleAssignments.map((assignment) => (
                                            <div key={assignment.tempId} className="border rounded-md p-3 relative bg-card">
                                                <div className="absolute top-2 right-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeRoleAssignment(assignment.tempId)}
                                                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <MinusIcon className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <div className="space-y-3 text-sm">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-muted-foreground">Business Unit</Label>
                                                        {targetScope === 'GLOBAL' ? (
                                                            <div className="flex h-9 w-full items-center px-3 py-2 text-sm border rounded-md bg-muted text-muted-foreground">
                                                                Global (Platform User)
                                                            </div>
                                                        ) : (
                                                            <select
                                                                className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={assignment.businessUnit}
                                                                onChange={(e) => {
                                                                    updateRoleAssignment(assignment.tempId, "businessUnit", e.target.value);
                                                                    updateRoleAssignment(assignment.tempId, "outlets", []);
                                                                }}
                                                            >
                                                                <option value="">Global (No Business Unit)</option>
                                                                {businessUnits.map((bu: any) => (
                                                                    <option key={bu._id} value={bu._id}>{bu.name}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>

                                                    {assignment.businessUnit && (
                                                        <div className="space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Outlets (Optional)</Label>
                                                            <OutletMultiSelect
                                                                businessUnitId={assignment.businessUnit}
                                                                selectedOutlets={assignment.outlets}
                                                                onChange={(newOutlets) => updateRoleAssignment(assignment.tempId, "outlets", newOutlets)}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-muted-foreground">Role</Label>
                                                        <select
                                                            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                            value={assignment.role}
                                                            onChange={(e) => updateRoleAssignment(assignment.tempId, "role", e.target.value)}
                                                        >
                                                            <option value="" disabled>Select Role</option>
                                                            <option value="" disabled>Select Role</option>
                                                            {roles
                                                                .filter((r: any) => {
                                                                    // Default exclusion
                                                                    if (r.id.toLowerCase() === 'super-admin') return false;

                                                                    // Scope Filtering
                                                                    if (targetScope === 'GLOBAL') {
                                                                        return r.roleScope === 'GLOBAL';
                                                                    } else if (targetScope === 'BUSINESS') {
                                                                        return r.roleScope !== 'GLOBAL';
                                                                    }
                                                                    return true; // No filter if prop not passed
                                                                })
                                                                .map((role: any) => (
                                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                                ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions Column */}
                <div className="lg:col-span-2 space-y-6">
                    <DirectPermissionSelector
                        selectedPermissionIds={directPermissions}
                        onTogglePermission={toggleDirectPermission}
                        onToggleGroup={toggleGroup}
                    />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'create' ? "Create User" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}
