"use client";

import { useFieldArray, Control, useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search, Package } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/catalog/productApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Action {
    control: Control<any>;
    name: string;
    businessUnit?: string;
}

export function PurchaseItemsField({ control, name, businessUnit }: Action) {
    const { setValue, watch } = useFormContext(); // Get context to update values
    const selectedOutlet = watch('outlet'); // Watch selected outlet for stock calculation

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    // Fetch products, filtered by BU if provided
    const { data: products = [] } = useGetProductsQuery({
        businessUnit // If undefined, fetches all (for SA) or filtered by token (for Role)
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    const handleProductSelect = (index: number, product: any) => {
        if (product) {
            // Auto-fill cost if available from product pricing
            const cost = product.pricing?.costPrice || 0;
            setValue(`${name}.${index}.unitCost`, cost);

            // Recalculate total immediately
            const qty = watch(`${name}.${index}.quantity`) || 1;
            setValue(`${name}.${index}.total`, qty * cost);
        }
    };

    const handleAddFromSearch = (productId: string) => {
        const product = products.find((p: any) => p._id === productId || p.id === productId);
        if (product) {
            const cost = product.pricing?.costPrice || 0;
            append({
                product: productId,
                quantity: 1,
                unitCost: cost,
                total: cost
            });
            // Optional: Scroll to bottom or show toast
        }
    };

    const handleCalculation = (index: number) => {
        const qty = watch(`${name}.${index}.quantity`) || 0;
        const cost = watch(`${name}.${index}.unitCost`) || 0;
        setValue(`${name}.${index}.total`, qty * cost);
    };

    // Helper to get stock display
    const getStockDisplay = (productId: string) => {
        const product = products.find((p: any) => p._id === productId || p.id === productId);
        if (!product || !product.inventory) return <span className="text-muted-foreground">-</span>;

        // Access nested inventory structure based on model
        // global stock: product.inventory.inventory.stock
        // outlet stock: product.inventory.outletStock

        const globalStock = product.inventory?.inventory?.stock || 0;

        let displayStock = globalStock;
        let label = "Global";

        if (selectedOutlet && product.inventory?.outletStock) {
            const os = product.inventory.outletStock.find((o: any) => o.outlet === selectedOutlet);
            if (os) {
                displayStock = os.stock;
                label = "Outlet";
            } else {
                displayStock = 0; // Not available in this outlet
                label = "Outlet";
            }
        }

        return (
            <div className="flex flex-col text-[10px] leading-tight text-muted-foreground">
                <span className="font-medium text-foreground">{displayStock}</span>
                <span>{label} Stock</span>
            </div>
        );
    };

    // Helper to get SKU
    const getProductSKU = (productId: string) => {
        const product = products.find((p: any) => p._id === productId || p.id === productId);
        return product?.sku || "-";
    };


    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1">
                <h3 className="text-sm font-medium flex items-center gap-2 min-w-fit">
                    <Package className="h-4 w-4" />
                    Items ({fields.length})
                </h3>

                {/* Search Bar - Centered/Flexible */}
                <div className="flex-1 max-w-xl w-full relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={handleAddFromSearch}>
                        <SelectTrigger className="w-full pl-9 h-9 border-dashed bg-muted/20">
                            <SelectValue placeholder="Search and add product..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {products.map((p: any) => (
                                <SelectItem key={p._id || p.id} value={p._id || p.id}>
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-muted-foreground ml-2 text-xs">({p.sku})</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-w-fit"
                    onClick={() => append({ product: "", quantity: 1, unitCost: 0, total: 0 })}
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Empty Row
                </Button>
            </div>

            <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto w-full bg-card">
                {fields.length > 0 && (
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-4 sm:col-span-3">Product Details</div>
                        <div className="col-span-2 hidden sm:block">Stock</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Cost</div>
                        <div className="col-span-2">Total</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>
                )}

                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-muted/10 transition-colors">
                        {/* Product Selection */}
                        <div className="col-span-4 sm:col-span-3 space-y-1">
                            <div className="sm:hidden block text-[10px] text-muted-foreground">Product</div>
                            <ProductSelect
                                control={control}
                                index={index}
                                name={name}
                                products={Array.isArray(products) ? products : (products as any)?.results || []}
                                onProductSelect={(prod) => handleProductSelect(index, prod)}
                            />
                            <div className="text-[10px] text-muted-foreground pl-1">
                                SKU: {watch(`${name}.${index}.product`) ? getProductSKU(watch(`${name}.${index}.product`)) : '-'}
                            </div>
                        </div>

                        {/* Stock (Hidden on small mobile) */}
                        <div className="col-span-2 hidden sm:block">
                            {watch(`${name}.${index}.product`) ? getStockDisplay(watch(`${name}.${index}.product`)) : '-'}
                        </div>

                        {/* Qty */}
                        <div className="col-span-2 space-y-1">
                            <div className="sm:hidden block text-[10px] text-muted-foreground">Qty</div>
                            <Input
                                type="number"
                                className="h-8"
                                {...control.register(`${name}.${index}.quantity` as const, {
                                    valueAsNumber: true,
                                    onChange: () => handleCalculation(index)
                                })}
                            />
                        </div>

                        {/* Cost */}
                        <div className="col-span-2 space-y-1">
                            <div className="sm:hidden block text-[10px] text-muted-foreground">Cost</div>
                            <Input
                                type="number"
                                className="h-8"
                                {...control.register(`${name}.${index}.unitCost` as const, {
                                    valueAsNumber: true,
                                    onChange: () => handleCalculation(index)
                                })}
                            />
                        </div>

                        {/* Total */}
                        <div className="col-span-2 space-y-1">
                            <div className="sm:hidden block text-[10px] text-muted-foreground">Total</div>
                            <Input
                                type="number"
                                className="h-8 bg-muted font-medium"
                                {...control.register(`${name}.${index}.total` as const, { valueAsNumber: true })}
                                readOnly
                            />
                        </div>

                        {/* Action */}
                        <div className="col-span-1 flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground gap-2">
                        <Package className="h-8 w-8 opacity-20" />
                        <p className="text-sm">No items added to the purchase order.</p>
                        <p className="text-xs">Use the search bar above to find and add products.</p>
                    </div>
                )}
            </div>

            {/* Footer Summary (Optional, basic subtotal check) */}
            {fields.length > 0 && (
                <div className="flex justify-end p-2 text-sm font-medium">
                    Total Items: {fields.length}
                </div>
            )}
        </div>
    );
}

function ProductSelect({ control, index, name, products, onProductSelect }: { control: any, index: number, name: string, products: any[], onProductSelect: (prod: any) => void }) {
    return (
        <Controller
            control={control}
            name={`${name}.${index}.product`}
            render={({ field }) => (
                <Select onValueChange={(val) => {
                    field.onChange(val);
                    const p = products.find((x: any) => x._id === val || x.id === val);
                    onProductSelect(p);
                }}
                    value={field.value}
                >
                    <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((p: any) => (
                            <SelectItem key={p._id || p.id} value={p._id || p.id} className="text-xs">
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    )
}

