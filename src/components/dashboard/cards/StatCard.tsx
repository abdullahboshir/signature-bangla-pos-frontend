// components/dashboard/cards/StatCard.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  title: string
  value: string
  change?: number
  trend?: "up" | "down"
  description?: string
}

export function StatCard({
  icon: Icon,
  title,
  value,
  change,
  trend,
  description,
}: StatCardProps) {
  const isPositive = trend === "up"
  const hasChange = change !== undefined && trend

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hasChange && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            {isPositive ? (
              <TrendingUp className={cn("h-3 w-3", isPositive ? "text-green-500" : "text-red-500")} />
            ) : (
              <TrendingDown className={cn("h-3 w-3", isPositive ? "text-green-500" : "text-red-500")} />
            )}
            <span className={cn(isPositive ? "text-green-500" : "text-red-500")}>
              {Math.abs(change)}%
            </span>
            <span>from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}


