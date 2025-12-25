"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Banknote, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function PayrollList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "period",
            header: "Pay Period",
        },
        {
            accessorKey: "totalAmount",
            header: "Total Payroll",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.PAYROLL.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view payroll.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="h-5 w-5" />
                        Payroll
                    </CardTitle>
                    <CardDescription>Process and view salary payments.</CardDescription>
                </div>
                <Button disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    Run Payroll
                </Button>
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
