
import { UseFormReturn, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantGenerator } from "./VariantGenerator";
import { ProductFormValues } from "../product.schema";

interface AttributeSectionProps {
    form: UseFormReturn<ProductFormValues>;
    variantFields: FieldArrayWithId<ProductFormValues, "variants", "id">[];
    appendVariant: UseFieldArrayAppend<ProductFormValues, "variants">;
    removeVariant: UseFieldArrayRemove;
}

export const AttributeSection = ({ form, variantFields, appendVariant, removeVariant }: AttributeSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <FormDescription>Manage sizes, colors, and other variations.</FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="hasVariants"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Enable Variants</FormLabel>
                                <FormDescription>
                                    Check this if the product comes in multiple options (e.g. Size, Color).
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {form.watch("hasVariants") && (
                    <div className="space-y-4">
                        <div className="bg-muted/40 p-4 rounded-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Variant Generator</h4>
                            </div>
                            <div className="grid gap-4">
                                <div className="space-y-4">
                                    <VariantGenerator
                                        onGenerate={(variants: any[]) => {
                                            // Clear existing (optional, or append) - original code cleared logic was inside generator usage
                                            // Here we can decide. Original code:
                                            // form.setValue('variants', []);
                                            // variants.forEach(v => appendVariant(v));

                                            // We should likely clear previous to avoid duplicates or messy lists unless intended.
                                            form.setValue('variants', []);
                                            variants.forEach(v => appendVariant(v));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or add manually</span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({
                                    name: "",
                                    sku: "",
                                    price: 0,
                                    stock: 0,
                                    options: [],
                                    isDefault: false
                                })}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Single Variant
                                </Button>
                            </div>
                        </div>

                        {variantFields.length > 0 && (
                            <div className="border rounded-md">
                                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                                    <div className="col-span-3">Variant Name</div>
                                    <div className="col-span-3">SKU</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Stock</div>
                                    <div className="col-span-2 text-right">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {variantFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                                            <div className="col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Name" className="h-8" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.sku`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="SKU" className="h-8" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-8" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.stock`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-8" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)} className="h-8 w-8 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
