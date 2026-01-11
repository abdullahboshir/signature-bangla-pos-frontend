"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { FileText, RefreshCw, Eye } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"
import { useGetAuditLogsQuery } from "@/redux/api/system/auditLogApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { AuditLogDetailsModal } from "./AuditLogDetailsModal"

export default function AuditLogList() {
    const { hasPermission } = usePermissions();
    const { data: rawData, isLoading, refetch } = useGetAuditLogsQuery({});
    const [selectedLog, setSelectedLog] = useState<any>(null);

    const data = useMemo(() => {
        if (!rawData) return [];
        return Array.isArray(rawData) ? rawData : (rawData.data || rawData.result || []);
    }, [rawData]);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => <Badge variant="outline">{row.original.action}</Badge>,
        },
        {
            accessorKey: "responseStatus",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.responseStatus;
                return (
                    <Badge variant={status >= 400 ? "destructive" : "default"}>
                        {status || '200'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "module",
            header: "Module",
            cell: ({ row }) => <Badge variant="secondary">{row.original.module?.toUpperCase()}</Badge>,
        },
        {
            accessorKey: "actor",
            header: "Actor",
            cell: ({ row }) => {
                const actor = row.original.actor;
                const device = row.original.metadata?.device?.split(' on ')?.[1] || 'Unknown Device';
                return (
                    <div className="text-sm">
                        <span className="font-medium block">{actor?.role}</span>
                        <span className="text-muted-foreground text-xs">{actor?.ip} • {device}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "target",
            header: "Target",
            cell: ({ row }) => {
                const target = row.original.target;
                return (
                    <div className="max-w-[150px] truncate" title={target?.resourceId}>
                        <span className="font-medium">{target?.resource}</span>
                        <span className="text-xs text-muted-foreground block truncate">{target?.resourceId}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.duration ? `${row.original.duration}ms` : '-'}</span>,
        },
        {
            accessorKey: "timestamp",
            header: "Date",
            cell: ({ row }) => (
                <div className="text-xs">
                    <div>{new Date(row.original.timestamp).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">{new Date(row.original.timestamp).toLocaleTimeString()}</div>
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="icon" onClick={() => setSelectedLog(row.original)}>
                    <Eye className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    if (!hasPermission(PERMISSION_KEYS.AUDIT_LOG.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view audit logs.</div>
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Audit Logs
                        </CardTitle>
                        <CardDescription>Enterprise Grade Audit Trail with Diffing & Payload Tracking</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
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

            <AuditLogDetailsModal
                log={selectedLog}
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
            />
        </>
    )
}

