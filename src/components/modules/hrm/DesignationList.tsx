"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { BadgeCheck, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function DesignationList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Job Title",
        },
        {
            accessorKey: "level",
            header: "Level",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.DESIGNATION.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view designations.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5" />
                        Designations
                    </CardTitle>
                    <CardDescription>Manage job titles and hierarchy.</CardDescription>
                </div>
                <Button disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Designation
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
