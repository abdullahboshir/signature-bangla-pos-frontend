"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Code2, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function PixelList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Pixel Name",
        },
        {
            accessorKey: "platform",
            header: "Platform",
        },
        {
            accessorKey: "id",
            header: "Pixel ID",
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Pixel
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
