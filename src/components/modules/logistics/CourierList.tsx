"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Plus, Truck } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function CourierList() {
    const { hasPermission } = usePermissions();

    // Placeholder data since API might not exist yet
    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Courier Name",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.COURIER.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view couriers.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Courier Services
                    </CardTitle>
                    <CardDescription>Manage courier partners and integrations.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.COURIER.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Courier
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
