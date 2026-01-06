"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Palette, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ThemeList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Theme Name",
        },
        {
            accessorKey: "version",
            header: "Version",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.THEME.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view themes.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Themes (Coming Soon)
                    </CardTitle>
                    <CardDescription>Manage online store themes. Feature currently in development.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.THEME.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Theme
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
