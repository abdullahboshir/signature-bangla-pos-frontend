"use client";

import { useFieldArray, Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetProductsQuery } from "@/redux/api/catalog/productApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Action {
    control: Control<any>;
    name: string;
}

export function PurchaseItemsField({ control, name }: Action) {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name,
    });

    // RTK Query hook for fetching products
    const { data: products = [] } = useGetProductsQuery({});

    // Previous manual fetch logic removed
    // const fetchProducts = async () => { ... }

    // Auto-calculate total when quantity or cost changes
    // This is tricky with useFieldArray. 
    // I will use useWatch to watch the array? No, performance heavy.
    // I'll just rely on the inputs updating the values. 
    // Actually, making it read-only 'Total' is good UX.

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Items</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ product: "", quantity: 1, unitCost: 0, total: 0 })}
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
            </div>

            <div className="border rounded-md p-2 space-y-2 max-h-[300px] overflow-y-auto">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end border-b pb-2 last:border-0">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs">Product</label>
                            {/* Product Select */}
                            {/* Since this is inside a loop, using Controller directly or just simple Select if managed manually? 
                                AutoFormModal handles Controller for top level. Here we are inside specific render.
                                We need to register inputs or use Controller.
                                Since 'control' is passed, we can use Controller. 
                            */}
                            {/* ... Actually, properly using Controller here is better */}
                            <ProductSelect
                                control={control}
                                index={index}
                                name={name}
                                products={products}
                                onProductSelect={(prod) => {
                                    // Set unit cost from product if available?
                                    // For now just select.
                                }}
                            />
                        </div>
                        <div className="w-20 space-y-1">
                            <label className="text-xs">Qty</label>
                            <Input
                                type="number"
                                {...control.register(`${name}.${index}.quantity` as const, { valueAsNumber: true })}
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs">Cost</label>
                            <Input
                                type="number"
                                {...control.register(`${name}.${index}.unitCost` as const, { valueAsNumber: true })}
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            {/* Calculated Total? or Manual? */}
                            {/* Let's make it manual input for now to avoid complex watch logic here, 
                                 or better: use a separate component for the row to useWatch internally. */}
                            <label className="text-xs">Total</label>
                            <Input
                                type="number"
                                {...control.register(`${name}.${index}.total` as const, { valueAsNumber: true })}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive mb-0.5"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">No items added.</div>
                )}
            </div>
        </div>
    );
}

import { Controller } from "react-hook-form";

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
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map((p: any) => (
                            <SelectItem key={p._id || p.id} value={p._id || p.id}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    )
}
