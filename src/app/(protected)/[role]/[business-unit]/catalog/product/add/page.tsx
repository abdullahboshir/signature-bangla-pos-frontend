"use client";

import ProductForm from "@/components/modules/catalog/product/ProductForm";
import { useParams } from "next/navigation";

export default function AddProductPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
                <p className="text-muted-foreground">Fill in the details to create a new product.</p>
            </div>
            <ProductForm />
        </div>
    );
}
