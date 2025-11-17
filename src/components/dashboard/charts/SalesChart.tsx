// components/dashboard/charts/SalesChart.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

// Mock chart data - Replace with actual chart library (recharts, chart.js, etc.)
const salesData = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 19000 },
  { day: "Wed", sales: 15000 },
  { day: "Thu", sales: 22000 },
  { day: "Fri", sales: 25000 },
  { day: "Sat", sales: 30000 },
  { day: "Sun", sales: 28000 },
]

export function SalesChart() {
  const maxSales = Math.max(...salesData.map(d => d.sales))
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Last 7 days sales performance</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart visualization */}
          <div className="flex items-end justify-between h-64 space-x-2">
            {salesData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 space-y-2">
                <div
                  className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${(item.sales / maxSales) * 100}%`,
                    minHeight: "4px",
                  }}
                  title={`${item.day}: ৳${item.sales.toLocaleString()}`}
                />
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
          
          {/* Chart legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Sales</p>
              <p className="text-2xl font-bold">৳161,000</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Growth</p>
              <p className="text-sm font-medium text-green-500">+12.5%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


