"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Map, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function ZoneList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Zone Name",
        },
        {
            accessorKey: "countries",
            header: "Countries",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ZONE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view zones.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Map className="h-5 w-5" />
                        Zones & Locations
                    </CardTitle>
                    <CardDescription>Manage geographical zones.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.ZONE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Zone
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
