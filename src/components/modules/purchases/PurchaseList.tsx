"use client"

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Clock, MoreHorizontal, Edit, Trash, Building } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { StatCard } from "@/components/shared/StatCard";
import { ColumnDef } from "@tanstack/react-table";
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
    useGetPurchasesQuery,
    useCreatePurchaseMutation,
    useUpdatePurchaseMutation,
    useDeletePurchaseMutation
} from "@/redux/api/purchaseApi";
import { useGetSuppliersQuery } from "@/redux/api/supplierApi";
import { toast } from "sonner";
import { PurchaseItemsField } from "./components/PurchaseItemsField";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/businessUnitApi";
import { useGetAllOutletsQuery } from "@/redux/api/outletApi";

const statusColors = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    received: "bg-green-500/10 text-green-500 border-green-500/20",
    ordered: "bg-blue-500/10 text-blue-500 border-blue-500/20",
} as const;

export const PurchaseList = () => {
    // Auth & Context
    const { user } = useAuth();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    // SA Business Unit Selection logic already in other lists, mimicking here
    // But AutoFormModal usually handles form state.
    // For listing:
    const businessUnit = isSuperAdmin ? undefined : paramBusinessUnit; // SA sees all by default, or could enable filter

    // RTK Query Hooks
    const { data: purchasesResponse, isLoading: isPurchasesLoading } = useGetPurchasesQuery({ businessUnit });
    const { data: suppliersResponse } = useGetSuppliersQuery({});
    // Fetch BUs for SA form
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });
    // Fetch Outlets (All or Filtered)
    const { data: outlets = [] } = useGetAllOutletsQuery({
        businessUnit: isSuperAdmin ? undefined : paramBusinessUnit
    });

    const [createPurchase] = useCreatePurchaseMutation();
    const [updatePurchase] = useUpdatePurchaseMutation();
    const [deletePurchase] = useDeletePurchaseMutation();

    // Data normalization
    const purchases = purchasesResponse?.data || (Array.isArray(purchasesResponse) ? purchasesResponse : []) || [];
    const suppliers = suppliersResponse?.data || (Array.isArray(suppliersResponse) ? suppliersResponse : []) || [];
    const loading = isPurchasesLoading;
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const handleCreate = () => {
        setSelectedPurchase({
            purchaseDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            items: [],
            businessUnit: paramBusinessUnit // Pre-fill if known
        });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (purchase: any) => {
        setSelectedPurchase(purchase);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this purchase?")) return;
        try {
            const res = await deletePurchase(id).unwrap();
            if (res.success || res.data) {
                toast.success("Purchase deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete purchase");
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // Validate Business Unit for SA
            if (isSuperAdmin && !values.businessUnit) {
                // If SA didn't pick, maybe valid (global)? Or enforce?
                // Usually purchases belong to a BU.
                // Assuming global is null/undefined.
            } else if (!isSuperAdmin) {
                values.businessUnit = paramBusinessUnit;
            }

            // Calculate totals if items are present
            if (values.items && Array.isArray(values.items)) {
                values.subTotal = values.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
                values.totalAmount = values.subTotal + (values.tax || 0) - (values.discount || 0);
            }

            if (modalMode === 'create') {
                const res = await createPurchase(values).unwrap();
                if (res.success || res.data) {
                    toast.success("Purchase created successfully");
                }
            } else {
                const res = await updatePurchase({ id: selectedPurchase._id, body: values }).unwrap();
                if (res.success || res.data) {
                    toast.success("Purchase updated successfully");
                }
            }
            setIsModalOpen(false);
        } catch (error: any) {
            const msg = error?.data?.message || error?.message || "Failed";
            toast.error(msg);
        }
    };

    const purchaseFields: FieldConfig[] = [
        ...(isSuperAdmin ? [{
            name: "businessUnit",
            label: "Business Unit",
            type: "select",
            options: businessUnits.map((bu: any) => ({ label: bu.name, value: bu._id })),
            required: false, // Optional if Global allowed
            placeholder: "Select Business Unit (Optional)"
        } as FieldConfig] : []),
        {
            name: "supplier",
            label: "Supplier",
            type: "select",
            options: suppliers.map((s: any) => ({ label: s.name, value: s._id || s.id })),
            required: true,
        },
        {
            name: "outlet",
            label: "Outlet",
            type: "select",
            options: outlets.map((o: any) => ({ label: o.name, value: o._id })),
            required: true,
            placeholder: "Select Receiving Outlet"
        },
        {
            name: "purchaseDate",
            label: "Date",
            type: "date",
            required: true,
        },
        {
            name: "dueDate",
            label: "Due Date",
            type: "date",
        },
        {
            name: "referenceNo",
            label: "Reference No",
            type: "text",
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Ordered", value: "ordered" },
                { label: "Received", value: "received" }
            ],
            defaultValue: "pending"
        },
        // Custom Items Field
        {
            name: "items",
            label: "Items",
            type: "custom",
            render: ({ control, name }) => {
                // Watch logic for Business Unit to filter products?
                // For now, let's just use the selectedPurchase's or the form's BU if possible.
                // Ideally useFormContext() inside PurchaseItemsField or pass it.
                // But PurchaseItemsField takes 'businessUnit' prop we added.

                // If isSuperAdmin, we want to watch 'businessUnit' field.
                // But we can't easily hook useWatch here inside array def.
                // We'll pass undefined for now, so it shows all products for SA, or filtered by Token for Role.
                // This is consistent with previous analysis.
                return <PurchaseItemsField control={control} name={name} />
            }
        },
        {
            name: "notes",
            label: "Notes",
            type: "textarea",
        }
    ];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "referenceNo",
            header: "Reference",
            cell: ({ row }) => <div className="flex flex-col">
                <span className="font-semibold">{row.original.referenceNo || row.original.id}</span>
                {/* Show BU if SA */}
                {(isSuperAdmin && row.original.businessUnit) && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {/* We don't have BU name populated in purchase object typically unless populated. 
                             Assuming it might be id or populated object. */}
                        {typeof row.original.businessUnit === 'object' ? row.original.businessUnit.name : "BU"}
                    </span>
                )}
            </div>,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => {
                const s = suppliers.find((sup: any) => sup._id === row.original.supplier || sup.id === row.original.supplier);
                return s ? s.name : "Unknown";
            },
        },
        {
            accessorKey: "purchaseDate",
            header: "Date",
            cell: ({ row }) => row.original.purchaseDate ? new Date(row.original.purchaseDate).toLocaleDateString() : "",
        },
        {
            accessorKey: "totalAmount",
            header: "Amount",
            cell: ({ row }) => <span className="font-semibold">৳{row.original.totalAmount?.toFixed(2)}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant="outline"
                    className={`text-xs ${statusColors[row.original.status as keyof typeof statusColors] || ""}`}
                >
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

    const filteredPurchases = purchases.filter((p: any) =>
        (p.referenceNo && p.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DataPageLayout
            title="Purchases"
            description="Manage your purchase orders and inventory replenishment"
            createAction={{
                label: "New Purchase",
                onClick: handleCreate
            }}
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Purchases"
                        value={purchases.length}
                        icon={ShoppingBag}
                    />
                    <StatCard
                        title="Pending Orders"
                        value={purchases.filter((p: any) => p.status === 'pending').length}
                        icon={Clock}
                    />
                </div>
            }
            extraFilters={
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search purchases..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
        >
            <DataTable columns={columns} data={filteredPurchases} isLoading={loading} />

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title={modalMode === 'create' ? "New Purchase" : "Edit Purchase"}
                fields={purchaseFields}
                onSubmit={handleSubmit}
                initialValues={selectedPurchase}
                submitLabel={modalMode === 'create' ? "Create Purchase" : "Update Purchase"}
            />
        </DataPageLayout>
    );
}
