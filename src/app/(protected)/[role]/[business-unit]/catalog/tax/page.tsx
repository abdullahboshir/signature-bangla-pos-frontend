"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MoreHorizontal, Trash2, Edit, RefreshCw, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    useGetTaxesQuery,
    useDeleteTaxMutation,
    useCreateTaxMutation
} from "@/redux/api/taxApi";
import Swal from "sweetalert2";
import { ITax } from "@/types/catalog";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
import { AutoFormModal } from "@/components/shared/AutoFormModal";

export default function TaxPage() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const { data: taxesResponse, isLoading: isTaxesLoading } = useGetTaxesQuery(undefined);
    const [deleteTax] = useDeleteTaxMutation();
    const [createTax] = useCreateTaxMutation();

    const taxes: ITax[] = taxesResponse || [];
    const isLoading = isTaxesLoading;

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
                // RTK Query mutation
                const res: any = await deleteTax(id).unwrap();
                if (res?.success || res?.data) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Tax has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error("Delete failed", error);
                Swal.fire("Error!", "Failed to delete tax.", "error");
            }
        }
    };

    const filteredTaxes = taxes.filter((tax) =>
        tax.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const createTaxFields: any[] = [
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

    const handleCreateTax = async (data: any) => {
        try {
            setIsCreating(true);
            const payload = {
                ...data,
                rate: Number(data.rate),
                isActive: data.status === 'active'
            };

            const response: any = await createTax(payload).unwrap();

            if (response?.success || response?.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tax created successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                setCreateModalOpen(false);
            }
        } catch (error: any) {
            console.error("Create tax error", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed to create tax"
            });
        } finally {
            setIsCreating(false);
        }
    };

    // Define Columns
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
            cell: ({ row }) => row.original.rate,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
        },
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
                        <DropdownMenuItem onClick={() => router.push(`${pathname}/${row.original._id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Tax
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

    return (
        <>
            <DataPageLayout
                title="Taxes"
                description="Manage validation taxes and rates."
                createAction={{
                    label: "Add New Tax",
                    onClick: () => setCreateModalOpen(true)
                }}
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
                extraFilters={
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Input
                                placeholder="Search taxes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchTaxes}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                    </div>
                }
            >
                <DataTable columns={columns} data={filteredTaxes} isLoading={isLoading} />
            </DataPageLayout>

            <AutoFormModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                title="Create New Tax"
                description="Add a new tax rate to the system."
                fields={createTaxFields}
                onSubmit={handleCreateTax}
                isLoading={isCreating}
                submitLabel="Create Tax"
            />
        </>
    );
}
