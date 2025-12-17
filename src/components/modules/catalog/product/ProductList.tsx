"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Edit2, MoreHorizontal, Trash2, DollarSign, Package, CheckCircle, AlertTriangle, Plus, Search, Copy, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { ColumnDef } from "@tanstack/react-table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StatCard } from "@/components/shared/StatCard";
// import { DateRangeFilter } from "@/components/shared/DateRangeFilter"; // Removed as handled by DataPageLayout
import { DataTable } from "@/components/shared/DataTable";
import { DataPageLayout } from "@/components/shared/DataPageLayout";
import { filterDataByDate } from "@/lib/dateFilterUtils";

import { productService } from "@/services/catalog/product.service";

export function ProductList() {
    const router = useRouter();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;
    const role = params["role"] as string;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Date Filter State
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Tab State
    const [activeTab, setActiveTab] = useState("all");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await productService.getAll({ businessUnit });
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [businessUnit]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await productService.delete(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        router.push(`/${role}/${businessUnit}/catalog/product/edit/${id}`);
    }

    const handleCopyId = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(id);
        toast.success("Product ID copied to clipboard");
    };

    const handleStatusToggle = async (product: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = product.statusInfo?.status === "published" ? "draft" : "published";
        try {
            await productService.update(product._id, { statusInfo: { status: newStatus } });
            toast.success(`Product ${newStatus === "published" ? "Published" : "Moved to Draft"}`);
            fetchProducts();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Filter Logic
    const getFilteredProducts = () => {
        let filtered = filterDataByDate(products, "createdAt", dateFilter, dateRange);

        if (searchQuery) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeTab === "all") return filtered;
        if (activeTab === "published") return filtered.filter(p => p.statusInfo?.status === "published");
        if (activeTab === "draft") return filtered.filter(p => p.statusInfo?.status === "draft");
        if (activeTab === "low_stock") {
            return filtered.filter(p =>
                (p.inventory?.inventory?.stock || 0) <= (p.inventory?.inventory?.lowStockThreshold || 0)
            );
        }

        return filtered;
    };

    const displayedProducts = getFilteredProducts();

    // Stats Calculation
    const totalValue = products.reduce((acc, p) => {
        const cost = p.pricing?.costPrice || 0;
        const stock = p.inventory?.inventory?.stock || 0;
        return acc + (cost * stock);
    }, 0);

    const lowStockCount = products.filter(p =>
        (p.inventory?.inventory?.stock || 0) <= (p.inventory?.inventory?.lowStockThreshold || 0)
    ).length;

    // Define Columns
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "details.images",
            header: "Image",
            cell: ({ row }) => {
                const images = row.original.details?.images;
                return (
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        {images?.[0] ? (
                            <img
                                src={images[0]}
                                alt={row.original.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                No Img
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Product Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.slug}</span>
                </div>
            ),
        },
        {
            accessorKey: "sku",
            header: "SKU",
            cell: ({ row }) => row.original.sku || "—",
        },
        {
            accessorKey: "brands",
            header: "Brand",
            cell: ({ row }) => row.original.brands?.[0]?.name || "—",
        },
        {
            accessorKey: "primaryCategory.name",
            header: "Category",
            cell: ({ row }) => row.original.primaryCategory?.name || "—",
        },
        {
            accessorKey: "businessUnit.name",
            header: "Business Unit",
            cell: ({ row }) => (
                <Badge variant="outline" className="whitespace-nowrap">
                    {row.original.businessUnit?.name || "Global"}
                </Badge>
            ),
        },
        {
            accessorKey: "unit.name",
            header: "Unit",
            cell: ({ row }) => row.original.unit?.name || "—",
        },
        {
            id: "pricing",
            header: "Financials",
            cell: ({ row }) => {
                const product = row.original;
                const cost = product.pricing?.costPrice || 0;
                const sales = product.pricing?.basePrice || 0;
                const profit = sales - cost;
                const profitPercent = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;

                return (
                    <div className="flex flex-col text-xs space-y-1">
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">Cost:</span>
                            <span>{product.pricing?.currency} {cost}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">Sales:</span>
                            <span>{product.pricing?.currency} {sales}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">Profit:</span>
                            <span className={profit >= 0 ? "text-green-600 font-medium" : "text-red-600"}>
                                {product.pricing?.currency} {profit.toFixed(2)} ({profitPercent}%)
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "inventory.inventory.stock",
            header: "Stock",
            cell: ({ row }) => {
                const product = row.original;
                const stock = product.inventory?.inventory?.stock || 0;
                const lowStock = product.inventory?.inventory?.lowStockThreshold || 0;
                const isLow = stock <= lowStock;

                return (
                    <div className="flex items-center">
                        {stock}
                        {isLow && (
                            <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-4">Low</Badge>
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => row.original.createdAt ? format(new Date(row.original.createdAt), "dd MMM yyyy") : "—",
        },
        {
            accessorKey: "statusInfo.status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.original.statusInfo?.status === "published" ? "default" : "secondary"}>
                    {row.original.statusInfo?.status || "Draft"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 bg-background" onClick={(e) => e.stopPropagation()}>
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => handleCopyId(product._id, e)}>
                                <Copy className="mr-2 h-4 w-4" /> Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleEdit(product._id, e)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {product.statusInfo?.status === "published" ? (
                                <DropdownMenuItem onClick={(e) => handleStatusToggle(product, e)}>
                                    <Archive className="mr-2 h-4 w-4" /> Unpublish
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={(e) => handleStatusToggle(product, e)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Publish
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleDelete(product._id, e)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    const renderExpandedRow = (row: any) => {
        const product = row.original;
        const cost = product.pricing?.costPrice || 0;
        const sales = product.pricing?.basePrice || 0;
        const profit = sales - cost;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-md bg-background border">
                {/* Left Column: Images & Desc */}
                <div className="space-y-6">
                    {product.details?.images?.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-sm font-semibold text-muted-foreground">Images</span>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.details.images.map((img: string, idx: number) => (
                                    <div key={idx} className="h-24 w-24 flex-shrink-0 rounded-md overflow-hidden border bg-muted">
                                        <img src={img} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Description</span>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{product.details?.description || "No description provided."}</p>
                    </div>
                </div>

                {/* Right Column: Key Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Basic Info</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <span className="text-muted-foreground">Brand:</span>
                            <span>{product.brands?.[0]?.name || "N/A"}</span>
                            <span className="text-muted-foreground">Category:</span>
                            <span>{product.primaryCategory?.name}</span>
                            <span className="text-muted-foreground">Unit:</span>
                            <span>{product.unit?.name}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Financials</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <span className="text-muted-foreground">Cost:</span>
                            <span>{product.pricing?.currency} {cost}</span>
                            <span className="text-muted-foreground">Sales:</span>
                            <span>{product.pricing?.currency} {sales}</span>
                            <span className="text-muted-foreground">Profit:</span>
                            <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                                {product.pricing?.currency} {profit.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Shipping</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <span className="text-muted-foreground">Weight:</span>
                            <span>{product.shipping?.physicalProperties?.weight} {product.shipping?.physicalProperties?.weightUnit}</span>
                            <span className="text-muted-foreground">Delivery:</span>
                            <span>{product.shipping?.delivery?.estimatedDelivery || "N/A"}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Meta</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <span className="text-muted-foreground">SEO Title:</span>
                            <span className="truncate">{product.marketing?.seo?.metaTitle || "N/A"}</span>
                        </div>
                    </div>

                </div>
            </div>
        );
    };


    return (
        <DataPageLayout
            title="Products"
            createAction={{
                label: "Create Product",
                onClick: () => router.push(`/${role}/${businessUnit}/catalog/product/add`)
            }}
            stats={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Stock Value"
                        icon={DollarSign}
                        value={`${totalValue.toLocaleString()} BDT`}
                    />
                    <StatCard
                        title="Total Products"
                        icon={Package}
                        value={products.length}
                    />
                    <StatCard
                        title="Active Products"
                        icon={CheckCircle}
                        value={products.filter(p => p.statusInfo?.status === "published").length}
                    />
                    <StatCard
                        title="Low Stock"
                        icon={AlertTriangle}
                        value={lowStockCount}
                    />
                </div>
            }
            tabs={[
                { value: "all", label: "All Products" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
                { value: "low_stock", label: "Low Stock" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            extraFilters={
                <div className="relative max-w-sm flex-1 min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8 h-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            }
            dateFilter={{
                dateFilter,
                setDateFilter,
                dateRange,
                setDateRange,
                isCalendarOpen,
                setIsCalendarOpen
            }}
        >
            <TabsContent value="all" className="mt-0">
                <DataTable columns={columns} data={displayedProducts} renderSubComponent={renderExpandedRow} isLoading={isLoading} disablePagination={true} />
            </TabsContent>
            <TabsContent value="published" className="mt-0">
                <DataTable columns={columns} data={displayedProducts} renderSubComponent={renderExpandedRow} isLoading={isLoading} disablePagination={true} />
            </TabsContent>
            <TabsContent value="draft" className="mt-0">
                <DataTable columns={columns} data={displayedProducts} renderSubComponent={renderExpandedRow} isLoading={isLoading} disablePagination={true} />
            </TabsContent>
            <TabsContent value="low_stock" className="mt-0">
                <DataTable columns={columns} data={displayedProducts} renderSubComponent={renderExpandedRow} isLoading={isLoading} disablePagination={true} />
            </TabsContent>
        </DataPageLayout>
    );
}
