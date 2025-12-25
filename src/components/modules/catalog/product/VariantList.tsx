"use client"

import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VariantList() {
    const { hasPermission: can } = usePermissions()

    // Placeholder data
    const data = [
        { id: "1", name: "Size", values: "S, M, L" },
        { id: "2", name: "Color", values: "Red, Blue" },
    ]

    const columns = [
        { accessorKey: "name", header: "Variant Name" },
        { accessorKey: "values", header: "Values" },
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Variants</CardTitle>
                {can(PERMISSION_KEYS.VARIANT.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Variant
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
