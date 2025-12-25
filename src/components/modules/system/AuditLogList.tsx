"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { FileText } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AuditLogList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "user",
            header: "User",
        },
        {
            accessorKey: "action",
            header: "Action",
        },
        {
            accessorKey: "timestamp",
            header: "Timestamp",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.AUDIT_LOG.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view audit logs.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Logs
                </CardTitle>
                <CardDescription>View system activity logs.</CardDescription>
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
