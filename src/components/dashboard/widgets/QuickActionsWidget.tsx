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
        path: `/${businessUnit}/${role}/pos`,
        color: "bg-blue-500",
      },
      {
        label: "Add Product",
        icon: Plus,
        path: `/${businessUnit}/${role}/products/add`,
        color: "bg-green-500",
      },
      {
        label: "View Products",
        icon: Package,
        path: `/${businessUnit}/${role}/products`,
        color: "bg-purple-500",
      },
    ]

    if (role === "business-admin" || role === "store-manager") {
      return [
        ...baseActions,
        {
          label: "View Reports",
          icon: BarChart3,
          path: `/${businessUnit}/${role}/reports`,
          color: "bg-orange-500",
        },
        {
          label: "Manage Customers",
          icon: Users,
          path: `/${businessUnit}/${role}/contacts/customer`,
          color: "bg-pink-500",
        },
        {
          label: "Settings",
          icon: Settings,
          path: `/${businessUnit}/${role}/settings`,
          color: "bg-gray-500",
        },
      ]
    }

    if (role === "cashier") {
      return [
        ...baseActions.slice(0, 2),
        {
          label: "Today's Summary",
          icon: FileText,
          path: `/${businessUnit}/${role}/today`,
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


