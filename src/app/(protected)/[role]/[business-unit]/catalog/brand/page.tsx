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
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { ColumnDef } from "@tanstack/react-table";
import { useCreateBrandMutation, useDeleteBrandMutation, useGetBrandsQuery, useUpdateBrandMutation } from "@/redux/api/brandApi";
import { toast } from "sonner";

interface Brand {
    _id: string;
    name: string;
    description?: string;
    website?: string;
    status: string;
    createdAt?: string;
}

export default function BrandsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    // RTK Query Hooks
    const { data: brands = [], isLoading } = useGetBrandsQuery({ limit: 1000 }); // Fetch all for now
    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();

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
                await deleteBrand(id).unwrap();
                Swal.fire({
                    title: "Deleted!",
                    text: "Brand has been deleted.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error: any) {
                console.error("Delete failed", error);
                Swal.fire("Error!", error?.data?.message || "Failed to delete brand.", "error");
            }
        }
    };

    // Define Columns
    const columns: ColumnDef<Brand>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "website",
            header: "Website",
            cell: ({ row }) => row.original.website || 'N/A',
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
                            setEditingBrand(row.original);
                            setIsCreateOpen(true);
                        }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Brand
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
            if (editingBrand) {
                await updateBrand({ id: editingBrand._id, body: data }).unwrap();
                toast.success("Brand updated successfully");
            } else {
                await createBrand(data).unwrap();
                toast.success("Brand created successfully");
            }
            setIsCreateOpen(false);
            setEditingBrand(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to save brand");
        }
    };

    return (
        <>
            <DataPageLayout
                title="Brands"
                description="Manage product brands."
                createAction={{
                    label: "Add New Brand",
                    onClick: () => {
                        setEditingBrand(null);
                        setIsCreateOpen(true);
                    }
                }}
                stats={
                    <>
                        <StatCard
                            title="Total Brands"
                            value={brands.length}
                            icon={Package}
                        />
                        <StatCard
                            title="Active Brands"
                            value={brands.filter((b: any) => b.status === 'active').length}
                            icon={CheckCircle}
                        />
                    </>
                }
            >
                <DataTable
                    columns={columns}
                    data={brands}
                    isLoading={isLoading}
                    searchKey="name"
                />
            </DataPageLayout>

            <AutoFormModal<Brand>
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingBrand ? "Edit Brand" : "Add New Brand"}
                description="Manage product brands."
                fields={[
                    { name: "name", label: "Name", type: "text", required: true, placeholder: "Brand Name" },
                    { name: "website", label: "Website", type: "text", placeholder: "https://example.com" },
                    { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
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
                defaultValues={editingBrand || { status: "active" }}
                onSubmit={handleSubmit}
                submitLabel={isCreating || isUpdating ? (editingBrand ? "Updating..." : "Creating...") : (editingBrand ? "Update Brand" : "Create Brand")}
            />
        </>
    );
}
