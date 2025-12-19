"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Edit, List, CheckCircle } from "lucide-react";
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
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { TagInput } from "@/components/shared/TagInput";
import { ColumnDef } from "@tanstack/react-table";
import { useCreateAttributeMutation, useDeleteAttributeMutation, useGetAttributesQuery, useUpdateAttributeMutation } from "@/redux/api/attributeApi";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

interface Attribute {
    id: string; // Mongoose returns 'id' from virtual or '_id'
    _id: string;
    name: string;
    values: string[];
    status: string;
    createdAt?: string;
}

export default function AttributesPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);

    // RTK Query Hooks
    const { data: attributes = [], isLoading } = useGetAttributesQuery({ limit: 1000 });
    const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
    const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();
    const [deleteAttribute] = useDeleteAttributeMutation();

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
                await deleteAttribute(id).unwrap();
                Swal.fire({
                    title: "Deleted!",
                    text: "Attribute has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error: any) {
                console.error("Delete failed", error);
                Swal.fire("Error!", error?.data?.message || "Failed to delete attribute.", "error");
            }
        }
    };

    // Define Columns
    const columns: ColumnDef<Attribute>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "values",
            header: "Values",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.values?.slice(0, 5).map((val, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                            {val}
                        </Badge>
                    ))}
                    {row.original.values?.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                            +{row.original.values.length - 5} more
                        </Badge>
                    )}
                </div>
            ),
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
                            setEditingAttribute(row.original);
                            setIsCreateOpen(true);
                        }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(row.original._id || row.original.id)}
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
            if (editingAttribute) {
                await updateAttribute({ id: editingAttribute._id || editingAttribute.id, body: data }).unwrap();
                toast.success("Attribute updated successfully");
            } else {
                await createAttribute(data).unwrap();
                toast.success("Attribute created successfully");
            }
            setIsCreateOpen(false);
            setEditingAttribute(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to save attribute");
        }
    };

    return (
        <>
            <DataPageLayout
                title="Product Attributes"
                description="Manage global attributes like Size, Color, etc."
                createAction={{
                    label: "Add New Attribute",
                    onClick: () => {
                        setEditingAttribute(null);
                        setIsCreateOpen(true);
                    }
                }}
                stats={
                    <>
                        <StatCard
                            title="Total Attributes"
                            value={attributes.length}
                            icon={List}
                        />
                        <StatCard
                            title="Active Attributes"
                            value={attributes.filter((b: any) => b.status === 'active').length}
                            icon={CheckCircle}
                        />
                    </>
                }
            >
                <DataTable
                    columns={columns}
                    data={attributes}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </DataPageLayout>

            <AutoFormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingAttribute ? "Edit Attribute" : "Add New Attribute"}
                description="Define the attribute name and its possible values."
                fields={[
                    { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Size, Color" },
                    {
                        name: "values",
                        label: "Values",
                        type: "custom",
                        required: true,
                        render: ({ control, name }) => (
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: "At least one value is required" }}
                                render={({ field: { value, onChange } }) => (
                                    <TagInput
                                        value={value || []}
                                        onChange={onChange}
                                        placeholder="Type value and press Enter (e.g. Red)"
                                    />
                                )}
                            />
                        )
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" }
                        ],
                        defaultValue: "active",
                        required: true
                    }
                ]}
                defaultValues={editingAttribute || { status: "active", values: [] }}
                onSubmit={handleSubmit}
                submitLabel={isCreating || isUpdating ? (editingAttribute ? "Updating..." : "Creating...") : (editingAttribute ? "Update" : "Create")}
            />
        </>
    );
}
