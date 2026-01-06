"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Clock, CheckCircle2, UserCheck, XCircle } from "lucide-react"
import { useGetAttendanceQuery, useCreateAttendanceMutation, useUpdateAttendanceMutation } from "@/redux/api/hrm/attendanceApi"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/usePermissions"

export default function AttendanceTracker({ businessUnitId }: { businessUnitId: string }) {
    const { data: attendanceData, isLoading, refetch } = useGetAttendanceQuery({});
    const [createAttendance] = useCreateAttendanceMutation();
    const [updateAttendance] = useUpdateAttendanceMutation();
    const { user } = usePermissions(); // Assuming hook provides user info

    // Safety check for user ID.
    // Ideally user ID comes from session/redux state. 
    // If Permissions hook doesn't provide it, we might need another selector.
    // For now assuming we can check in without passing ID (backend infers from Token).

    const handleCheckIn = async () => {
        try {
            await createAttendance({ businessUnit: businessUnitId }).unwrap();
            toast.success("Checked in successfully!");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Check-in failed");
        }
    }

    const handleCheckOut = async (id: string) => {
        try {
            // body: { checkOut: true } triggers backend to set checkOut time
            await updateAttendance({ id, body: { checkOut: true } }).unwrap();
            toast.success("Checked out successfully!");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Check-out failed");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy")
        },
        {
            accessorKey: "staff",
            header: "Staff",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.staff?.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.staff?.email}</span>
                </div>
            )
        },
        {
            accessorKey: "checkIn",
            header: "Check In",
            cell: ({ row }) => format(new Date(row.original.checkIn), "hh:mm a")
        },
        {
            accessorKey: "checkOut",
            header: "Check Out",
            cell: ({ row }) => row.original.checkOut ? format(new Date(row.original.checkOut), "hh:mm a") : <Badge variant="outline">On Duty</Badge>
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => <Badge className="uppercase">{row.original.status}</Badge>
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => {
                // If it's TODAY's record and CheckOut is null, show Check Out button
                const isToday = new Date().toDateString() === new Date(row.original.date).toDateString();
                // We should also check if the record belongs to the CURRENT USER (if we list all).
                // But for now let's assume if you can see it and it's open, you can check out (simplified).
                // Or better, only show Check Out if it's "On Duty"

                if (!row.original.checkOut && isToday) {
                    return (
                        <Button size="sm" variant="destructive" onClick={() => handleCheckOut(row.original._id)}>
                            <XCircle className="mr-2 h-4 w-4" /> Check Out
                        </Button>
                    )
                }
                return null;
            }
        }
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Attendance Tracker
                    </CardTitle>
                    <CardDescription>Track daily attendance and work hours.</CardDescription>
                </div>
                <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Check In
                </Button>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={attendanceData?.data || []}
                    isLoading={isLoading}
                    searchKey="status" // Can't search by date string easily client side without custom filter
                />
            </CardContent>
        </Card>
    )
}
