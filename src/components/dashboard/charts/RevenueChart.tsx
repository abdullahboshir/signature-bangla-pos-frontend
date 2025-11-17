// components/dashboard/charts/RevenueChart.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

// Mock revenue data - Replace with actual chart library
const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
]

export function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = Math.round(totalRevenue / revenueData.length)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </div>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple line/bar chart visualization */}
          <div className="flex items-end justify-between h-64 space-x-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 space-y-2">
                <div
                  className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    minHeight: "4px",
                  }}
                  title={`${item.month}: ৳${item.revenue.toLocaleString()}`}
                />
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
          
          {/* Chart summary */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium">Average Revenue</p>
              <p className="text-2xl font-bold">৳{averageRevenue.toLocaleString()}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Last Month</p>
              <p className="text-sm font-medium">৳{revenueData[revenueData.length - 1].revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


