"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Clock } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"
import { ColumnDef } from "@tanstack/react-table"

export default function AttendanceList() {
    const { hasPermission } = usePermissions();

    const data: any[] = [];
    const isLoading = false;

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "employee",
            header: "Employee",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "checkIn",
            header: "Check In",
        },
        {
            accessorKey: "checkOut",
            header: "Check Out",
        }
    ];

    if (!hasPermission(PERMISSION_KEYS.ATTENDANCE.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view attendance records.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Attendance
                </CardTitle>
                <CardDescription>Track employee attendance and work hours.</CardDescription>
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
