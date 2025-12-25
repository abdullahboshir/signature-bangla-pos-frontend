"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { TicketPercent, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function CouponList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "code",
            header: "Code",
        },
        {
            accessorKey: "discount",
            header: "Discount",
        },
        {
            accessorKey: "expiry",
            header: "Expiry Date",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.COUPON.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view coupons.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <TicketPercent className="h-5 w-5" />
                        Coupons
                    </CardTitle>
                    <CardDescription>Manage discount coupons.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.COUPON.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Coupon
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
