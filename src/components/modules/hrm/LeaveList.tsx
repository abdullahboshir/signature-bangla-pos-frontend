"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/DataTable"
import { Plus, Check, X, FileText } from "lucide-react"
import { useGetLeavesQuery, useUpdateLeaveStatusMutation, useCreateLeaveMutation, useDeleteLeaveMutation } from "@/redux/api/hrm/leaveApi"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePermissions } from "@/hooks/usePermissions"

export default function LeaveList({ businessUnitId }: { businessUnitId: string }) {
    const { data: leavesData, isLoading, refetch } = useGetLeavesQuery({ businessUnit: businessUnitId });
    const [updateStatus] = useUpdateLeaveStatusMutation();
    const [createLeave] = useCreateLeaveMutation();
    const [deleteLeave] = useDeleteLeaveMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        leaveType: "", // this needs to be an ID
        startDate: "",
        endDate: "",
        reason: ""
    });

    const { hasPermission } = usePermissions();

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateStatus({ id, body: { status } }).unwrap();
            toast.success(`Leave request ${status}`);
            refetch();
        } catch (error: any) {
            toast.error("Failed to update status");
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteLeave(id).unwrap();
            toast.success("Leave request deleted");
            refetch();
        } catch (err) {
            toast.error("Failed to delete");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createLeave({
                ...formData,
                businessUnit: businessUnitId
            }).unwrap();

            toast.success("Leave requested successfully");
            setIsDialogOpen(false);
            refetch();
            setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create request");
        }
    }

    const columns: ColumnDef<any>[] = [
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
            accessorKey: "leaveType",
            header: "Type",
            cell: ({ row }) => row.original.leaveType?.name || "N/A"
        },
        {
            header: "Dates",
            cell: ({ row }) => (
                <div className="text-sm">
                    {format(new Date(row.original.startDate), "MMM dd")} - {format(new Date(row.original.endDate), "MMM dd")}
                    <div className="text-xs text-muted-foreground">{row.original.days} Days</div>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const colors: any = {
                    pending: "secondary",
                    approved: "default",
                    rejected: "destructive",
                    cancelled: "outline"
                };
                return <Badge variant={colors[row.original.status] || "outline"} className="capitalize">{row.original.status}</Badge>
            }
        },
        {
            accessorKey: "reason",
            header: "Reason",
            cell: ({ row }) => <span className="text-sm truncate max-w-[150px] inline-block" title={row.original.reason}>{row.original.reason}</span>
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                // Show actions only for pending request
                if (row.original.status === 'pending') {
                    return (
                        <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleAction(row.original._id, 'approved')}>
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(row.original._id, 'rejected')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
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
                        <FileText className="h-5 w-5" />
                        Leave Requests
                    </CardTitle>
                    <CardDescription>Manage staff leave applications.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Leave</DialogTitle>
                            <DialogDescription>Submit a new leave application.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Leave Type ID</Label>
                                <Input
                                    placeholder="Enter Leave Type Object ID"
                                    value={formData.leaveType}
                                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Admin Note: Enter a valid LeaveType ID.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Textarea
                                    placeholder="Reason for leave..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Submit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={leavesData?.data || []}
                    isLoading={isLoading}
                    searchKey="status"
                />
            </CardContent>
        </Card>
    )
}
