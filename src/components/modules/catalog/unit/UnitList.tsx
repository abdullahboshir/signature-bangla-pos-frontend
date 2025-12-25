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

import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { useCreateUnitMutation, useDeleteUnitMutation, useGetUnitsQuery, useUpdateUnitMutation } from "@/redux/api/unitApi";
import { toast } from "sonner";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi"; // Using consistent API
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

interface Unit {
    _id: string;
    name: string;
    symbol: string;
    status: string;
}

export const UnitList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    // Filter Logic
    const businessUnit = isSuperAdmin ? (paramBusinessUnit || undefined) : paramBusinessUnit;

    // RTK Query Hooks
    const { data: units = [], isLoading } = useGetUnitsQuery({ businessUnit: paramBusinessUnit });
    const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
    const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
    const [deleteUnit] = useDeleteUnitMutation();

    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this unit?")) return;
        try {
            await deleteUnit(id).unwrap();
            toast.success("Unit deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete unit");
        }
    };

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
                        {hasPermission(PERMISSION_KEYS.UNIT.UPDATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingUnit(row.original);
                                setCreateModalOpen(true);
                            }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Unit
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.UNIT.DELETE) && (
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
            { name: "name", label: "Unit Name", type: "text", required: true, placeholder: "e.g. Kilogram" },
            { name: "symbol", label: "Symbol", type: "text", required: true, placeholder: "e.g. kg" },
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
                name: "businessUnit", // Changed from relatedBusinessTypes to align with "Same System"
                label: "Business Unit",
                type: "select",
                options: options,
                placeholder: "Select Business Unit",
                disabled: false
            });
        }

        return fields;
    };

    const handleSubmit = async (data: any) => {
        try {
            let submissionData = { ...data };

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


            if (editingUnit) {
                await updateUnit({ id: editingUnit._id, body: submissionData }).unwrap();
                toast.success("Unit updated successfully");
            } else {
                await createUnit(submissionData).unwrap();
                toast.success("Unit created successfully");
            }
            setCreateModalOpen(false);
            setEditingUnit(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    // Helper for default values
    const getDefaultValues = () => {
        if (editingUnit) {
            return {
                ...editingUnit,
                businessUnit: (editingUnit as any).businessUnit || "global"
            };
        }
        return {
            status: 'active',
            businessUnit: isSuperAdmin ? (paramBusinessUnit ? businessUnits.find((b: any) => b.slug === paramBusinessUnit || b._id === paramBusinessUnit)?._id : "global") : "global"
        };
    };

    return (
        <>
            <DataPageLayout
                title="Measurement Units"
                description="Manage product measurement units (e.g., kg, pcs)."
                createAction={hasPermission(PERMISSION_KEYS.UNIT.CREATE) ? {
                    label: "Add Measurement Unit",
                    onClick: () => {
                        setEditingUnit(null);
                        setCreateModalOpen(true);
                    }
                } : undefined}
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
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
                submitLabel={editingUnit ? "Update Unit" : "Create Unit"}
            />
        </>
    );
}
