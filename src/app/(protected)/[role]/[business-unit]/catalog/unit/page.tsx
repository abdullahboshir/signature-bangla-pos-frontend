"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Edit, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Swal from "sweetalert2";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { useCreateUnitMutation, useDeleteUnitMutation, useGetUnitsQuery, useUpdateUnitMutation } from "@/redux/api/unitApi";
import { toast } from "sonner";
import { useGetBusinessUnitsQuery } from "@/redux/api/adminApi";

interface Unit {
    _id: string;
    name: string;
    symbol: string;
    status: string;
}

export default function UnitsPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    // RTK Query Hooks
    const { data: units = [], isLoading } = useGetUnitsQuery({});
    const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
    const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
    const [deleteUnit] = useDeleteUnitMutation();

    // Fetch Business Units for options
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery(undefined);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await deleteUnit(id).unwrap();
                Swal.fire({
                    title: "Deleted!",
                    text: "Unit has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error: any) {
                console.error("Delete failed", error);
                Swal.fire("Error!", error?.data?.message || "Failed to delete unit.", "error");
            }
        }
    };

    const buOptions = Array.isArray(businessUnits) ? businessUnits.map((bu: any) => ({
        label: bu.name,
        value: bu.name // Or ID depending on backend expectation, verified previously likely name/slug is fine for resolution
    })) : [];

    // Define Columns
    const columns: ColumnDef<Unit>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "symbol",
            header: "Symbol",
            cell: ({ row }) => row.original.symbol,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            setEditingUnit(row.original);
                            setCreateModalOpen(true);
                        }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Unit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(row.original._id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const handleSubmit = async (data: any) => {
        try {
            if (editingUnit) {
                await updateUnit({ id: editingUnit._id, body: data }).unwrap();
                toast.success("Unit updated successfully");
            } else {
                await createUnit(data).unwrap();
                toast.success("Unit created successfully");
            }
            setCreateModalOpen(false);
            setEditingUnit(null);
        } catch (error: any) {
            console.error("Operation failed", error);
            toast.error(error?.data?.message || "Failed to save unit");
        }
    };

    const createUnitFields: any[] = [
        { name: "name", label: "Unit Name", type: "text", required: true, placeholder: "e.g. Kilogram" },
        { name: "symbol", label: "Symbol", type: "text", required: true, placeholder: "e.g. kg" },
        {
            name: "relatedBusinessTypes",
            label: "Business Types (Optional)",
            type: "multi-select",
            options: buOptions,
            placeholder: "Select business types..."
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
            ],
            defaultValue: "active"
        }
    ];

    return (
        <>
            <DataPageLayout
                title="Measurement Units"
                description="Manage product measurement units (e.g., kg, pcs)."
                createAction={{
                    label: "Add Measurement Unit",
                    onClick: () => {
                        setEditingUnit(null);
                        setCreateModalOpen(true);
                    }
                }}
                stats={
                    <div className="flex flex-row gap-4">
                        <StatCard
                            title="Total Units"
                            value={units.length}
                            icon={Package}
                        />
                        <StatCard
                            title="Active Units"
                            value={units.filter((u: any) => u.status === 'active').length}
                            icon={CheckCircle}
                        />
                    </div>
                }
            >
                <DataTable
                    columns={columns}
                    data={units}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </DataPageLayout>

            <AutoFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                title={editingUnit ? "Edit Measurement Unit" : "Create Measurement Unit"}
                description="Define a new measurement unit for products."
                fields={createUnitFields}
                defaultValues={editingUnit || { status: 'active' }}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
                submitLabel={editingUnit ? "Update Unit" : "Create Unit"}
            />
        </>
    );
}
