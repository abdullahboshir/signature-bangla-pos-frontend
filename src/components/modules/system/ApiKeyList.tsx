"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Key, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ApiKeyList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Key Name",
        },
        {
            accessorKey: "prefix",
            header: "Key Prefix",
        },
        {
            accessorKey: "lastUsed",
            header: "Last Used",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.API_KEY.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view API keys.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Keys
                    </CardTitle>
                    <CardDescription>Manage system API keys.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.API_KEY.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Key
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
