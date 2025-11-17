// app/(protected)/[business-unit]/[role]/(dashboard)/contacts/customer/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Users, Plus, Search, Phone, Mail, MapPin, ShoppingBag } from "lucide-react"

// Mock customers data
const customers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    status: "active",
    totalOrders: 12,
    totalSpent: "৳24,500",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+880 9876 543210",
    address: "Chittagong, Bangladesh",
    status: "active",
    totalOrders: 8,
    totalSpent: "৳18,900",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+880 5555 123456",
    address: "Sylhet, Bangladesh",
    status: "inactive",
    totalOrders: 5,
    totalSpent: "৳9,200",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    phone: "+880 6666 789012",
    address: "Rajshahi, Bangladesh",
    status: "active",
    totalOrders: 15,
    totalSpent: "৳32,000",
  },
]

export default function CustomerPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer contacts and information
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl">{customers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Customers</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {customers.filter(c => c.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">৳84,600</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge
                      variant={customer.status === "active" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.address}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm">Orders</span>
                </div>
                <span className="text-sm font-medium">{customer.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="text-sm font-medium">{customer.totalSpent}</span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
