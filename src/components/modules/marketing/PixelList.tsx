"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Code2, Plus, Trash2 } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetPixelsQuery, useDeletePixelMutation } from "@/redux/api/platform/marketingApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function PixelList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetPixelsQuery({});
    const [deletePixel] = useDeletePixelMutation();

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deletePixel(id).unwrap();
            toast.success("Pixel deleted successfully");
        } catch (err) {
            toast.error("Failed to delete pixel");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Pixel Name",
        },
        {
            accessorKey: "platform",
            header: "Platform",
            cell: ({ row }) => <Badge variant="outline">{row.original.platform}</Badge>
        },
        {
            accessorKey: "pixelId",
            header: "Pixel ID",
            cell: ({ row }) => <code className="bg-muted px-2 py-1 rounded text-xs">{row.original.pixelId}</code>
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                hasPermission(PERMISSION_KEYS.PIXEL.DELETE) && (
                    <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDelete(row.original._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )
            )
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.PIXEL.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view pixels.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5" />
                        Tracking Pixels
                    </CardTitle>
                    <CardDescription>Manage tracking pixels and scripts.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.PIXEL.CREATE) && (
                    <Button onClick={() => toast.info("Add Pixel Form (Mock)")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Pixel
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
