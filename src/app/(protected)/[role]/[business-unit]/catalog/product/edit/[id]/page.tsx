"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import ProductForm from "@/components/modules/catalog/product/ProductForm";
import { productService } from "@/services/catalog/product.service";

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getById(productId);
                if (data) {
                    setProduct(data);
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                Product not found
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-muted-foreground">Update product details.</p>
            </div>
            <ProductForm initialData={product} />
        </div>
    );
}
