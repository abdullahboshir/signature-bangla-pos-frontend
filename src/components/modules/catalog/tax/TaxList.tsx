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

import { useGetTaxsQuery, useDeleteTaxMutation, useCreateTaxMutation, useUpdateTaxMutation } from "@/redux/api/finance/taxApi"; // Added update hook if exists?
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

interface ITax {
    _id: string;
    name: string;
    rate: number;
    type: 'percentage' | 'fixed';
    isActive: boolean;
    isDefault?: boolean;
}

import { useParams } from "next/navigation";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";

export const TaxList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const { isSuperAdmin } = usePermissions();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState<ITax | null>(null);

    // RTK Query Hooks
    const { data: taxesResponse, isLoading: isTaxesLoading } = useGetTaxsQuery({ businessUnit: paramBusinessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [deleteTax] = useDeleteTaxMutation();
    const [createTax, { isLoading: isCreating }] = useCreateTaxMutation();
    const [updateTax, { isLoading: isUpdating }] = useUpdateTaxMutation(); // Assumed available or will be added if missing in API

    const taxes: ITax[] = taxesResponse || [];

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tax?")) return;
        try {
            await deleteTax(id).unwrap();
            toast.success("Tax deleted successfully");
        } catch (error) {
            toast.error("Failed to delete tax");
        }
    };

    const handleEdit = (tax: ITax) => {
        setEditingTax(tax);
        setCreateModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            let submissionData = {
                ...data,
                rate: Number(data.rate),
                isActive: data.status === 'active'
            };

            // BU Logic
            let targetBU = "";

            if (isSuperAdmin && data.businessUnit) {
                targetBU = data.businessUnit;
            } else if (paramBusinessUnit) {
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


            if (editingTax) {
                await updateTax({ id: editingTax._id, body: submissionData }).unwrap();
                toast.success("Tax updated successfully");
            } else {
                await createTax(submissionData).unwrap();
                toast.success("Tax created successfully");
            }
            setCreateModalOpen(false);
            setEditingTax(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    const columns: ColumnDef<ITax>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.name}
                    {row.original.isDefault && <Badge variant="outline" className="ml-2">Default</Badge>}
                </span>
            ),
        },
        {
            accessorKey: "rate",
            header: "Rate",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
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
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
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
                        {hasPermission(PERMISSION_KEYS.TAX.UPDATE) && (
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Tax
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.TAX.DELETE) && (
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-red-600">
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
            { name: "name", label: "Tax Name", type: "text", required: true, placeholder: "e.g. VAT" },
            { name: "rate", label: "Rate (%)", type: "number", required: true, placeholder: "15" },
            {
                name: "type",
                label: "Type",
                type: "select",
                required: true,
                options: [
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed", value: "fixed" }
                ],
                defaultValue: "percentage"
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

        if (isSuperAdmin) {
            let options = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({
                    label: bu.name,
                    value: bu._id
                }))
            ];
            // Scoped View for Super Admin
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
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: options,
                placeholder: "Select Business Unit",
                disabled: false
            });
        }
        return fields;
    };

    const getDefaultValues = () => {
        if (editingTax) {
            return {
                ...editingTax,
                status: editingTax.isActive ? 'active' : 'inactive',
                businessUnit: (editingTax as any).businessUnit || "global"
            };
        }
        return {
            status: "active",
            type: 'percentage',
            businessUnit: isSuperAdmin ? (paramBusinessUnit ? businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit)?._id : "global") : "global"
        }
    };

    return (
        <>
            <DataPageLayout
                title="Taxes"
                description="Manage validation taxes and rates."
                createAction={hasPermission(PERMISSION_KEYS.TAX.CREATE) ? {
                    label: "Add New Tax",
                    onClick: () => {
                        setEditingTax(null);
                        setCreateModalOpen(true);
                    }
                } : undefined}
                stats={
                    <div className="flex flex-row gap-4">
                        <StatCard
                            title="Total Taxes"
                            value={taxes.length}
                            icon={Package}
                        />
                        <StatCard
                            title="Active Taxes"
                            value={taxes.filter(t => t.isActive).length}
                            icon={CheckCircle}
                        />
                    </div>
                }
            >
                <DataTable columns={columns} data={taxes} isLoading={isTaxesLoading} searchKey="name" />
            </DataPageLayout>

            <AutoFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                title={editingTax ? "Edit Tax" : "Create New Tax"}
                description="Tax rate definition."
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={handleSubmit}
                isLoading={isCreating} // TODO: Add isUpdating if hook works
                submitLabel={editingTax ? "Update Tax" : "Create Tax"}
            />
        </>
    );
}

