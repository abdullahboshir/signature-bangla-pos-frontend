"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useGetRolesQuery } from "@/redux/api/iam/roleApi"
import { useCreateUserMutation } from "@/redux/api/iam/userApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"

import { useGetPermissionsQuery } from "@/redux/api/iam/roleApi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { RoleAssignmentRow } from "@/components/modules/user-management/RoleAssignmentRow"

export default function AddUserPage() {
  const router = useRouter()
  const params = useParams()
  const paramBusinessUnit = params["business-unit"] as string

  // Query Hooks
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({})
  const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined)

  const roles = Array.isArray(rolesData) ? rolesData : []
  // Handle BU data safely
  const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
    ((businessUnitsData as any)?.data || businessUnitsData || []);

  // Compute Locked BU ID (moved after businessUnits is defined)
  const lockedBusinessUnitId = useMemo(() => {
    if (!paramBusinessUnit || !businessUnits || businessUnits.length === 0) return undefined;
    const matched = businessUnits.find((b: any) =>
      (b.slug && b.slug.toLowerCase() === paramBusinessUnit.toLowerCase()) ||
      b.id === paramBusinessUnit ||
      b._id === paramBusinessUnit
    );
    return matched?._id || matched?.id;
  }, [paramBusinessUnit, businessUnits]);


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
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
  const allPermissions = Array.isArray(permissionsData) ? permissionsData : (permissionsData?.data || []);

  const filteredPermissions = allPermissions.filter((p: any) =>
    p.id.toLowerCase().includes(permSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(permSearch.toLowerCase())
  );

  // Dependent Query: Get Outlets for selected BU - Removed top-level dependency

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

  // Initialize Business Unit logic - If needed to auto-add a row for the current BU
  useEffect(() => {
    if (paramBusinessUnit && businessUnits.length > 0 && roleAssignments.length === 0) {
      // Auto-add a row for this BU context
      const matched = businessUnits.find((b: any) =>
        (b.slug && b.slug.toLowerCase() === paramBusinessUnit.toLowerCase()) ||
        b.id === paramBusinessUnit ||
        b._id === paramBusinessUnit
      );

      if (matched) {
        setRoleAssignments([{
          role: "",
          businessUnit: matched._id || matched.id,
          outlet: null,
          tempId: Math.random().toString(36).substr(2, 9)
        }]);
      }
    }
  }, [paramBusinessUnit, businessUnits, roleAssignments.length])


  // Handlers for Role Assignments
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

    // Basic validation
    if (!formData.firstName || !formData.email) {
      toast.error("Please fill all required fields")
      return
    }

    if (roleAssignments.length === 0) {
      toast.error("Please assign at least one role");
      return;
    }

    // Validate that all assignments have a role and business unit
    const invalidAssignment = roleAssignments.find(r => !r.role || !r.businessUnit);
    if (invalidAssignment) {
      toast.error("All role assignments must have a Role and a Business Unit selected.");
      return;
    }

    try {
      // Construct Payload aligned with create-user.controller.ts
      // Transform local roleAssignments to backend structure
      const permissionsPayload = roleAssignments.map(r => ({
        role: r.role,
        businessUnit: r.businessUnit || null, // Global if empty
        outlet: r.outlet || null
      }));

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,

        // New Structure
        permissions: permissionsPayload,
        directPermissions: directPermissions,

        // Legacy/Root fields for backward compatibility (optional but good for safety)
        // We pick the first assignment as primary if needed, or leave blank
        role: permissionsPayload.length > 0 ? permissionsPayload[0].role : null,
        businessUnit: permissionsPayload.length > 0 ? permissionsPayload[0].businessUnit : null,

        status: "active"
      };

      console.log("Submitting user:", payload);

      const res: any = await createUser(payload).unwrap();

      toast.success("User created successfully!")
      router.back()

    } catch (error: any) {
      console.error("User creation error:", error)
      toast.error(error?.data?.message || error?.message || "Failed to create user")
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Staff</h1>
        <p className="text-muted-foreground">
          Create a new user account and assign roles/permissions.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              Enter the personal and contact information for the new user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scope Selection - REPLACED BY ROLE ASSIGNMENTS TABLE */}
            {/* The previous Business Unit and Outlet selectors are now handled per-row in Role Assignments */}

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+880 1XXX XXXXXX"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Leave empty for default"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
              </div>
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
                          No roles assigned. Click "Add Assignment" to grant access.
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
                          lockedBusinessUnitId={lockedBusinessUnitId}
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
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? "Creating..." : "Create User"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}