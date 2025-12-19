"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function AddUserPage() {
  const router = useRouter()
  const params = useParams()
  const businessUnit = params["business-unit"] as string

  // Query Hooks
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({})
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

  const roles = Array.isArray(rolesData) ? rolesData : []

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    businessUnit: businessUnit || ""
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.role) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      const payload = {
        name: {
          firstName: formData.firstName,
          lastName: formData.lastName
        },
        email: formData.email,
        phone: formData.phone,
        password: formData.password || "defaultPassword123", // TODO: Generate or require
        roles: [formData.role], // Backend expects array of role IDs
        businessUnits: formData.businessUnit ? [formData.businessUnit] : [],
        status: "active"
      }

      console.log("Submitting user:", payload)

      await createUser(payload).unwrap()

      toast.success("User created successfully!")
      router.push(`/${params.role}/${businessUnit}/user-management/all-users`)

    } catch (error: any) {
      console.error("User creation error:", error)
      toast.error(error?.data?.message || error?.message || "Failed to create user")
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        <p className="text-muted-foreground">
          Create a new user account and assign roles
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
                placeholder="Leave empty for default password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If empty, default password will be set
              </p>
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