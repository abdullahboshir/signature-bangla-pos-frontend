"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Plug, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function PluginList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Plugin Name",
        },
        {
            accessorKey: "author",
            header: "Author",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.PLUGIN.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view plugins.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Plug className="h-5 w-5" />
                        Plugins (Coming Soon)
                    </CardTitle>
                    <CardDescription>Manage store plugins and extensions. Feature currently in development.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.PLUGIN.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Install Plugin
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
