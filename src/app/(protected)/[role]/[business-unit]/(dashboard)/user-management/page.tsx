// app/(protected)/[business-unit]/[role]/(dashboard)/user-management/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Plus, Search, Shield, UserCog, Mail, Phone } from "lucide-react"

// Mock users data
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    phone: "+880 1234 567890",
    role: "super-admin",
    status: "active",
    lastLogin: "2024-01-15 10:30 AM",
  },
  {
    id: "2",
    name: "Business Manager",
    email: "manager@example.com",
    phone: "+880 9876 543210",
    role: "business-admin",
    status: "active",
    lastLogin: "2024-01-15 09:15 AM",
  },
  {
    id: "3",
    name: "Store Manager",
    email: "store@example.com",
    phone: "+880 5555 123456",
    role: "store-manager",
    status: "active",
    lastLogin: "2024-01-14 05:20 PM",
  },
  {
    id: "4",
    name: "Cashier 1",
    email: "cashier1@example.com",
    phone: "+880 6666 789012",
    role: "cashier",
    status: "inactive",
    lastLogin: "2024-01-13 02:45 PM",
  },
]

const roleColors = {
  "super-admin": "bg-red-500/10 text-red-500 border-red-500/20",
  "business-admin": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "store-manager": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "cashier": "bg-green-500/10 text-green-500 border-green-500/20",
}

export default function UserManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {users.filter(u => u.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Admins</CardDescription>
            <CardTitle className="text-2xl">
              {users.filter(u => u.role === "super-admin" || u.role === "business-admin").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Staff</CardDescription>
            <CardTitle className="text-2xl">
              {users.filter(u => u.role === "store-manager" || u.role === "cashier").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage system users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {user.role === "super-admin" || user.role === "business-admin" ? (
                      <Shield className="h-5 w-5 text-primary" />
                    ) : (
                      <Users className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${roleColors[user.role as keyof typeof roleColors]}`}
                      >
                        {user.role.replace('-', ' ')}
                      </Badge>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: {user.lastLogin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

