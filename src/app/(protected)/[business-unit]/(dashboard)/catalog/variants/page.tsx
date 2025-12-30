"use client"

import VariantList from "@/components/modules/catalog/product/VariantList"

export default function VariantsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
                <p className="text-muted-foreground">
                    Manage global product variants (Size, Color, etc.).
                </p>
            </div>

            <VariantList />
        </div>
    )
}
