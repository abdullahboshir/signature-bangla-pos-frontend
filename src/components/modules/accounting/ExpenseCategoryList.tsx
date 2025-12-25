"use client"

import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExpenseCategoryList() {
    const { hasPermission: can } = usePermissions()

    // Placeholder data
    const data = [
        { id: "1", name: "Rent", type: "Fixed" },
        { id: "2", name: "Utilities", type: "Variable" },
    ]

    const columns = [
        { accessorKey: "name", header: "Category Name" },
        { accessorKey: "type", header: "Type" },
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Expense Categories</CardTitle>
                {can(PERMISSION_KEYS.EXPENSE_CATEGORY.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
