"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { ArrowRightLeft } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function TransactionList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.TRANSACTION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view transactions.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    Transactions
                </CardTitle>
                <CardDescription>View all financial transactions.</CardDescription>
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
