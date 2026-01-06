"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Megaphone, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetPromotionsQuery, useDeletePromotionMutation } from "@/redux/api/platform/marketingApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { MARKETING_STATUS } from "@/constant/marketing.constant"

export default function PromotionList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetPromotionsQuery({});
    const [deletePromotion] = useDeletePromotionMutation();

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deletePromotion(id).unwrap();
            toast.success("Promotion deleted successfully");
        } catch (err) {
            toast.error("Failed to delete promotion");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Promotion Name",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <span className="capitalize">{row.original.type}</span>
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                hasPermission(PERMISSION_KEYS.PROMOTION.DELETE) && (
                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.PROMOTION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view promotions.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        Promotions
                    </CardTitle>
                    <CardDescription>Manage sales and promotional activities.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.PROMOTION.CREATE) && (
                    <Button onClick={() => toast.info("New Promotion Form (Mock)")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Promotion
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
