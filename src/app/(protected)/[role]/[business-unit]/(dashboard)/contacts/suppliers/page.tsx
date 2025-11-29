// app/(protected)/[business-unit]/[role]/(dashboard)/contacts/suppliers/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Truck, Plus, Search, Phone, Mail, MapPin } from "lucide-react"

// Mock suppliers data
const suppliers = [
  {
    id: "1",
    name: "Tech Supplier Inc.",
    contact: "John Smith",
    email: "john@techsupplier.com",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    status: "active",
    totalOrders: 45,
  },
  {
    id: "2",
    name: "Fashion Wholesale",
    contact: "Jane Doe",
    email: "jane@fashionwholesale.com",
    phone: "+880 9876 543210",
    address: "Chittagong, Bangladesh",
    status: "active",
    totalOrders: 32,
  },
  {
    id: "3",
    name: "Electronics Direct",
    contact: "Bob Johnson",
    email: "bob@electronicsdirect.com",
    phone: "+880 5555 123456",
    address: "Sylhet, Bangladesh",
    status: "inactive",
    totalOrders: 18,
  },
]

export default function SuppliersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier contacts and information
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." className="pl-8" />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge
                      variant={supplier.status === "active" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {supplier.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.address}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contact Person</span>
                <span className="text-sm font-medium">{supplier.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="text-sm font-medium">{supplier.totalOrders}</span>
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

