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
import { AutoFormModal } from "@/components/shared/AutoFormModal";

import { useGetProductsQuery, useUpdateProductMutation } from "@/redux/api/productApi";
import { useAuth } from "@/hooks/useAuth";

export const InventoryList = () => {
    const params = useParams();
    const paramBusinessUnit = params["business-unit"] as string;
    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    // For SA, if params empty, no filter (Global). For BU user, filtered by param.
    // However, existing "productApi" likely expects "businessUnit" in query to filter.
    const businessUnit = isSuperAdmin ? undefined : paramBusinessUnit;

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { data: products = [], isLoading: loading, refetch } = useGetProductsQuery({ businessUnit });
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const handleEditStock = (item: any) => {
        setSelectedItem({
            id: item._id || item.id,
            stock: item.inventory?.stock || 0,
            lowStockThreshold: item.inventory?.lowStockThreshold || 10
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            // Construct payload structured as partial update
            // Backend endpoint likely expects body to have fields to update.
            // If we send { inventory: { ... } }, ensure backend merges or replaces.
            // Based on previous code logic, we construct:
            const payload = {
                inventory: {
                    stock: Number(values.stock),
                    lowStockThreshold: Number(values.lowStockThreshold)
                }
            };

            // Using RTK Mutation
            await updateProduct({ id: selectedItem.id, body: payload }).unwrap();

            toast.success("Inventory updated successfully");
            setIsModalOpen(false);
            setSelectedItem(null);
        } catch (error: any) {
            console.error("Update failed", error);
            toast.error(error?.data?.message || "Failed to update inventory");
        }
    };

    // Columns
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.sku || "No SKU"}</span>
                </div>
            ),
        },
        {
            accessorKey: "businessUnit",
            header: "Business Unit",
            cell: ({ row }) => {
                const bu = row.original.businessUnit;
                if (!bu) return <span className="text-muted-foreground text-xs">Global</span>;
                return <span className="text-xs">{(typeof bu === 'object' && (bu as any).name) ? (bu as any).name : bu}</span>;
            },
        },
        {
            accessorKey: "stock",
            header: "Stock Level",
            cell: ({ row }) => {
                const stock = row.original.inventory?.stock || 0;
                const threshold = row.original.inventory?.lowStockThreshold || 10;
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
                        // Note: standard shadcn Progress component might not support color props on root easily without custom styles, 
                        // but the indicator is usually primary. We can rely on default for now.
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
                        <DropdownMenuItem onClick={() => handleEditStock(row.original)}>
                            <Edit className="mr-2 h-4 w-4" /> Adjust Stock
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const filteredItems = (Array.isArray(products) ? products : []).filter((item: any) =>
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const lowStockCount = (Array.isArray(products) ? products : []).filter((i: any) => (i.inventory?.stock || 0) <= (i.inventory?.lowStockThreshold || 10)).length;

    return (
        <DataPageLayout
            title="Inventory Management"
            description="Monitor stock levels and manage warehouse operations."
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Items"
                        value={products.length}
                        icon={Package}
                    />
                    <StatCard
                        title="Low Stock"
                        value={lowStockCount}
                        icon={AlertTriangle}
                        trend={lowStockCount > 0 ? "destructive" : "neutral"}
                    />
                </div>
            }
            extraFilters={
                <div className="relative flex-1 max-w-sm flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search inventory..."
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

            <AutoFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="Adjust Stock"
                description="Update inventory levels manually."
                fields={[
                    {
                        name: "stock",
                        label: "Current Stock",
                        type: "number",
                        required: true,
                    },
                    {
                        name: "lowStockThreshold",
                        label: "Low Stock Threshold",
                        type: "number",
                        required: true,
                    }
                ]}
                onSubmit={handleSubmit}
                defaultValues={selectedItem ? {
                    stock: selectedItem.stock,
                    lowStockThreshold: selectedItem.lowStockThreshold
                } : {}}
                submitLabel={isUpdating ? "Updating..." : "Update Inventory"}
            />
        </DataPageLayout>
    );
};
