"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { ShieldCheck, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function WarrantyList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Warranty Name",
        },
        {
            accessorKey: "duration",
            header: "Duration",
        },
        {
            accessorKey: "type",
            header: "Type",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.WARRANTY.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view warranties.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Warranties
                    </CardTitle>
                    <CardDescription>Manage product warranty policies.</CardDescription>
                </div>
                {/* Assuming CREATE permission exists or falling back to generic management if needed */}
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Warranty
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
