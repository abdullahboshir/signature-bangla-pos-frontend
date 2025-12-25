"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function StockReport() {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSION_KEYS.STOCK_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view stock reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stock Valuation
                </CardTitle>
                <CardDescription>Current inventory value and movement reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Stock reporting visualization will be rendered here.</p>
            </CardContent>
        </Card>
    )
}
