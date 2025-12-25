"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Globe, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function LanguageList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Language",
        },
        {
            accessorKey: "code",
            header: "Code",
        },
        {
            accessorKey: "status",
            header: "Status",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.LANGUAGE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view languages.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Languages
                    </CardTitle>
                    <CardDescription>Manage system languages.</CardDescription>
                </div>
                {hasPermission(PERMISSION_KEYS.LANGUAGE.CREATE) && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Language
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
