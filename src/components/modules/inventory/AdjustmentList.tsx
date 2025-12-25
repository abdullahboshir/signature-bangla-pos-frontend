"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { ClipboardList, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AdjustmentList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "items",
            header: "Items Adjusted",
        },
        {
            accessorKey: "reason",
            header: "Reason",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ADJUSTMENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view stock adjustments.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Stock Adjustments
                    </CardTitle>
                    <CardDescription>Manage inventory quantity adjustments.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.ADJUSTMENT.ADJUST) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Adjustment
                    </Button>
                )}
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
