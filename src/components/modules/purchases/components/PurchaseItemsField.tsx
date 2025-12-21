"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface Action {
    control: Control<any>;
    name: string;
    businessUnit?: string;
}

export function PurchaseItemsField({ control, name, businessUnit }: Action) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    // Fetch products, filtered by BU if provided
    const { data: products = [] } = useGetProductsQuery({
        businessUnit // If undefined, fetches all (for SA) or filtered by token (for Role)
    });

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

            <div className="border rounded-md p-2 space-y-2 max-h-[300px] overflow-y-auto w-full">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-end border-b pb-2 last:border-0">
                        <div className="flex-1 space-y-1 w-full sm:w-auto">
                            <label className="text-xs">Product</label>
                            <ProductSelect
                                control={control}
                                index={index}
                                name={name}
                                products={Array.isArray(products) ? products : (products as any)?.results || []}
                                onProductSelect={(prod) => {
                                    // Optional: Auto-fill cost
                                }}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
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
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">No items added.</div>
                )}
            </div>
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
                    <SelectTrigger className="h-9 w-full">
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
