"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Truck } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ShippingList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "trackingNumber",
            header: "Tracking #",
        },
        {
            accessorKey: "carrier",
            header: "Carrier",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.SHIPPING.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view shipping info.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping
                </CardTitle>
                <CardDescription>Track and manage shipments.</CardDescription>
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
