"use client"

import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransferList() {
    const { hasPermission: can } = usePermissions()

    // Placeholder data
    const data = [
        { id: "1", reference: "R-001", from: "Warehouse A", to: "Store B", status: "PENDING" },
        { id: "2", reference: "R-002", from: "Warehouse A", to: "Warehouse C", status: "COMPLETED" },
    ]

    const columns = [
        { accessorKey: "reference", header: "Reference" },
        { accessorKey: "from", header: "From" },
        { accessorKey: "to", header: "To" },
        { accessorKey: "status", header: "Status" },
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Stock Transfers</CardTitle>
                {can(PERMISSION_KEYS.TRANSFER.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Transfer
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="reference"
                />
            </CardContent>
        </Card>
    )
}
