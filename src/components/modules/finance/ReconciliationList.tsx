"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Scale } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ReconciliationList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "period",
            header: "Period",
        },
        {
            accessorKey: "systemBalance",
            header: "System Balance",
        },
        {
            accessorKey: "bankBalance",
            header: "Bank Balance",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.RECONCILIATION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view reconciliations.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Reconciliations
                </CardTitle>
                <CardDescription>Manage bank reconciliations.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}
