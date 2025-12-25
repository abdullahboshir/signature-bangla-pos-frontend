"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Handshake } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function SettlementList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "transactionId",
            header: "Transaction ID",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.SETTLEMENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view settlements.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" />
                    Settlements
                </CardTitle>
                <CardDescription>View payment settlements.</CardDescription>
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
