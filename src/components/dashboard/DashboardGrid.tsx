// components/dashboard/DashboardGrid.tsx
"use client"

import { StatCard } from "./cards/StatCard"
import { SalesChart } from "./charts/SalesChart"
import { RevenueChart } from "./charts/RevenueChart"
import { RecentOrdersWidget } from "./widgets/RecentOrdersWidget"
import { TopProductsWidget } from "./widgets/TopProductsWidget"
import { QuickActionsWidget } from "./widgets/QuickActionsWidget"
import { useParams } from "next/navigation"
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, TrendingDown } from "lucide-react"

interface DashboardGridProps {
  outletId?: string;
}

export function DashboardGrid({ outletId }: DashboardGridProps) {
  const params = useParams()
  const role = params.role as string

  // Mock data - Replace with actual API calls
  const stats = {
    totalRevenue: {
      value: "৳125,450",
      change: 12.5,
      trend: "up" as const,
      label: "Total Revenue",
      icon: DollarSign,
    },
    totalOrders: {
      value: "1,234",
      change: 8.2,
      trend: "up" as const,
      label: "Total Orders",
      icon: ShoppingCart,
    },
    totalProducts: {
      value: "856",
      change: -2.1,
      trend: "down" as const,
      label: "Total Products",
      icon: Package,
    },
    totalCustomers: {
      value: "3,456",
      change: 15.3,
      trend: "up" as const,
      label: "Total Customers",
      icon: Users,
    },
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={stats.totalRevenue.icon}
          title={stats.totalRevenue.label}
          value={stats.totalRevenue.value}
          change={stats.totalRevenue.change}
          trend={stats.totalRevenue.trend}
        />
        <StatCard
          icon={stats.totalOrders.icon}
          title={stats.totalOrders.label}
          value={stats.totalOrders.value}
          change={stats.totalOrders.change}
          trend={stats.totalOrders.trend}
        />
        <StatCard
          icon={stats.totalProducts.icon}
          title={stats.totalProducts.label}
          value={stats.totalProducts.value}
          change={stats.totalProducts.change}
          trend={stats.totalProducts.trend}
        />
        <StatCard
          icon={stats.totalCustomers.icon}
          title={stats.totalCustomers.label}
          value={stats.totalCustomers.value}
          change={stats.totalCustomers.change}
          trend={stats.totalCustomers.trend}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart />
        <RevenueChart />
      </div>

      {/* Widgets Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentOrdersWidget />
        <TopProductsWidget />
        <QuickActionsWidget role={role} />
      </div>
    </div>
  )
}


