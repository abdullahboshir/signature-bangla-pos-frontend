"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Plus, ArrowLeft } from "lucide-react"
import { useGetRolesQuery } from "@/redux/api/iam/roleApi"
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/api/iam/userApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"
import { useGetPermissionsQuery } from "@/redux/api/iam/roleApi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { RoleAssignmentRow } from "@/components/modules/user-management/RoleAssignmentRow"

export default function EditUserPage() {
    const router = useRouter()
    const params = useParams()
    const businessUnitSlug = params["business-unit"] as string
    const userId = params.id as string

    // Query Hooks
    const { data: userData, isLoading: isLoadingUser } = useGetSingleUserQuery(userId)
    const user = userData?.data || userData;
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({})
    const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined)

    const roles = Array.isArray(rolesData) ? rolesData : []
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
        ((businessUnitsData as any)?.data || businessUnitsData || []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "", // Optional update
    })

    // Role Assignments State
    const [roleAssignments, setRoleAssignments] = useState<{
        role: string;
        businessUnit: string;
        outlet: string | null;
        tempId: string;
    }[]>([]);

    // Direct Permissions State
    const [directPermissions, setDirectPermissions] = useState<string[]>([]);
    const [permSearch, setPermSearch] = useState("");

    const { data: permissionsData, isLoading: isLoadingPerms } = useGetPermissionsQuery({ limit: 1000 });
    const allPermissions = Array.isArray(permissionsData) ? permissionsData : ((permissionsData as any)?.data || []);

    const filteredPermissions = allPermissions.filter((p: any) =>
        p.id.toLowerCase().includes(permSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(permSearch.toLowerCase())
    );

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    // Initialize Data from User
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.name?.firstName || "",
                lastName: user.name?.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "", // Don't populate password
            });

            // Populate Role Assignments
            if (user.permissions && user.permissions.length > 0) {
                const assignments = user.permissions.map((p: any) => ({
                    role: typeof p.role === 'object' ? p.role._id : p.role,
                    businessUnit: typeof p.businessUnit === 'object' ? p.businessUnit._id : p.businessUnit,
                    outlet: p.outlet ? (typeof p.outlet === 'object' ? p.outlet._id : p.outlet) : null,
                    tempId: Math.random().toString(36).substr(2, 9)
                }));
                setRoleAssignments(assignments);
            } else if (user.roles && user.roles.length > 0) {
                // Fallback for legacy data: Convert simple roles to assignments
                // Try to infer scope from businessUnits or default to Global/Current BU
                const legacyBUs = user.businessUnits || [];
                const scopes = legacyBUs.length > 0 ? legacyBUs : (businessUnitSlug ? [businessUnitSlug] : []); // Use slug if no BUs? careful.

                // If we can't map reliably, just show global or let user fix it.
                // Better to just show global (empty BU) if legacy roles had no specific BU binding in the new model sense
                const assignments = user.roles.map((r: any) => ({
                    role: typeof r === 'object' ? r._id : r,
                    businessUnit: "", // Global by default for legacy roles unless we know otherwise
                    outlet: null,
                    tempId: Math.random().toString(36).substr(2, 9)
                }));
                setRoleAssignments(assignments);
            }

            // Populate Direct Permissions
            if (user.directPermissions && user.directPermissions.length > 0) {
                const directIds = user.directPermissions.map((p: any) => typeof p === 'object' ? p._id : p);
                setDirectPermissions(directIds);
            }
        }
    }, [user, businessUnitSlug]);


    // Handlers
    const addRoleAssignment = () => {
        setRoleAssignments(prev => [
            ...prev,
            { role: "", businessUnit: "", outlet: null, tempId: Math.random().toString(36).substr(2, 9) }
        ]);
    };

    const removeRoleAssignment = (tempId: string) => {
        setRoleAssignments(prev => prev.filter(r => r.tempId !== tempId));
    };

    const updateRoleAssignment = (tempId: string, field: string, value: any) => {
        setRoleAssignments(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
    };

    const toggleDirectPermission = (id: string) => {
        setDirectPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

        const invalidAssignment = roleAssignments.find(r => !r.role || !r.businessUnit);
        if (invalidAssignment) {
            toast.error("All role assignments must have a Role and a Business Unit selected.");
            return;
        }

        try {
            const permissionsPayload = roleAssignments.map(r => ({
                role: r.role,
                businessUnit: r.businessUnit || null,
                outlet: r.outlet || null
            }));

            const payload: any = {
                name: { firstName: formData.firstName, lastName: formData.lastName },
                // email: formData.email, // Check if email update is allowed? Usually yes.
                phone: formData.phone,

                permissions: permissionsPayload,
                directPermissions: directPermissions,

                // Legacy/Root syncing
                roles: permissionsPayload.map(p => p.role),
                businessUnits: permissionsPayload.map(p => p.businessUnit).filter(Boolean),
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            console.log("Updating user:", payload);

            await updateUser({ id: userId, data: payload }).unwrap();

            toast.success("User updated successfully!")
            router.back()

        } catch (error: any) {
            console.error("User update error", error)
            toast.error(error?.data?.message || error?.message || "Failed to update user")
        }
    }

    if (isLoadingUser) {
        return <div className="p-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">
                        Manage user details, roles, and permissions.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                        <CardDescription>
                            Update personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    required
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled // Usually email is immutable or requires special flow
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
                            <Label htmlFor="password">New Password (Optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave empty to keep current"
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />
                        </div>

                        {/* ==================== ROLE ASSIGNMENTS (Scoped) ==================== */}
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium">Role Assignments</h3>
                                    <p className="text-sm text-muted-foreground">Assign roles to specific Business Units or globally.</p>
                                </div>
                                <Button type="button" size="sm" onClick={addRoleAssignment}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Assignment
                                </Button>
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Business Unit (Scope)</TableHead>
                                            <TableHead>Outlet (Optional)</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roleAssignments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No active roles.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            roleAssignments.map((assignment) => (
                                                <RoleAssignmentRow
                                                    key={assignment.tempId}
                                                    assignment={assignment}
                                                    roles={roles}
                                                    businessUnits={businessUnits}
                                                    onUpdate={updateRoleAssignment}
                                                    onRemove={removeRoleAssignment}
                                                />
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* ==================== DIRECT PERMISSIONS (Overrides) ==================== */}
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Direct Permission Overrides</h3>
                                <p className="text-sm text-muted-foreground">Grant specific exceptional permissions to this user.</p>
                            </div>

                            <div className="border p-4 rounded-md space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search permissions..."
                                        value={permSearch}
                                        onChange={(e) => setPermSearch(e.target.value)}
                                    />
                                </div>

                                <ScrollArea className="h-[200px] border rounded-md p-2">
                                    {isLoadingPerms ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">Loading permissions...</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {filteredPermissions.map((perm: any) => (
                                                <div key={perm._id} className="flex items-start space-x-2 p-1 hover:bg-muted/50 rounded">
                                                    <Checkbox
                                                        id={`perm-${perm._id}`}
                                                        checked={directPermissions.includes(perm._id)}
                                                        onCheckedChange={() => toggleDirectPermission(perm._id)}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <Label htmlFor={`perm-${perm._id}`} className="text-sm font-normal cursor-pointer">
                                                            {perm.id}
                                                        </Label>
                                                        <span className="text-[10px] text-muted-foreground">{perm.description}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                                <div className="text-xs text-muted-foreground">
                                    Selected: {directPermissions.length} permissions
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isUpdating ? "Updating..." : "Update User"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
