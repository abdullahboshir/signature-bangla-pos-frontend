"use client"

import { useState } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys" // Ensure keys exist or use generics
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"
import {
    useGetDriversQuery,
    useCreateDriverMutation,
    useUpdateDriverMutation,
    useDeleteDriverMutation
} from "@/redux/api/erp/logistics/driverApi"

export default function DriverList() {
    const { hasPermission: can } = usePermissions()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDriver, setSelectedDriver] = useState<any>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [driverToDelete, setDriverToDelete] = useState<string | null>(null)

    const { data: drivers = [], isLoading } = useGetDriversQuery({})
    const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation()
    const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation()
    const [deleteDriver, { isLoading: isDeleting }] = useDeleteDriverMutation()

    const handleCreate = async (data: any) => {
        try {
            await createDriver(data).unwrap()
            toast.success("Driver added successfully")
            setIsModalOpen(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add driver")
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateDriver({ id: selectedDriver._id, body: data }).unwrap()
            toast.success("Driver updated successfully")
            setIsModalOpen(false)
            setSelectedDriver(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update driver")
        }
    }

    const handleDelete = async () => {
        if (!driverToDelete) return
        try {
            await deleteDriver(driverToDelete).unwrap()
            toast.success("Driver deleted successfully")
            setIsConfirmOpen(false)
            setDriverToDelete(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete driver")
        }
    }

    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "licenseNumber", header: "License #" },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const driver = row.original
                return (
                    <div className="flex justify-end gap-2">
                        {/* Use generic keys if specific ones missing, assuming LOGISTICS group */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedDriver(driver)
                                setIsModalOpen(true)
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setDriverToDelete(driver._id)
                                setIsConfirmOpen(true)
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
                    <p className="text-muted-foreground">
                        Manage logistics drivers.
                    </p>
                </div>
                <Button onClick={() => {
                    setSelectedDriver(null)
                    setIsModalOpen(true)
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Driver
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Driver List</CardTitle>
                    <CardDescription>All registered drivers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={drivers}
                        searchKey="name"
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedDriver(null)
                }}
                title={selectedDriver ? "Edit Driver" : "Add Driver"}
                onSubmit={selectedDriver ? (handleUpdate as any) : (handleCreate as any)}
                defaultValues={selectedDriver || { isActive: true }}
                isLoading={isCreating || isUpdating}
                fields={[
                    {
                        name: "name",
                        label: "Full Name",
                        type: "text",
                        required: true,
                        placeholder: "Driver Name"
                    },
                    {
                        name: "phone",
                        label: "Phone Number",
                        type: "text",
                        required: true,
                        placeholder: "Contact Number"
                    },
                    {
                        name: "licenseNumber",
                        label: "License Number",
                        type: "text",
                        required: true,
                        placeholder: "Driving License"
                    },
                    {
                        name: "isActive",
                        label: "Active Status",
                        type: "select",
                        options: [
                            { label: "Active", value: true },
                            { label: "Inactive", value: false }
                        ] as any,
                        required: true
                    }
                ]}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Driver"
                description="Are you sure? This driver will be removed permanently."
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
