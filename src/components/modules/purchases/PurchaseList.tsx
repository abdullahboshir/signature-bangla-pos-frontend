"use client"

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutoFormModal } from "@/components/shared/AutoFormModal";
import { FieldConfig } from "@/types/auto-form";
import {
    useGetPurchasesQuery,
    useCreatePurchaseMutation,
    useUpdatePurchaseMutation,
    useDeletePurchaseMutation
} from "@/redux/api/inventory/purchaseApi";
import { useGetSuppliersQuery } from "@/redux/api/contacts/supplierApi";
import { toast } from "sonner";
import { PurchaseItemsField } from "./components/PurchaseItemsField";
import { useAuth } from "@/hooks/useAuth";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetOutletsQuery } from "@/redux/api/organization/outletApi";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

import { PURCHASE_STATUS, PURCHASE_STATUS_OPTIONS, PURCHASE_PAYMENT_STATUS, PURCHASE_PAYMENT_METHOD_OPTIONS } from "@/constant/purchase.constant";

const statusColors = {
    [PURCHASE_STATUS.PENDING]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    [PURCHASE_STATUS.ORDERED]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    [PURCHASE_STATUS.RECEIVED]: "bg-green-500/10 text-green-500 border-green-500/20",
} as const;

export const PurchaseList = () => {
    // Auth & Context
    const { user } = useAuth();
    const { hasPermission, isSuperAdmin } = usePermissions();
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;

    const { currentBusinessUnit: contextBusinessUnit } = useCurrentBusinessUnit();
    // Fetch BUs for SA form AND for resolving ID from slug
    const { data: businessUnits = [] } = useGetBusinessUnitsQuery({ limit: 100 }, { skip: !isSuperAdmin });

    // Helper: Validates if a string is a 24-char MongoDB ObjectId
    const isValidObjectId = (id: any) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

    // Stronger Resolution Logic:
    // 1. Try context _id (ensure it's a valid ObjectId)
    // 2. If SA, context might be incomplete or invalid. params['business-unit'] is the slug.
    //    Look up the slug in the fetched 'businessUnits' list to find the real _id.
    const resolveBusinessUnitId = () => {
        if (contextBusinessUnit?._id && isValidObjectId(contextBusinessUnit._id)) {
            return contextBusinessUnit._id;
        }

        // If context _id is missing OR invalid (like being a slug), try lookup
        if (paramBusinessUnit && isSuperAdmin && businessUnits.length > 0) {
            const found = businessUnits.find((b: any) =>
                b.id === paramBusinessUnit ||
                b.slug === paramBusinessUnit ||
                (b.name && b.name.toLowerCase().replace(/ /g, '-') === paramBusinessUnit)
            );
            if (found?._id && isValidObjectId(found._id)) return found._id;
        }
        return undefined;
    };

    const contextBUId = resolveBusinessUnitId();

    // Determining the filter value:
    // 1. If we have a param (scoped view), we MUST use the resolved ID.
    // 2. If no param (global view) AND Super Admin, we pass undefined (show all).
    // 3. Logic: If param exists, wait for contextBUId.
    const queryBusinessUnit = paramBusinessUnit ? contextBUId : undefined;

    // RTK Query Hooks
    // SKIP the query if we are in a scoped view (param exists) but ID is not yet resolved.
    const { data: purchasesResponse, isLoading: isPurchasesLoading } = useGetPurchasesQuery(
        { businessUnit: queryBusinessUnit },
        { skip: !!paramBusinessUnit && !queryBusinessUnit }
    );

    const { data: suppliersResponse } = useGetSuppliersQuery({});
    // Fetch Outlets (All or Filtered)
    const { data: outlets = [] } = useGetOutletsQuery({
        businessUnit: queryBusinessUnit
    });

    const [createPurchase] = useCreatePurchaseMutation();
    const [updatePurchase] = useUpdatePurchaseMutation();
    const [deletePurchase] = useDeletePurchaseMutation();

    // Data normalization
    const purchases = purchasesResponse?.data || (Array.isArray(purchasesResponse) ? purchasesResponse : []) || [];
    const suppliers = suppliersResponse?.data || (Array.isArray(suppliersResponse) ? suppliersResponse : []) || [];
    const loading = isPurchasesLoading;
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    // Modal State
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedActionPurchase, setSelectedActionPurchase] = useState<any>(null);

    // Form State for Modals
    const [newStatus, setNewStatus] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");

    const handleStatusClick = (purchase: any) => {
        setSelectedActionPurchase(purchase);
        setNewStatus(purchase.status);
        setStatusModalOpen(true);
    };

    const handlePaymentClick = (purchase: any) => {
        setSelectedActionPurchase(purchase);
        setPaymentAmount(""); // Reset
        setPaymentModalOpen(true);
    };

    const handleStatusSubmit = async () => {
        const purchaseId = selectedActionPurchase?._id || selectedActionPurchase?.id;
        if (!purchaseId || !newStatus) return;
        try {
            await updatePurchase({
                id: purchaseId,
                body: { status: newStatus }
            }).unwrap();
            toast.success("Status updated successfully");
            setStatusModalOpen(false);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handlePaymentSubmit = async () => {
        const purchaseId = selectedActionPurchase?._id || selectedActionPurchase?.id;
        if (!purchaseId || !paymentAmount) return;
        const amount = Number(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Invalid payment amount");
            return;
        }

        const currentPaid = selectedActionPurchase.paidAmount || 0;
        const total = selectedActionPurchase.grandTotal || selectedActionPurchase.totalAmount || 0;
        const newPaidTotal = currentPaid + amount;

        const due = selectedActionPurchase.dueAmount || 0;
        if (amount > due) {
            if (!confirm(`Amount (${amount}) exceeds Due (${due}). Continue?`)) return;
        }

        try {
            await updatePurchase({
                id: purchaseId,
                body: {
                    paidAmount: newPaidTotal,
                    // If fully paid, we can optionally set status, but backend should ideally handle 'paymentStatus' derived field
                    paymentStatus: newPaidTotal >= total ? PURCHASE_PAYMENT_STATUS.PAID : (newPaidTotal > 0 ? PURCHASE_PAYMENT_STATUS.PARTIAL : PURCHASE_PAYMENT_STATUS.PENDING),
                    dueAmount: Math.max(0, total - newPaidTotal)
                }
            }).unwrap();
            toast.success("Payment added successfully");
            setPaymentModalOpen(false);
        } catch (error) {
            toast.error("Failed to add payment");
        }
    };

    // Navigation Handlers
    const getEditUrl = (purchaseId: string) => {
        const rolePath = params?.role as string;
        const buPath = params?.["business-unit"] as string;

        if (rolePath && buPath) {
            return `/${rolePath}/${buPath}/purchases/${purchaseId}/edit`;
        }
        // Global Fallback
        return `/${rolePath}/inventory/purchase/${purchaseId}/edit`;
    };

    const handleCreate = () => {
        const rolePath = params?.role as string;
        const buPath = params?.["business-unit"] as string;

        if (rolePath && buPath) {
            // Scoped View
            router.push(`/${rolePath}/${buPath}/purchases/create`);
        } else if (rolePath) {
            // Global View (e.g. /super-admin/inventory/purchase)
            router.push(`/${rolePath}/inventory/purchase/create`);
        }
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
                        {typeof row.original.businessUnit === 'object' ? row.original.businessUnit.name : "BU"}
                    </span>
                )}
            </div>,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => {
                // If populated object
                if (row.original.supplier && typeof row.original.supplier === 'object') {
                    return row.original.supplier.name || "Unknown";
                }
                // If ID, try to lookup
                const s = suppliers.find((sup: any) => sup._id === row.original.supplier || sup.id === row.original.supplier);
                return s ? s.name : "Unknown";
            },
        },
        {
            accessorKey: "purchaseDate",
            header: "Date",
            cell: ({ row }) => row.original.purchaseDate ? format(new Date(row.original.purchaseDate), "dd MMM yyyy") : "",
        },
        {
            accessorKey: "items",
            header: "Items (Qty)",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 text-sm">
                    {row.original.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground mr-2">
                                {item.product?.name || "Unknown Product"}
                            </span>
                            <span className="font-semibold whitespace-nowrap">
                                {item.quantity} {item.product?.unit?.name || "pcs"}
                            </span>
                        </div>
                    ))}
                    {(!row.original.items || row.original.items.length === 0) && (
                        <span className="text-muted-foreground text-xs text-center">-</span>
                    )}
                </div>
            ),
        },
        // Detailed Financial Columns
        {
            accessorKey: "subTotal",
            header: "Sub Total",
            cell: ({ row }) => <span className="text-muted-foreground">৳{(row.original.subTotal || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "tax",
            header: "Tax",
            cell: ({ row }) => <span className="text-muted-foreground">৳{(row.original.tax || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "discount",
            header: "Discount",
            cell: ({ row }) => <span className="text-muted-foreground">৳{(row.original.discount || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "shippingCost",
            header: "Shipping",
            cell: ({ row }) => <span className="text-muted-foreground">৳{(row.original.shippingCost || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "grandTotal", // CHANGED from totalAmount
            header: "Total",
            cell: ({ row }) => <span className="font-bold">৳{(row.original.grandTotal || row.original.totalAmount || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "paidAmount",
            header: "Paid",
            cell: ({ row }) => <span className="text-green-600">৳{(row.original.paidAmount || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "dueAmount",
            header: "Due",
            cell: ({ row }) => <span className="text-red-500 font-medium">৳{(row.original.dueAmount || 0).toFixed(2)}</span>,
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment",
            cell: ({ row }) => (
                <Badge variant={row.original.paymentStatus === PURCHASE_PAYMENT_STATUS.PAID ? "default" : "outline"} className="capitalize">
                    {row.original.paymentStatus || PURCHASE_PAYMENT_STATUS.PENDING}
                </Badge>
            ),
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
            cell: ({ row }) => {
                const purchase = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {hasPermission(PERMISSION_KEYS.PURCHASE.UPDATE) && (
                                <DropdownMenuItem onClick={() => router.push(getEditUrl(purchase._id || purchase.id))}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                            )}
                            {/* Quick Status Update */}
                            {hasPermission(PERMISSION_KEYS.PURCHASE.UPDATE) && (
                                <DropdownMenuItem onClick={() => handleStatusClick(purchase)}>
                                    Update Status
                                </DropdownMenuItem>
                            )}

                            {/* Quick Payment update */}
                            {hasPermission(PERMISSION_KEYS.PAYMENT.CREATE) && (
                                <DropdownMenuItem onClick={() => handlePaymentClick(purchase)}>
                                    Add Payment
                                </DropdownMenuItem>
                            )}

                            {hasPermission(PERMISSION_KEYS.PURCHASE.DELETE) && (
                                <DropdownMenuItem onClick={() => handleDelete(purchase._id)} className="text-red-600 mt-2">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const filteredPurchases = purchases.filter((p: any) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const refMatch = p.referenceNo && p.referenceNo.toLowerCase().includes(searchLower);
        const supplierMatch = p.supplier?.name && p.supplier.name.toLowerCase().includes(searchLower);
        return refMatch || supplierMatch;
    });

    return (
        <DataPageLayout
            title="Purchases"
            description="Manage your purchase orders and inventory replenishment"
            createAction={hasPermission(PERMISSION_KEYS.PURCHASE.CREATE) ? {
                label: "New Purchase",
                onClick: handleCreate
            } : undefined}
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

            {/* Status Update Modal */}
            <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status</DialogTitle>
                        <DialogDescription>
                            Change the status of purchase {selectedActionPurchase?.referenceNo || selectedActionPurchase?.id}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Status</Label>
                            <Select
                                value={newStatus}
                                onValueChange={setNewStatus}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PURCHASE_STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleStatusSubmit} disabled={!newStatus || newStatus === selectedActionPurchase?.status}>Update Status</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Update Modal */}
            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Payment</DialogTitle>
                        <DialogDescription>
                            Add a payment for purchase {selectedActionPurchase?.referenceNo}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">Grand Total</Label>
                            <div className="col-span-3 font-bold">৳{(selectedActionPurchase?.grandTotal || selectedActionPurchase?.totalAmount || 0).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">Paid</Label>
                            <div className="col-span-3 text-green-600">৳{(selectedActionPurchase?.paidAmount || 0).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">Due</Label>
                            <div className="col-span-3 text-red-500">৳{(selectedActionPurchase?.dueAmount || 0).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment-amount" className="text-right">Amount</Label>
                            <Input
                                id="payment-amount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter amount to pay"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
                        <Button onClick={handlePaymentSubmit} disabled={!paymentAmount || Number(paymentAmount) <= 0}>Add Payment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DataPageLayout>
    );
}

