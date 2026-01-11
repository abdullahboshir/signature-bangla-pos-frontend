// components/dashboard/widgets/QuickActionsWidget.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Plus,
  FileText,
  Settings,
  CreditCard,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { buildRoutePath } from "@/lib/buildRoutePath"
import { ROUTE_PATHS } from "@/config/route-paths"
import { USER_ROLES, matchesRole } from "@/config/auth-constants"

interface QuickActionsWidgetProps {
  role: string
}

export function QuickActionsWidget({ role }: QuickActionsWidgetProps) {
  const router = useRouter()
  const params = useParams()
  const businessUnit = params["business-unit"] as string

  const getQuickActions = () => {
    const baseActions = [
      {
        label: "New Order",
        icon: ShoppingCart,
        path: buildRoutePath(role, businessUnit, ROUTE_PATHS.SALES.POS),
        color: "bg-blue-500",
      },
      {
        label: "Add Product",
        icon: Plus,
        path: buildRoutePath(role, businessUnit, ROUTE_PATHS.CATALOG.PRODUCT.ADD),
        color: "bg-green-500",
      },
      {
        label: "View Products",
        icon: Package,
        path: buildRoutePath(role, businessUnit, ROUTE_PATHS.CATALOG.PRODUCT.ROOT),
        color: "bg-purple-500",
      },
    ]

    if (matchesRole(role, [USER_ROLES.ADMIN, USER_ROLES.MANAGER, "business-admin", "store-manager"])) {
      return [
        ...baseActions,
        {
          label: "View Reports",
          icon: BarChart3,
          path: buildRoutePath(role, businessUnit, ROUTE_PATHS.REPORTS.SALES),
          color: "bg-orange-500",
        },
        {
          label: "Manage Customers",
          icon: Users,
          path: buildRoutePath(role, businessUnit, ROUTE_PATHS.CUSTOMERS.ROOT),
          color: "bg-pink-500",
        },
        {
          label: "Settings",
          icon: Settings,
          path: buildRoutePath(role, businessUnit, ROUTE_PATHS.COMMON.SETTINGS),
          color: "bg-gray-500",
        },
      ]
    }

    if (matchesRole(role, USER_ROLES.CASHIER)) {
      return [
        ...baseActions.slice(0, 2),
        {
          label: "Today's Summary",
          icon: FileText,
          path: buildRoutePath(role, businessUnit, ROUTE_PATHS.POS.TODAY),
          color: "bg-teal-500",
        },
      ]
    }

    return baseActions
  }

  const actions = getQuickActions()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </div>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col space-y-2 p-4 hover:bg-accent"
                onClick={() => router.push(action.path)}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


