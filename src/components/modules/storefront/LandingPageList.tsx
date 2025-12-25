"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Layout, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function LandingPageList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Page Title",
        },
        {
            accessorKey: "slug",
            header: "Slug",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.LANDING_PAGE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view landing pages.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        Landing Pages
                    </CardTitle>
                    <CardDescription>Manage promotional landing pages.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.LANDING_PAGE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Page
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
