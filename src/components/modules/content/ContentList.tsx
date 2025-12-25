"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { FileText, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ContentList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.CONTENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view content.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content Manager
                    </CardTitle>
                    <CardDescription>Manage files, images and blog posts.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.CONTENT.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Content
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
