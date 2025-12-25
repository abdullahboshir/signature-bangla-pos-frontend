"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { PieChart, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function BudgetList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Budget Name",
        },
        {
            accessorKey: "amount",
            header: "Total Amount",
        },
        {
            accessorKey: "progress",
            header: "Progress",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.BUDGET.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view budgets.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Budgets
                    </CardTitle>
                    <CardDescription>Track financial budgets and spending.</CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Budget
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
