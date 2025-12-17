"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Truck, MoreHorizontal, Search, Trash, Edit } from "lucide-react";
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
import { axiosInstance as api } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { currentBusinessUnit } = useCurrentBusinessUnit();

    useEffect(() => {
        fetchSuppliers();
    }, [currentBusinessUnit]);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/suppliers');
            if (res.success) {
                setSuppliers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch suppliers", error);
        } finally {
            setLoading(false);
        }
    };

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
            const res = await api.delete(`/super-admin/suppliers/${id}`);
            if (res.success) {
                toast.success("Supplier deleted successfully");
                fetchSuppliers();
            }
        } catch (error) {
            toast.error("Failed to delete supplier");
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // Ensure business unit is attached
            if (currentBusinessUnit) {
                values.businessUnits = [currentBusinessUnit.id || currentBusinessUnit._id];
            }

            if (modalMode === 'create') {
                const res = await api.post('/super-admin/suppliers/create', values);
                if (res.success) {
                    toast.success("Supplier created successfully");
                }
            } else {
                const res = await api.patch(`/super-admin/suppliers/${selectedSupplier._id}`, values);
                if (res.success) {
                    toast.success("Supplier updated successfully");
                }
            }
            setIsModalOpen(false);
            fetchSuppliers();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${modalMode} supplier`);
        }
    };

    const supplierFields: FieldConfig[] = [
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

    const filteredSuppliers = suppliers.filter(s =>
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
