"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Package, AlertTriangle, Search, MoreHorizontal, Edit, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
// import { AutoFormModal } from "@/components/shared/AutoFormModal"; // Re-enable if we want quick edit

import { useGetInventorysQuery } from "@/redux/api/inventory/inventoryApi"; // CHANGED
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSION_KEYS } from "@/config/permission-keys";

export const InventoryList = () => {
    const params = useParams();
    const paramBusinessUnit = params?.["business-unit"] as string;
    const { user } = useAuth();
    const { hasPermission, isSuperAdmin } = usePermissions();
    const businessUnit = isSuperAdmin ? undefined : paramBusinessUnit;

    const [searchTerm, setSearchTerm] = useState("");
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedItem, setSelectedItem] = useState<any>(null);

    // Fetch Stock Levels
    const { data: inventoryData, isLoading: queryLoading, refetch } = useGetInventorysQuery({ businessUnit });
    const inventoryItems = inventoryData?.data || [];
    const loading = queryLoading;

    // const handleEditStock = (item: any) => {
    //     // Logic to open adjustment modal?
    //     // For now, let's keep it read-only or redirect to adjustment page
    //     toast.info("Please use the 'Adjustments' page to modify stock.");
    // };

    // Columns matching ProductStock structure
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "product.name",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.product?.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.product?.sku || "No SKU"}</span>
                </div>
            ),
        },
        {
            accessorKey: "product.category.name",
            header: "Category",
            cell: ({ row }) => row.original.product?.category?.name || "-",
        },
        {
            accessorKey: "inventory.stock",
            header: "Stock Level",
            cell: ({ row }) => {
                const stock = row.original.inventory?.stock || 0;
                const threshold = row.original.inventory?.lowStockThreshold || 10; // Fallback
                const status = stock === 0 ? 'critical' : stock <= threshold ? 'low' : 'good';
                const max = Math.max(stock + 20, 100);

                return (
                    <div className="w-[180px] space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium">{stock} units</span>
                            <span className={status === 'good' ? 'text-green-600' : status === 'low' ? 'text-yellow-600' : 'text-red-600'}>
                                {status === 'critical' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
                            </span>
                        </div>
                        <Progress
                            value={(stock / max) * 100}
                            className={`h-2 ${status === 'good' ? 'bg-green-100' : status === 'low' ? 'bg-yellow-100' : 'bg-red-100'}`}
                        />
                    </div>
                );
            },
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
                        {hasPermission(PERMISSION_KEYS.INVENTORY.TRACK) && (
                            <DropdownMenuItem onClick={() => {
                                // Redirect to ledger or adjustment?
                                toast.info("Please use Adjustment module for changes.");
                            }}>
                                View History (Ledger)
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const filteredItems = inventoryItems.filter((item: any) =>
        (item.product?.name && item.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.product?.sku && item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const lowStockCount = inventoryItems.filter((i: any) =>
        (i.inventory?.stock || 0) <= (i.inventory?.lowStockThreshold || 10)
    ).length;

    return (
        <DataPageLayout
            title="Stock Levels"
            description="Real-time inventory tracking."
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Items"
                        value={inventoryItems.length}
                        icon={Package}
                    />
                    <StatCard
                        title="Low Stock"
                        value={lowStockCount}
                        icon={AlertTriangle}
                    />
                </div>
            }
            extraFilters={
                <div className="relative flex-1 max-w-sm flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search product name or SKU..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            }
        >
            <DataTable columns={columns} data={filteredItems} isLoading={loading} />
            {/* AutoFormModal removed for now as we want explicit adjustment */}
        </DataPageLayout>
    );
};

