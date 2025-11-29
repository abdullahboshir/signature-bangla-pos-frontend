// app/(protected)/[business-unit]/[role]/(dashboard)/home/page.tsx
"use client"

import { DashboardGrid } from "@/components/dashboard/DashboardGrid"
import { useParams } from "next/navigation"

export default function HomeDashboardPage() {
  const params = useParams()
  const businessUnit = params["business-unit"] as string
  const role = params.role as string

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {businessUnit ? businessUnit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's an overview of your business.
        </p>
      </div>
      
      <DashboardGrid />
    </div>
  )
}

