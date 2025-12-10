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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await productService.delete(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{product.name}</span>
                                    <span className="text-xs text-muted-foreground">{product.slug}</span>
                                </div>
                            </TableCell>
                            <TableCell>{product.sku || "—"}</TableCell>
                            <TableCell>
                                {product.primaryCategory?.name || "—"}
                            </TableCell>
                            <TableCell>
                                {product.pricing?.currency} {product.pricing?.basePrice}
                            </TableCell>
                            <TableCell>
                                {product.inventory?.inventory?.stock}
                                {product.inventory?.inventory?.lowStockThreshold > product.inventory?.inventory?.stock && (
                                    <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-4">Low</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={product.statusInfo?.status === "published" ? "default" : "secondary"}>
                                    {product.statusInfo?.status || "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => router.push(`/${role}/${businessUnit}/catalog/product/edit/${product._id}`)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(product._id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
