// components/dashboard/widgets/RecentOrdersWidget.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { buildRoutePath } from "@/lib/buildRoutePath"
import { ROUTE_PATHS } from "@/config/route-paths"

// Mock recent orders data
const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    amount: "৳2,450",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    amount: "৳1,890",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    amount: "৳3,200",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Alice Williams",
    amount: "৳1,500",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Charlie Brown",
    amount: "৳950",
    status: "completed",
    date: "2024-01-13",
  },
]

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

import { useCurrentRole } from "@/hooks/useCurrentRole";

export function RecentOrdersWidget() {
  const router = useRouter()
  const params = useParams()
  const { currentRole } = useCurrentRole();
  const role = currentRole as string;
  const businessUnit = params["business-unit"] as string

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders from customers</CardDescription>
          </div>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
              onClick={() => router.push(buildRoutePath(role, businessUnit, `${ROUTE_PATHS.SALES.ROOT}/${order.id}`))}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{order.id}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusColors[order.status as keyof typeof statusColors]}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{order.amount}</p>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => router.push(buildRoutePath(role, businessUnit, ROUTE_PATHS.SALES.ROOT))}
        >
          View All Orders
        </Button>
      </CardContent>
    </Card>
  )
}

