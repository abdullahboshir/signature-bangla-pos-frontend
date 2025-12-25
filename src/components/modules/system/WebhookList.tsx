"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Webhook, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function WebhookList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "url",
            header: "Payload URL",
        },
        {
            accessorKey: "events",
            header: "Events",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.WEBHOOK.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view webhooks.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Webhook className="h-5 w-5" />
                        Webhooks
                    </CardTitle>
                    <CardDescription>Manage system webhooks.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.WEBHOOK.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Webhook
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
