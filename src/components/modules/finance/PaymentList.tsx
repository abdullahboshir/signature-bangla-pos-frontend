"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { CreditCard } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function PaymentList() {
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

    if (!hasPermission(PERMISSION_KEYS.PAYMENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view payments.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payments
                </CardTitle>
                <CardDescription>View and manage all incoming payments.</CardDescription>
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
