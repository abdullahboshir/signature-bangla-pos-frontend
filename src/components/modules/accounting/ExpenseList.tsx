"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Receipt, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ExpenseList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "date",
            header: "Date",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.EXPENSE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view expenses.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Expenses
                    </CardTitle>
                    <CardDescription>Manage business expenses.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.EXPENSE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Record Expense
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
