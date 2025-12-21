"use client";

import { useParams } from "next/navigation";
import AddProductForm from "@/components/modules/catalog/product/AddProductForm";
import { useGetProductQuery } from "@/redux/api/productApi";
import { Loader2 } from "lucide-react";

export default function SuperAdminEditProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading } = useGetProductQuery(productId);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <AddProductForm initialData={product} />
        </div>
    );
}
