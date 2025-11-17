// app/(protected)/[business-unit]/[role]/(dashboard)/business-unit/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Store, Plus, Edit, Users, Package, TrendingUp, DollarSign } from "lucide-react"
import { useParams } from "next/navigation"

// Mock business unit data
const businessUnits = [
  {
    id: "telemedicine",
    name: "Telemedicine",
    status: "active",
    totalUsers: 25,
    totalProducts: 450,
    totalRevenue: "৳1,250,000",
    monthlyGrowth: 12.5,
    description: "Healthcare and telemedicine services",
  },
  {
    id: "clothing",
    name: "Clothing Store",
    status: "active",
    totalUsers: 18,
    totalProducts: 320,
    totalRevenue: "৳850,000",
    monthlyGrowth: 8.3,
    description: "Fashion and clothing retail",
  },
  {
    id: "grocery",
    name: "Grocery Mart",
    status: "active",
    totalUsers: 30,
    totalProducts: 580,
    totalRevenue: "৳2,100,000",
    monthlyGrowth: 15.2,
    description: "Grocery and household items",
  },
  {
    id: "books",
    name: "Book Store",
    status: "inactive",
    totalUsers: 12,
    totalProducts: 280,
    totalRevenue: "৳420,000",
    monthlyGrowth: -2.1,
    description: "Books and educational materials",
  },
]

export default function BusinessUnitPage() {
  const params = useParams()
  const currentBusinessUnit = params["business-unit"] as string

  const currentUnit = businessUnits.find(
    unit => unit.id === currentBusinessUnit
  )

  if (!currentUnit) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Unit Not Found</CardTitle>
            <CardDescription>The requested business unit does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentUnit.name}</h1>
          <p className="text-muted-foreground">{currentUnit.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Unit
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Badge
              variant={currentUnit.status === "active" ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {currentUnit.status.toUpperCase()}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              <span>Business Unit ID: {currentUnit.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{currentUnit.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Active users</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl">{currentUnit.totalProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Package className="h-3 w-3" />
              <span>In catalog</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">{currentUnit.totalRevenue}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>All time</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Growth</CardDescription>
            <CardTitle className={`text-2xl ${currentUnit.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentUnit.monthlyGrowth >= 0 ? '+' : ''}{currentUnit.monthlyGrowth}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Unit Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unit Information</CardTitle>
            <CardDescription>Basic business unit details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Unit Name</label>
              <Input value={currentUnit.name} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit ID</label>
              <Input value={currentUnit.id} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={currentUnit.description} readOnly />
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div>
                <Badge
                  variant={currentUnit.status === "active" ? "default" : "secondary"}
                >
                  {currentUnit.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Business Units Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Business Units</CardTitle>
          <CardDescription>Overview of all business units in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessUnits.map((unit) => (
              <div
                key={unit.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors ${
                  unit.id === currentBusinessUnit ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{unit.name}</h3>
                      <Badge
                        variant={unit.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {unit.status}
                      </Badge>
                      {unit.id === currentBusinessUnit && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{unit.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>{unit.totalUsers} users</span>
                      <span>•</span>
                      <span>{unit.totalProducts} products</span>
                      <span>•</span>
                      <span>{unit.totalRevenue} revenue</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

