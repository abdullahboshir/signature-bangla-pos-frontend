"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { ShoppingCart } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function CartList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "total",
            header: "Cart Total",
        },
        {
            accessorKey: "items",
            header: "Item Count",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.CART.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view carts.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Active Carts
                </CardTitle>
                <CardDescription>Monitor active shopping carts.</CardDescription>
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
