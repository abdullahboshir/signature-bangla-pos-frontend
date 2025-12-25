"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { DollarSign, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function CurrencyList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Currency",
        },
        {
            accessorKey: "code",
            header: "Code",
        },
        {
            accessorKey: "rate",
            header: "Exchange Rate",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.CURRENCY.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view currencies.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Currencies
                    </CardTitle>
                    <CardDescription>Manage system currencies.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.CURRENCY.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Currency
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
