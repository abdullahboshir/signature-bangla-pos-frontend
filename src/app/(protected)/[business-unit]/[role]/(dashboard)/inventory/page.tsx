// app/(protected)/[business-unit]/[role]/(dashboard)/inventory/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, AlertTriangle, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock inventory data
const inventoryItems = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sku: "IP15PRO-256",
    stock: 5,
    threshold: 10,
    status: "low",
    location: "Warehouse A",
    value: "৳44,950",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    sku: "SGS24-256",
    stock: 75,
    threshold: 20,
    status: "in-stock",
    location: "Warehouse A",
    value: "৳56,250",
  },
  {
    id: "3",
    name: "Gaming Laptop RTX 4080",
    sku: "GL-RTX4080",
    stock: 25,
    threshold: 15,
    status: "in-stock",
    location: "Warehouse B",
    value: "৳574,750",
  },
  {
    id: "4",
    name: "Men's Casual T-Shirt",
    sku: "MCT-BLACK-M",
    stock: 100,
    threshold: 50,
    status: "in-stock",
    location: "Warehouse C",
    value: "৳2,400",
  },
]

export default function InventoryPage() {
  const router = useRouter()
  const lowStockItems = inventoryItems.filter(item => item.status === "low")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and stock levels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-500/10">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-500">Low Stock Alert</CardTitle>
            </div>
            <CardDescription>
              {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Inventory Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl">{inventoryItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock Items</CardDescription>
            <CardTitle className="text-2xl text-yellow-500">{lowStockItems.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stock Value</CardDescription>
            <CardTitle className="text-2xl">৳677,350</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Stock Level</CardDescription>
            <CardTitle className="text-2xl">51</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => router.push(`/inventory/${item.id}`)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge
                        variant={item.status === "low" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {item.status === "low" ? "Low Stock" : "In Stock"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">
                    Stock: <span className={item.stock <= item.threshold ? "text-red-500" : ""}>
                      {item.stock}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Threshold: {item.threshold}
                  </p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

