"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Building, Plus } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function DepartmentList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Department Name",
        },
        {
            accessorKey: "head",
            header: "Head of Dept",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.DEPARTMENT.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view departments.</div>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Departments
                    </CardTitle>
                    <CardDescription>Manage organizational departments.</CardDescription>
                </div>
                {/* Assuming CREATE permission exists or using generic MANAGE if not explicit */}
                <Button disabled={true}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
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
