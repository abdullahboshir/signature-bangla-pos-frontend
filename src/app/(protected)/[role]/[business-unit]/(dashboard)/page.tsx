// app/(protected)/[business-unit]/[role]/(dashboard)/page.tsx
"use client"

import { DashboardGrid } from "@/components/dashboard/DashboardGrid"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's an overview of your business.
        </p>
      </div>
      
      <DashboardGrid />
    </div>
  )
}
