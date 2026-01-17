"use client"

import { useState } from "react"
import { usePermissions } from "@/hooks/usePermissions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"
import {
    useGetVehiclesQuery,
    useCreateVehicleMutation,
    useUpdateVehicleMutation,
    useDeleteVehicleMutation
} from "@/redux/api/erp/logistics/vehicleApi"
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from "@/constant/logistics.constant"

export default function VehicleList() {
    const { hasPermission: can } = usePermissions()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)

    const { data: vehicles = [], isLoading } = useGetVehiclesQuery({})
    const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation()
    const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation()
    const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation()

    const handleCreate = async (data: any) => {
        try {
            await createVehicle(data).unwrap()
            toast.success("Vehicle added successfully")
            setIsModalOpen(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add vehicle")
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            await updateVehicle({ id: selectedVehicle._id, body: data }).unwrap()
            toast.success("Vehicle updated successfully")
            setIsModalOpen(false)
            setSelectedVehicle(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update vehicle")
        }
    }

    const handleDelete = async () => {
        if (!vehicleToDelete) return
        try {
            await deleteVehicle(vehicleToDelete).unwrap()
            toast.success("Vehicle deleted successfully")
            setIsConfirmOpen(false)
            setVehicleToDelete(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete vehicle")
        }
    }

    const columns = [
        { accessorKey: "registrationNumber", header: "Reg. Number" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "capacity", header: "Capacity" },
        { accessorKey: "status", header: "Status" },
        {
            id: "actions",
            cell: ({ row }: any) => {
                const vehicle = row.original
                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedVehicle(vehicle)
                                setIsModalOpen(true)
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setVehicleToDelete(vehicle._id)
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
                    <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
                    <p className="text-muted-foreground">
                        Manage organization vehicles.
                    </p>
                </div>
                <Button onClick={() => {
                    setSelectedVehicle(null)
                    setIsModalOpen(true)
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle List</CardTitle>
                    <CardDescription>All fleet vehicles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={vehicles}
                        searchKey="registrationNumber"
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedVehicle(null)
                }}
                title={selectedVehicle ? "Edit Vehicle" : "Add Vehicle"}
                onSubmit={selectedVehicle ? (handleUpdate as any) : (handleCreate as any)}
                defaultValues={selectedVehicle || { status: 'active', type: 'truck' }}
                isLoading={isCreating || isUpdating}
                fields={[
                    {
                        name: "registrationNumber",
                        label: "Registration Number",
                        type: "text",
                        required: true,
                        placeholder: "DHAKA-METRO-KA-11-2233"
                    },
                    {
                        name: "type",
                        label: "Vehicle Type",
                        type: "select",
                        options: VEHICLE_TYPE_OPTIONS,
                        required: true
                    },
                    {
                        name: "capacity",
                        label: "Capacity (KG)",
                        type: "number",
                        required: true,
                        placeholder: "1000"
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: VEHICLE_STATUS_OPTIONS,
                        required: true
                    }
                ]}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Vehicle"
                description="Are you sure? This vehicle will be removed."
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
