"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Users, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AudienceList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Audience Name",
        },
        {
            accessorKey: "size",
            header: "Audience Size",
        },
        {
            accessorKey: "platform",
            header: "Platform",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.AUDIENCE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view audiences.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Target Audiences
                    </CardTitle>
                    <CardDescription>Manage marketing audiences.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.AUDIENCE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Audience
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
