"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Edit2, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { productService } from "@/services/catalog/product.service";

interface ProductListProps {
    searchQuery?: string;
}

export function ProductList({ searchQuery }: ProductListProps) {
    const router = useRouter();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;
    const role = params["role"] as string;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

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

    const toggleRow = (id: string) => {
        if (expandedProductId === id) {
            setExpandedProductId(null);
        } else {
            setExpandedProductId(id);
        }
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes((searchQuery || "").toLowerCase())
    );

    if (isLoading) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    if (filteredProducts.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No products found.</div>;
    }

    return (
        <div className="rounded-md border">
            <div className="relative w-full overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="min-w-[200px]">Product Name</TableHead>
                            <TableHead className="min-w-[100px]">SKU</TableHead>
                            <TableHead className="min-w-[100px]">Brand</TableHead>
                            <TableHead className="min-w-[100px]">Category</TableHead>
                            <TableHead className="min-w-[120px]">Business Unit</TableHead>
                            <TableHead className="min-w-[80px]">Unit</TableHead>
                            <TableHead className="min-w-[100px]">Cost Price</TableHead>
                            <TableHead className="min-w-[100px]">Sales Price</TableHead>
                            <TableHead className="min-w-[100px]">Profit</TableHead>
                            <TableHead className="min-w-[80px]">Stock</TableHead>
                            <TableHead className="min-w-[100px]">Created At</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="text-right sticky right-0 bg-background z-10">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => {
                            const cost = product.pricing?.costPrice || 0;
                            const sales = product.pricing?.basePrice || 0;
                            const profit = sales - cost;
                            const profitPercent = cost > 0 ? ((profit / cost) * 100).toFixed(1) : 0;
                            const isExpanded = expandedProductId === product._id;

                            return (
                                <>
                                    <TableRow
                                        key={product._id}
                                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${isExpanded ? "bg-muted/50 border-b-0" : ""}`}
                                        onClick={() => toggleRow(product._id)}
                                    >
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                                {product.details?.images?.[0] ? (
                                                    <img
                                                        src={product.details.images[0]}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                <span className="text-xs text-muted-foreground">{product.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.sku || "—"}</TableCell>
                                        <TableCell>{product.brands?.[0]?.name || "—"}</TableCell>
                                        <TableCell>
                                            {product.primaryCategory?.name || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="whitespace-nowrap">
                                                {product.businessUnit?.name || "Global"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {product.unit?.name || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {product.pricing?.currency} {cost}
                                        </TableCell>
                                        <TableCell>
                                            {product.pricing?.currency} {sales}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span className={profit >= 0 ? "text-green-600 font-medium" : "text-red-600"}>
                                                    {product.pricing?.currency} {profit.toFixed(2)}
                                                </span>
                                                <span className="text-muted-foreground">({profitPercent}%)</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {product.inventory?.inventory?.stock}
                                            {product.inventory?.inventory?.lowStockThreshold > product.inventory?.inventory?.stock && (
                                                <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-4">Low</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {product.createdAt ? format(new Date(product.createdAt), "dd MMM yyyy") : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.statusInfo?.status === "published" ? "default" : "secondary"}>
                                                {product.statusInfo?.status || "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right sticky right-0 bg-background">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={(e) => handleEdit(product._id, e)}>
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => handleDelete(product._id, e)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Detail Row */}
                                    {isExpanded && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell colSpan={14} className="p-4 border-t-0">
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
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
