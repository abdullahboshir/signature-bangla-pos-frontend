"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Wallet, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function PayoutList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "recipient",
            header: "Recipient",
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

    if (!hasPermission(PERMISSION_KEYS.PAYOUT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view payouts.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Payouts
                    </CardTitle>
                    <CardDescription>Manage withdrawals and vendor payouts.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.PAYOUT.MANAGE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Process Payout
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
