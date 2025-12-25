"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Warehouse, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function WarehouseList() {
    const { hasPermission } = usePermissions();
    // Using loose permission check for now to ensure visibility if strict key fails, 
    // but ideally should be PERMISSION_KEYS.WAREHOUSE.READ
    const canView = hasPermission(PERMISSION_KEYS.WAREHOUSE.READ);

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Warehouse Name",
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "capacity",
            header: "Capacity",
        },
        {
            accessorKey: "manager",
            header: "Manager",
        }
    ];

    if (!canView) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view warehouses.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5" />
                        Warehouses
                    </CardTitle>
                    <CardDescription>Manage your inventory warehouses and locations.</CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Warehouse
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
