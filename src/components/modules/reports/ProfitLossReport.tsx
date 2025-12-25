"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function ProfitLossReport() {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSION_KEYS.PROFIT_LOSS_REPORT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view profit & loss reports.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Profit & Loss
                </CardTitle>
                <CardDescription>Financial performance and P&L statement.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Profit & Loss reporting visualization will be rendered here.</p>
            </CardContent>
        </Card>
    )
}
