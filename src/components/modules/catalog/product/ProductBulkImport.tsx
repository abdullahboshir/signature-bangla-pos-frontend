"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { BulkImportModal } from "@/components/shared/BulkImportModal";
import { PRODUCT_IMPORT_TEMPLATE } from "@/utils/csv-templates";
import { useGetCategoriesQuery } from "@/redux/api/catalog/categoryApi";
import { useGetBrandsQuery } from "@/redux/api/catalog/brandApi";
import { useGetUnitsQuery } from "@/redux/api/catalog/unitApi";
import { useCreateProductMutation } from "@/redux/api/catalog/productApi";
import { toast } from "sonner";
import { z } from "zod";
import { PRODUCT_STATUS } from "@/constant/product.constant";

export function ProductBulkImport({ buttonVariant = "outline" }: { buttonVariant?: "default" | "outline" | "ghost" }) {
    // 1. Fetch Reference Data for Validation
    const { data: categories = [] } = useGetCategoriesQuery({ limit: 1000 });
    const { data: brands = [] } = useGetBrandsQuery({ limit: 1000 });
    const { data: units = [] } = useGetUnitsQuery({ limit: 1000 });
    const [createProduct] = useCreateProductMutation();

    // 2. Build Maps for O(1) Lookup
    const maps = useMemo(() => ({
        categories: new Map(categories.map((c: any) => [c.name.trim().toLowerCase(), c._id])),
        brands: new Map(brands.map((b: any) => [b.name.trim().toLowerCase(), b._id])),
        units: new Map(units.map((u: any) => [u.name.trim().toLowerCase(), u._id])),
    }), [categories, brands, units]);

    // 3. Validation Logic per Row
    const validateRow = (row: any) => {
        const errors: string[] = [];
        let isValid = true;

        if (!row.Name) { errors.push("Name is required"); isValid = false; }

        // Category Check
        if (!row.Category) {
            errors.push("Category is required"); isValid = false;
        } else if (!maps.categories.has(row.Category.trim().toLowerCase())) {
            errors.push(`Category '${row.Category}' not found`); isValid = false;
        }

        // Brand Check (Optional but if present must be valid)
        if (row.Brand && !maps.brands.has(row.Brand.trim().toLowerCase())) {
            errors.push(`Brand '${row.Brand}' not found`); isValid = false;
        }

        // Unit Check (Optional but if present must be valid)
        if (row.Unit && !maps.units.has(row.Unit.trim().toLowerCase())) {
            errors.push(`Unit '${row.Unit}' not found`); isValid = false;
        }

        // Pricing Check
        const cost = parseFloat(row["Cost Price"] || "0");
        const sale = parseFloat(row["Sale Price"] || "0");
        if (isNaN(cost) || isNaN(sale)) { errors.push("Invalid Price"); isValid = false; }
        // if (cost > sale) { errors.push("Cost > Sale Price"); isValid = false; } // Soft warning? or Error? Let's keep as Error for safety.

        return { isValid, errors };
    };

    // 4. Import Handler
    const handleImport = async (rows: any[], reset: () => void) => {
        let successCount = 0;
        let failCount = 0;
        const total = rows.length;

        const loadingToast = toast.loading(`Importing 0/${total} products...`);

        for (let i = 0; i < total; i++) {
            const row = rows[i];
            toast.loading(`Importing ${i + 1}/${total} products...`, { id: loadingToast });

            try {
                // Map CSV Row to Backend Payload
                const payload = {
                    name: row.Name,
                    sku: row.SKU || undefined, // Backend auto-generates if missing, but we allowed SKU in CSV
                    slug: row.Name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Simple slug
                    primaryCategory: maps.categories.get(row.Category.trim().toLowerCase()),
                    brands: row.Brand ? [maps.brands.get(row.Brand.trim().toLowerCase())] : [],
                    unit: row.Unit ? maps.units.get(row.Unit.trim().toLowerCase()) : undefined,
                    statusInfo: {
                        status: row.Status?.toLowerCase() === 'published' ? PRODUCT_STATUS.PUBLISHED : PRODUCT_STATUS.DRAFT,
                    },
                    pricing: {
                        basePrice: parseFloat(row["Sale Price"]),
                        salePrice: parseFloat(row["Sale Price"]), // Default same
                        costPrice: parseFloat(row["Cost Price"]),
                        currency: "BDT",
                        vatPercentage: 0
                    },
                    inventory: {
                        inventory: {
                            stock: parseInt(row.Stock || "0"),
                            lowStockThreshold: parseInt(row["Low Stock"] || "5")
                        },
                        manageStock: true
                    },
                    details: {
                        description: row.Description || "",
                        images: [] // Image import via CSV is hard (URLs?) -> scope out for now
                    },
                    shipping: {
                        isDigital: false,
                        isShippable: true
                    },
                    hasVariants: false // strictly simple products
                };

                await createProduct(payload).unwrap();
                successCount++;
            } catch (error) {
                console.error("Failed to import row:", row, error);
                failCount++;
            }
        }

        toast.dismiss(loadingToast);

        if (failCount === 0) {
            toast.success(`Successfully imported ${successCount} products!`);
            reset(); // Close modal
        } else {
            toast.warning(`Imported ${successCount} products. Failed ${failCount}. Check console for details.`);
        }
    };

    return (
        <BulkImportModal
            trigger={
                <Button variant={buttonVariant}>
                    <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
            }
            title="Import Products"
            description="Upload a CSV file. Categories and Brands MUST exist in the system beforehand."
            sampleData={PRODUCT_IMPORT_TEMPLATE}
            sampleFilename="product-import-template.csv"
            validateRow={validateRow}
            onImport={handleImport}
        />
    );
}

