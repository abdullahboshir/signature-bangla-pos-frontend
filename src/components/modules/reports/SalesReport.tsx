"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function SalesReport() {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSION_KEYS.SALES_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view sales reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Analysis
                </CardTitle>
                <CardDescription>Comprehensive sales performance reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Sales reporting visualization will be rendered here.</p>
            </CardContent>
        </Card>
    )
}
