"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import AddProductForm from "@/components/modules/catalog/product/AddProductForm";
import { useGetProductQuery } from "@/redux/api/productApi";

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading, error } = useGetProductQuery(productId);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                Product not found
            </div>
        );
    }

    return (
        <div>
            {/* Header is now handled inside the form for consistency */}
            <AddProductForm initialData={product} />
        </div>
    );
}
