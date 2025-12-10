
"use client";

import AddProductForm from "@/components/modules/catalog/product/AddProductForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function AddProductPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Add New Product"
                description="Create a new product with details, pricing, and inventory."
            />
            <AddProductForm />
        </div>
    );
}
