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

import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { TagInput } from "@/components/shared/TagInput";
import { ColumnDef } from "@tanstack/react-table";
import { useCreateAttributeMutation, useDeleteAttributeMutation, useGetAttributesQuery, useUpdateAttributeMutation } from "@/redux/api/catalog/attributeApi";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

interface Attribute {
    id: string;
    _id: string;
    name: string;
    values: string[];
    status: string;
    createdAt?: string;
}

import { useParams } from "next/navigation";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";

export const AttributeList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const { isSuperAdmin } = usePermissions();

    // Attributes usually global. If businessUnit logic needed, can be added here.
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);

    // Filter
    const businessUnit = isSuperAdmin ? (paramBusinessUnit || undefined) : paramBusinessUnit;

    // RTK Query Hooks
    const { data: attributes = [], isLoading } = useGetAttributesQuery({ limit: 1000, businessUnit: paramBusinessUnit });
    const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
    const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();
    const [deleteAttribute] = useDeleteAttributeMutation();

    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this attribute?")) return;
        try {
            await deleteAttribute(id).unwrap();
            toast.success("Attribute deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete attribute");
        }
    };

    // Columns ...
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
        // Add BU Column if SA
        ...(isSuperAdmin ? [{
            accessorKey: "businessUnit",
            header: "Business Unit",
            cell: ({ row }: any) => {
                const bu = row.original.businessUnit;
                if (!bu) return <span className="text-muted-foreground text-xs">Global</span>;

                let buName = "";
                if (typeof bu === 'object' && (bu as any).name) {
                    buName = (bu as any).name;
                } else {
                    const matched = businessUnits.find((b: any) => b._id === bu || b.id === bu);
                    buName = matched ? matched.name : (bu as string);
                }
                return <span className="text-xs">{buName}</span>;
            },
        }] : []),
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
                        {hasPermission(PERMISSION_KEYS.ATTRIBUTE.UPDATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingAttribute(row.original);
                                setIsCreateOpen(true);
                            }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.ATTRIBUTE.DELETE) && (
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(row.original._id || row.original.id)}
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
            { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Size, Color" },
            {
                name: "values",
                label: "Values",
                type: "custom",
                required: true,
                render: ({ control, name }: any) => (
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
                        { label: "Global (No Business Unit)", value: "global" },
                        { label: currentBU.name, value: currentBU._id }
                    ];
                }
                isBusinessUnitDisabled = true;
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: options,
                placeholder: "Select Business Unit",
                disabled: isBusinessUnitDisabled // Always enable for Super Admin so they can switch between Global/Scoped
            });
        }
        return fields;
    };

    const handleSubmit = async (data: any) => {
        try {
            let submissionData = { ...data };

            // BU Logic
            let targetBU = "";

            // Super Admin can choose explicitly (Global or Specific)
            if (isSuperAdmin && data.businessUnit) {
                targetBU = data.businessUnit;
            }
            // Standard Admin / Fallback: Enforce Scope
            else if (paramBusinessUnit) {
                const matched = businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit || b.id === paramBusinessUnit);
                targetBU = matched ? matched._id : paramBusinessUnit;
            }

            if (targetBU === 'global') targetBU = "";
            if (targetBU) {
                submissionData.businessUnit = targetBU;
            } else {
                submissionData.businessUnit = null;
            }
            if (submissionData.businessUnit === undefined) submissionData.businessUnit = null;

            if (editingAttribute) {
                await updateAttribute({ id: editingAttribute._id || editingAttribute.id, body: submissionData }).unwrap();
                toast.success("Attribute updated successfully");
            } else {
                await createAttribute(submissionData).unwrap();
                toast.success("Attribute created successfully");
            }
            setIsCreateOpen(false);
            setEditingAttribute(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    const getDefaultValues = () => {
        if (editingAttribute) {
            return {
                ...editingAttribute,
                status: editingAttribute.status || "active",
                businessUnit: (editingAttribute as any).businessUnit || "global"
            };
        }
        return {
            status: "active",
            values: [],
            businessUnit: isSuperAdmin ? (paramBusinessUnit ? businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit)?._id : "global") : "global"
        }
    };

    return (
        <>
            <DataPageLayout
                title="Product Attributes"
                description="Manage global attributes like Size, Color, etc."
                createAction={hasPermission(PERMISSION_KEYS.ATTRIBUTE.CREATE) ? {
                    label: "Add New Attribute",
                    onClick: () => {
                        setEditingAttribute(null);
                        setIsCreateOpen(true);
                    }
                } : undefined}
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
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={handleSubmit}
                submitLabel={isCreating || isUpdating ? (editingAttribute ? "Updating..." : "Creating...") : (editingAttribute ? "Update" : "Create")}
            />
        </>
    );
}

