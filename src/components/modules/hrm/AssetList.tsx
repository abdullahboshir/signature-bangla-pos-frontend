"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Monitor, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AssetList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Asset Name",
        },
        {
            accessorKey: "assignedTo",
            header: "Assigned To",
        },
        {
            accessorKey: "condition",
            header: "Condition",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ASSET.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view organization assets.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Assets
                    </CardTitle>
                    <CardDescription>Manage organization equipment and assets.</CardDescription>
                </div>
                <Button disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Asset
                </Button>
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
