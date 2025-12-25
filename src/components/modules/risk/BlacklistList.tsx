"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Ban, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function BlacklistList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "entity",
            header: "Entity (IP/Email/Phone)",
        },
        {
            accessorKey: "reason",
            header: "Reason",
        },
        {
            accessorKey: "dateAdded",
            header: "Date Added",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.BLACKLIST.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view the blacklist.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Ban className="h-5 w-5" />
                        Blacklist Management
                    </CardTitle>
                    <CardDescription>Manage blocked entities and restrictions.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.BLACKLIST.CREATE) && (
                    <Button variant="destructive">
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Blacklist
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
