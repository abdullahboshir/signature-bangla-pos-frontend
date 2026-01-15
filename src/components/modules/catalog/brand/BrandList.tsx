"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { AutoFormModal } from "@/components/shared/AutoFormModal";

import { useCreateBrandMutation, useDeleteBrandMutation, useGetBrandsQuery, useUpdateBrandMutation } from "@/redux/api/catalog/brandApi";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

interface Brand {
    _id: string;
    name: string;
    description?: string;
    website?: string;
    status: string;
    createdAt?: string;
    businessUnit?: string | { _id: string, name: string };
    availableModules?: string[];
}

import { ModuleMultiSelect } from "@/components/forms/module-multi-select";

export const BrandList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const { isSuperAdmin } = usePermissions();

    const businessUnit = isSuperAdmin ? undefined : paramBusinessUnit;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    // RTK Query Hooks
    const { data: brands = [], isLoading } = useGetBrandsQuery({ businessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

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

    const handleSubmit = async (data: any) => {
        try {
            // Handle Business Unit logic
            let submissionData = { ...data };

            // Determine effective BU
            // Determine effective BU
            let targetBU = "";

            if (isSuperAdmin && data.businessUnit) {
                targetBU = data.businessUnit;
            }
            else if (paramBusinessUnit) {
                const matched = businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit || b.id === paramBusinessUnit);
                targetBU = matched ? matched._id : paramBusinessUnit;
            }

            if (targetBU === 'global') targetBU = "";
            if (targetBU) {
                submissionData.businessUnit = targetBU;
            } else {
                submissionData.businessUnit = null; // Global
            }

            // Clean payload
            if (submissionData.businessUnit === undefined) submissionData.businessUnit = null;


            if (editingBrand) {
                await updateBrand({ id: editingBrand._id, body: submissionData }).unwrap();
                toast.success("Brand updated successfully");
            } else {
                await createBrand(submissionData).unwrap();
                toast.success("Brand created successfully");
            }
            setIsCreateOpen(false);
            setEditingBrand(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to save brand");
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
            accessorKey: "businessUnit",
            header: "Business Unit",
            cell: ({ row }) => {
                const bu = row.original.businessUnit;
                if (!bu) return <span className="text-muted-foreground text-xs">Global</span>;

                let buName = "";
                if (typeof bu === 'object' && (bu as any).name) {
                    buName = (bu as any).name;
                } else {
                    // Lookup ID in businessUnits list
                    const matched = businessUnits.find((b: any) => b._id === bu || b.id === bu);
                    buName = matched ? matched.name : (bu as string);
                }

                return <span className="text-xs">{buName}</span>;
            },
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
                        {hasPermission(PERMISSION_KEYS.BRAND.UPDATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingBrand(row.original);
                                setIsCreateOpen(true);
                            }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Brand
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.BRAND.DELETE) && (
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(row.original._id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const getFields = () => {
        const fields: any[] = [
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
        ];

        if (isSuperAdmin) {
            let options = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({
                    label: bu.name,
                    value: bu._id
                }))
            ];

            // Scoped View for Super Admin
            let isBusinessUnitDisabled = false;

            if (paramBusinessUnit) {
                const currentBU = businessUnits.find((b: any) =>
                    b.id === paramBusinessUnit ||
                    b._id === paramBusinessUnit ||
                    b.slug === paramBusinessUnit
                );
                if (currentBU) {
                    options = [
                        { label: "Global (No Business Unit)", value: "global"},
                        { label: currentBU.name, value: currentBU._id }
                    ];
                    isBusinessUnitDisabled = true;
                }
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: options,
                placeholder: "Select Business Unit",
                disabled: isBusinessUnitDisabled
            });
        }
        fields.push({
            name: "availableModules",
            // label: "Available Modules",
            type: "custom",
            render: () => (
                <ModuleMultiSelect
                    name="availableModules"
                    label="Available Modules"
                    placeholder="Select available modules..."
                    include={['pos', 'ecommerce', 'logistics', 'crm', 'marketing', 'integrations']}
                />
            )
        });

        return fields;
    };

    return (
        <>
            <DataPageLayout
                title="Brands"
                description="Manage product brands."
                createAction={hasPermission(PERMISSION_KEYS.BRAND.CREATE) ? {
                    label: "Add New Brand",
                    onClick: () => {
                        setEditingBrand(null);
                        setIsCreateOpen(true);
                    }
                } : undefined}
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

            <AutoFormModal<any>
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title={editingBrand ? "Edit Brand" : "Add New Brand"}
                description="Manage product brands."
                fields={getFields()}
                defaultValues={editingBrand ? {
                    ...editingBrand,
                    availableModules: editingBrand.availableModules || [],
                    businessUnit: (editingBrand.businessUnit as any)?.id || (editingBrand.businessUnit as any)?._id || editingBrand.businessUnit || "global"
                } : {
                    status: "active",
                    availableModules: ['pos', 'ecommerce', 'logistics', 'crm', 'marketing', 'integrations'],
                    businessUnit: isSuperAdmin ? (paramBusinessUnit ? businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit)?._id : "global") : "global"
                }}
                onSubmit={handleSubmit}
                submitLabel={isCreating || isUpdating ? (editingBrand ? "Updating..." : "Creating...") : (editingBrand ? "Update Brand" : "Create Brand")}
            />
        </>
    );
}

