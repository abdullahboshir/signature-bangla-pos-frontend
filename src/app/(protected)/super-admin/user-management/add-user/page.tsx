"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useGetRolesQuery } from "@/redux/api/roleApi"
import { useCreateUserMutation } from "@/redux/api/userApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi"
import { useGetOutletsQuery } from "@/redux/api/outletApi"

export default function SuperAdminAddUserPage() {
    const router = useRouter()

    // Query Hooks
    const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({})
    const { data: businessUnitsData, isLoading: isLoadingBUs } = useGetBusinessUnitsQuery(undefined)

    const roles = Array.isArray(rolesData) ? rolesData : []
    // Handle BU data safely
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
        (businessUnitsData?.data || businessUnitsData || []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        businessUnit: "", // Selected by Super Admin
        outlet: ""        // Dependent on BU
    })

    // Dependent Query: Get Outlets for selected BU
    const { data: outletsData, isLoading: isLoadingOutlets } = useGetOutletsQuery(
        formData.businessUnit ? { businessUnit: formData.businessUnit } : { businessUnit: 'none' },
        { skip: !formData.businessUnit }
    );

    const outlets = Array.isArray(outletsData) ? outletsData : (outletsData?.data || []);

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

    const handleChange = (field: string, value: string) => {
        setFormData(prev => {
            // If BU changes, clear outlet
            if (field === 'businessUnit') {
                return { ...prev, [field]: value, outlet: "" };
            }
            return { ...prev, [field]: value };
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!formData.firstName || !formData.email || !formData.role) {
            toast.error("Please fill all required fields")
            return
        }

        if (!formData.businessUnit) {
            toast.error("Please select a Business Unit")
            return;
        }

        try {
            // Logic for Scope
            // Refactored to explicit businessUnit and outlet fields


            const payload = {
                name: {
                    firstName: formData.firstName,
                    lastName: formData.lastName
                },
                email: formData.email,
                phone: formData.phone,
                password: formData.password || "defaultPassword123",
                // New Permissions Structure
                permissions: [{
                    role: formData.role,
                    businessUnit: formData.businessUnit,
                    outlet: formData.outlet || null
                }],
                status: "active"
            }

            console.log("Submitting user:", payload)

            await createUser(payload).unwrap()

            toast.success("User created successfully!")
            router.back()

        } catch (error: any) {
            console.error("User creation error:", error)
            toast.error(error?.data?.message || error?.message || "Failed to create user")
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New User (Global)</h1>
                <p className="text-muted-foreground">
                    Create a new user account and assign roles with specific scope.
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
                        {/* Scope Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessUnit">Business Unit *</Label>
                                <Select
                                    value={formData.businessUnit}
                                    onValueChange={(val) => handleChange("businessUnit", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Business Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingBUs ? (
                                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                                        ) : (
                                            businessUnits.map((bu: any) => (
                                                <SelectItem key={bu._id || bu.id} value={bu._id || bu.id}>
                                                    {bu.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="outlet">Outlet (Optional)</Label>
                                <Select
                                    value={formData.outlet}
                                    onValueChange={(val) => handleChange("outlet", val)}
                                    disabled={!formData.businessUnit || isLoadingOutlets}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Outlet (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Option to clear outlet */}
                                        {formData.businessUnit && <SelectItem value="remove-selection">- No Outlet (Business Unit Level) -</SelectItem>}

                                        {isLoadingOutlets ? (
                                            <div className="p-2 text-sm text-gray-500">Loading Outlets...</div>
                                        ) : outlets.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No outlets found for BU</div>
                                        ) : (
                                            outlets.map((outlet: any) => (
                                                <SelectItem key={outlet._id} value={outlet._id}>
                                                    {outlet.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Select if user is specific to one branch.</p>
                            </div>
                        </div>

                        <Separator className="my-2" />

                        {/* Standard Fields */}
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

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <Label htmlFor="role">Assign Role *</Label>
                            <Select value={formData.role} onValueChange={(val) => handleChange("role", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingRoles ? (
                                        <div className="p-2 text-sm text-gray-500">Loading roles...</div>
                                    ) : roles.length === 0 ? (
                                        <div className="p-2 text-sm text-gray-500">No roles found</div>
                                    ) : (
                                        roles.map((role: any) => (
                                            <SelectItem key={role._id} value={role._id}>
                                                {role.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
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
