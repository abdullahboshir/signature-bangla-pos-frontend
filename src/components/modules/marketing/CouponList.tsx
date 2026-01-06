"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { TicketPercent, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetCouponsQuery, useDeleteCouponMutation } from "@/redux/api/platform/marketingApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { MARKETING_STATUS } from "@/constant/marketing.constant"

export default function CouponList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetCouponsQuery({});
    const [deleteCoupon] = useDeleteCouponMutation();

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteCoupon(id).unwrap();
            toast.success("Coupon deleted successfully");
        } catch (err) {
            toast.error("Failed to delete coupon");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => <code className="bg-muted px-2 py-1 rounded text-xs font-bold">{row.original.code}</code>
        },
        {
            accessorKey: "discount",
            header: "Discount",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.discountValue} {row.original.discountType === 'percentage' ? '%' : 'BDT'}
                </span>
            )
        },
        {
            header: "Usage",
            cell: ({ row }) => (
                <span className="text-xs">
                    {row.original.usageCount} / {row.original.usageLimit || '∞'}
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status || MARKETING_STATUS.INACTIVE;
                return (
                    <Badge variant={status === MARKETING_STATUS.ACTIVE ? "default" : "secondary"}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "expiryDate",
            header: "Expiry Date",
            cell: ({ row }) => row.original.expiryDate ? format(new Date(row.original.expiryDate), "dd MMM yyyy") : "No Expiry"
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                hasPermission(PERMISSION_KEYS.COUPON.DELETE) && (
                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )
            )
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
                    <Button onClick={() => toast.info("New Coupon Form (Mock)")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Coupon
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="code"
                />
            </CardContent>
        </Card>
    )
}
