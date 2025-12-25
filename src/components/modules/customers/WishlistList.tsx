"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Heart } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function WishlistList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "customer",
            header: "Customer",
        },
        {
            accessorKey: "items",
            header: "Items Count",
        },
        {
            accessorKey: "lastUpdated",
            header: "Last Updated",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.WISHLIST.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view wishlists.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Customer Wishlists
                </CardTitle>
                <CardDescription>View generic wishlists.</CardDescription>
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
