"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Pencil, Trash2, MoreHorizontal, ShieldCheck, Plus, Search } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { AutoFormModal } from "@/components/shared/AutoFormModal"
import { DataTable } from "@/components/shared/DataTable"
import { DataPageLayout } from "@/components/shared/DataPageLayout"
import { ModuleMultiSelect } from "@/components/forms/module-multi-select"

import {
    useGetWarrantiesQuery,
    useCreateWarrantyMutation,
    useUpdateWarrantyMutation,
    useDeleteWarrantyMutation
} from "@/redux/api/catalog/warrantyApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export default function WarrantyList() {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { hasPermission, isSuperAdmin } = usePermissions();
    const businessUnit = paramBusinessUnit;

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // RTK Query Hooks
    const { data: warranties = [], isLoading } = useGetWarrantiesQuery({ businessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createItem, { isLoading: isCreating }] = useCreateWarrantyMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateWarrantyMutation();
    const [deleteItem] = useDeleteWarrantyMutation();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this warranty policy?")) return;
        try {
            await deleteItem(id).unwrap();
            toast.success("Warranty policy deleted");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete warranty");
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Warranty Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({ row }) => (
                <span>
                    {row.original.duration} {row.original.periodUnit}
                </span>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize">
                    {row.original.type}
                </Badge>
            ),
        },
        {
            accessorKey: "availableModules",
            header: "Modules",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.availableModules?.map((mod: string) => (
                        <Badge key={mod} variant="secondary" className="text-[10px] uppercase">
                            {mod}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? "default" : "secondary"}>
                    {row.original.isActive ? "Active" : "Inactive"}
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {hasPermission(PERMISSION_KEYS.WARRANTY.UPDATE) && (
                            <DropdownMenuItem onClick={() => {
                                setEditingItem(row.original);
                                setIsModalOpen(true);
                            }}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        )}
                        {hasPermission(PERMISSION_KEYS.WARRANTY.DELETE) && (
                            <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-destructive">
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
            { name: "name", label: "Warranty Name", type: "text", required: true, placeholder: "e.g. 1 Year Replacement" },
            { 
                name: "type", 
                label: "Warranty Type", 
                type: "select", 
                required: true,
                options: [
                    { label: "Seller Warranty", value: "seller" },
                    { label: "Manufacturer Warranty", value: "manufacturer" },
                    { label: "Brand Warranty", value: "brand" }
                ]
            },
            {
                name: "duration",
                label: "Duration",
                type: "number",
                required: true,
                placeholder: "e.g. 12"
            },
            {
                name: "periodUnit",
                label: "Period Unit",
                type: "select",
                required: true,
                options: [
                    { label: "Days", value: "days" },
                    { label: "Weeks", value: "weeks" },
                    { label: "Months", value: "months" },
                    { label: "Years", value: "years" }
                ],
                defaultValue: "months"
            },
            { name: "description", label: "Description", type: "textarea", placeholder: "Short description" },
            { name: "termsConditions", label: "Terms & Conditions", type: "textarea", placeholder: "Detailed terms" },
            {
                name: "isActive",
                label: "Status",
                type: "select",
                required: true,
                options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }],
                defaultValue: "true"
            }
        ];

        if (isSuperAdmin) {
            let buOptions = [
                { label: "Global (No Business Unit)", value: "global" },
                ...businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id }))
            ];

            if (paramBusinessUnit) {
                const currentBU = businessUnits.find((b: any) => b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit);
                if (currentBU) buOptions = [{ label: currentBU.name, value: currentBU._id }];
            }

            fields.push({
                name: "businessUnit",
                label: "Business Unit",
                type: "select",
                options: buOptions,
                placeholder: "Select Business Unit",
                disabled: !!paramBusinessUnit
            });
        }

        fields.push({
            name: "availableModules",
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

    const getDefaultValues = () => {
        const currentBU = businessUnits.find((b: any) =>
            b.id === paramBusinessUnit || b._id === paramBusinessUnit || b.slug === paramBusinessUnit
        );
        const defaultBUValue = currentBU ? currentBU._id : "global";

        if (editingItem) {
            return {
                ...editingItem,
                isActive: editingItem.isActive ? "true" : "false",
                businessUnit: editingItem.businessUnit?._id || editingItem.businessUnit || defaultBUValue
            };
        }

        return {
            isActive: "true",
            periodUnit: "months",
            type: "seller",
            availableModules: ['pos', 'ecommerce', 'logistics', 'crm', 'marketing', 'integrations'],
            businessUnit: isSuperAdmin ? defaultBUValue : paramBusinessUnit
        };
    };

    const filteredData = Array.isArray(warranties) 
        ? warranties.filter((w: any) => w.name.toLowerCase().includes(search.toLowerCase()))
        : [];

    if (!hasPermission(PERMISSION_KEYS.WARRANTY.READ)) {
        return <div className="p-4 text-center text-muted-foreground">You do not have permission to view warranties.</div>
    }

    return (
        <div>
            <DataPageLayout
                title="Warranties"
                description="Manage product warranty policies."
                createAction={hasPermission(PERMISSION_KEYS.WARRANTY.CREATE) ? {
                    label: "Add Warranty",
                    onClick: () => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }
                } : undefined}
                extraFilters={
                    <div className="relative flex-1 max-w-sm min-w-[200px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search warranties..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoading}
                />
            </DataPageLayout>

            <AutoFormModal<any>
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={editingItem?._id ? "Edit Warranty" : "Add New Warranty"}
                description="Manage your warranty policies."
                fields={getFields()}
                defaultValues={getDefaultValues()}
                onSubmit={async (data) => {
                    try {
                        const payload = {
                            ...data,
                            isActive: data.isActive === "true",
                            duration: Number(data.duration),
                            businessUnit: data.businessUnit === 'global' ? null : data.businessUnit
                        };

                        if (editingItem?._id) {
                            await updateItem({ id: editingItem._id, body: payload }).unwrap();
                            toast.success("Warranty updated");
                        } else {
                            await createItem(payload).unwrap();
                            toast.success("Warranty created");
                        }
                        setIsModalOpen(false);
                        setEditingItem(null);
                    } catch (error: any) {
                        toast.error(error?.data?.message || "Failed to save warranty");
                    }
                }}
                isLoading={isCreating || isUpdating}
                submitLabel={editingItem?._id ? "Update Warranty" : "Create Warranty"}
            />
        </div>
    )
}
