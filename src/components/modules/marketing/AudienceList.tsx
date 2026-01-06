"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Users, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetAudiencesQuery } from "@/redux/api/platform/marketingApi"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AudienceList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading } = useGetAudiencesQuery({});

    // Safe casting
    const tableData = Array.isArray((rawData as any)?.data) ? (rawData as any).data : (Array.isArray(rawData) ? rawData : []);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Audience Name",
        },
        {
            accessorKey: "size",
            header: "Audience Size",
            cell: ({ row }) => <span>{row.original.size?.toLocaleString()} users</span>
        },
        {
            accessorKey: "platform",
            header: "Platform",
            cell: ({ row }) => <Badge variant="outline">{row.original.platform}</Badge>
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
                    <Button onClick={() => toast.info("Audience Builder (Mock)")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Audience
                    </Button>
                )}
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
