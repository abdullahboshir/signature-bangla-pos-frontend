"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Database, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function BackupList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Backup Name",
        },
        {
            accessorKey: "size",
            header: "Size",
        },
        {
            accessorKey: "date",
            header: "Date Created",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.BACKUP.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view backups.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        System Backups
                    </CardTitle>
                    <CardDescription>Manage database backups.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.BACKUP.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Backup
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
