"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Truck, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function VendorList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Vendor Name",
        },
        {
            accessorKey: "contactPerson",
            header: "Contact Person",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.VENDOR.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view vendors.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Vendors
                    </CardTitle>
                    <CardDescription>Manage suppliers and vendors.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.VENDOR.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vendor
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
