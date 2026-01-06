"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Activity } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetEventsQuery } from "@/redux/api/platform/marketingApi"
import { Badge } from "@/components/ui/badge"

export default function EventList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetEventsQuery({});

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Event Name",
        },
        {
            accessorKey: "source",
            header: "Source",
            cell: ({ row }) => <Badge variant="secondary">{row.original.source}</Badge>
        },
        {
            accessorKey: "occurrences",
            header: "Count",
            cell: ({ row }) => <span className="font-mono">{row.original.occurrences}</span>
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.EVENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view events.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Tracking Events
                </CardTitle>
                <CardDescription>Monitor tracking pixel events.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </CardContent>
        </Card>
    )
}
