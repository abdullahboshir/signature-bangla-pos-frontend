"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { ShoppingBag } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AbandonedCartList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "cartValue",
            header: "Cart Value",
        },
        {
            accessorKey: "abandonedAt",
            header: "Abandoned At",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ABANDONED_CART.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view abandoned carts.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Abandoned Carts
                </CardTitle>
                <CardDescription>Recover lost sales from abandoned carts.</CardDescription>
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
