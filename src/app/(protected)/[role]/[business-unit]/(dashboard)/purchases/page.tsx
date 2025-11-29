// app/(protected)/[business-unit]/[role]/(dashboard)/purchases/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock purchases data
const purchases = [
  {
    id: "PUR-001",
    supplier: "Tech Supplier Inc.",
    date: "2024-01-15",
    amount: "৳125,000",
    status: "completed",
    items: 15,
  },
  {
    id: "PUR-002",
    supplier: "Fashion Wholesale",
    date: "2024-01-14",
    amount: "৳45,000",
    status: "pending",
    items: 8,
  },
  {
    id: "PUR-003",
    supplier: "Electronics Direct",
    date: "2024-01-13",
    amount: "৳89,500",
    status: "completed",
    items: 12,
  },
  {
    id: "PUR-004",
    supplier: "Local Distributor",
    date: "2024-01-12",
    amount: "৳32,000",
    status: "processing",
    items: 5,
  },
]

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

export default function PurchasesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground">
            Manage your purchase orders and inventory replenishment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search purchases..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchases List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>View and manage your purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{purchase.id}</h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColors[purchase.status as keyof typeof statusColors]}`}
                      >
                        {purchase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{purchase.supplier}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {purchase.date} • {purchase.items} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{purchase.amount}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    View Details
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

