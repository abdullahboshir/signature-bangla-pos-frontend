// components/dashboard/widgets/TopProductsWidget.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { useCurrentRole } from "@/hooks/useCurrentRole"

// Mock top products data
const topProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    sales: 245,
    revenue: "৳220,500",
    change: 15.3,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    sales: 189,
    revenue: "৳141,750",
    change: 8.7,
  },
  {
    id: "3",
    name: "Gaming Laptop RTX 4080",
    sales: 52,
    revenue: "৳119,600",
    change: 22.1,
  },
  {
    id: "4",
    name: "Men's Casual T-Shirt",
    sales: 456,
    revenue: "৳10,944",
    change: -3.2,
  },
  {
    id: "5",
    name: "Women's Summer Dress",
    sales: 312,
    revenue: "৳12,168",
    change: 12.5,
  },
]

export function TopProductsWidget() {
  const router = useRouter()
  const params = useParams()
  const { currentRole } = useCurrentRole()
  const role = currentRole as string
  const businessUnit = (params["business-unit"] || params.businessUnit) as string

  const baseUrl = `/${role}/${businessUnit}/catalog/product`

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </div>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
              onClick={() => router.push(`${baseUrl}/${product.id}`)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">
                        {Math.abs(product.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{product.revenue}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => router.push(baseUrl)}
        >
          View All Products
        </Button>
      </CardContent>

    </Card>
  )
}

