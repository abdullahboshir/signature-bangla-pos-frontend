"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Truck, MoreHorizontal, Search, Trash, Edit, Building } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { FieldConfig } from "@/types/auto-form";
import {
    useGetSuppliersQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation
} from "@/redux/api/supplierApi";
import { toast } from "sonner";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { Badge } from "@/components/ui/badge";

export const SupplierList = () => {
    // Auth & Context
    const { user: currentUser } = useAuth();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;
    const isSuperAdmin = currentUser?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    const { currentBusinessUnit: contextBusinessUnit } = useCurrentBusinessUnit();
    const effectiveBusinessUnitId = isSuperAdmin ? undefined : (contextBusinessUnit?._id || contextBusinessUnit?.id);

    // RTK Query Hooks
    // Assuming supplierApi supports filtering by businessUnit if param provided
    const { data: suppliersResponse, isLoading: isSuppliersLoading } = useGetSuppliersQuery({ businessUnit: isSuperAdmin ? undefined : paramBusinessUnit });
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    const [createSupplier] = useCreateSupplierMutation();
    const [updateSupplier] = useUpdateSupplierMutation();
    const [deleteSupplier] = useDeleteSupplierMutation();

    // Derived state from RTK Query data
    const suppliers = suppliersResponse?.data || [];
    const loading = isSuppliersLoading;
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const handleCreate = () => {
        setSelectedSupplier(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (supplier: any) => {
        setSelectedSupplier(supplier);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await deleteSupplier(id).unwrap();
            if (res.success || res.data) {
                toast.success("Supplier deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete supplier");
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // Processing Business Units
            let targetBusinessUnits: string[] = [];
            if (isSuperAdmin) {
                if (values.businessUnits) {
                    targetBusinessUnits = Array.isArray(values.businessUnits) ? values.businessUnits : [values.businessUnits];
                }
            } else if (effectiveBusinessUnitId) {
                targetBusinessUnits = [effectiveBusinessUnitId];
            }

            // Ideally update payload to include businessUnits if backend logic requires it explicitly in list
            values.businessUnits = targetBusinessUnits;

            if (modalMode === 'create') {
                const res = await createSupplier(values).unwrap();
                if (res.success || res.data) {
                    toast.success("Supplier created successfully");
                }
            } else {
                const res = await updateSupplier({ id: selectedSupplier._id, body: values }).unwrap();
                if (res.success || res.data) {
                    toast.success("Supplier updated successfully");
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${modalMode} supplier`);
        }
    };

    const supplierFields: FieldConfig[] = [
        ...(isSuperAdmin ? [{
            name: "businessUnits",
            label: "Business Unit Access",
            type: "select",
            options: businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id })),
            required: false,
            placeholder: "Select Business Unit (Optional)"
        } as FieldConfig] : []),
        {
            name: "id",
            label: "Supplier ID (Optional)",
            type: "text",
            placeholder: "Leave empty for auto-generate",
        },
        {
            name: "name",
            label: "Supplier Name",
            type: "text",
            required: true,
        },
        {
            name: "contactPerson",
            label: "Contact Person",
            type: "text",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
        },
        {
            name: "address.street",
            label: "Street Address",
            type: "text",
        },
        {
            name: "address.city",
            label: "City",
            type: "text",
        },
        {
            name: "address.country",
            label: "Country",
            type: "text",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
            ],
            defaultValue: "active"
        }
    ];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "contactPerson",
            header: "Contact Person",
        },
        {
            accessorKey: "businessUnits",
            header: "Business Unit",
            cell: ({ row }) => {
                if (!row.original.businessUnits || row.original.businessUnits.length === 0) return <span className="text-xs text-muted-foreground">Global</span>;
                return <div className="flex flex-wrap gap-1">
                    {row.original.businessUnits.slice(0, 2).map((bu: any) => (
                        <Badge variant="outline" className="text-[10px]" key={typeof bu === 'string' ? bu : bu._id}>
                            {typeof bu === 'object' ? bu.name : 'Unknown BU'}
                        </Badge>
                    ))}
                    {row.original.businessUnits.length > 2 && <span className="text-xs">+{row.original.businessUnits.length - 2}</span>}
                </div>
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{row.original.phone}</span>
                </div>
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
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original._id)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const filteredSuppliers = suppliers.filter((s: any) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DataPageLayout
            title="Suppliers"
            description="Manage supplier relationships."
            createAction={{
                label: "Add Supplier",
                onClick: handleCreate
            }}
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Suppliers"
                        value={suppliers.length}
                        icon={Truck}
                    />
                </div>
            }
            extraFilters={
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suppliers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
        >
            <DataTable columns={columns} data={filteredSuppliers} isLoading={loading} />

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "Add Supplier" : "Edit Supplier"}
                fields={supplierFields}
                onSubmit={handleSubmit}
                initialValues={selectedSupplier}
                submitLabel={modalMode === 'create' ? "Create Supplier" : "Update Supplier"}
            />
        </DataPageLayout>
    );
}
