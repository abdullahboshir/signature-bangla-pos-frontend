// app/(protected)/super-admin/business-units/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Store } from "lucide-react"

export default function SuperAdminBusinessUnitsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Units</h1>
          <p className="text-muted-foreground">
            Manage all business units in the system
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Business Unit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Business Units</CardTitle>
          <CardDescription>View and manage business units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Business units management coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

