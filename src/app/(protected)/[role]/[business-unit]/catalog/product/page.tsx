"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductList } from "@/components/modules/catalog/product/ProductList";

export default function ProductsPage() {
    const router = useRouter();
    const params = useParams();
    const role = params?.role;
    const businessUnit = params?.["business-unit"];
    const [search, setSearch] = useState("");

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
                <Button onClick={() => router.push(`/${role}/${businessUnit}/catalog/product/add`)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ProductList searchQuery={search} />
        </div>
    );
}
