"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { MessageSquare, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function SmsTemplateList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Template Name",
        },
        {
            accessorKey: "content",
            header: "Content Preview",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.SMS_TEMPLATE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view SMS templates.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        SMS Templates
                    </CardTitle>
                    <CardDescription>Manage SMS notification templates.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.SMS_TEMPLATE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
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
