
import { UseFormReturn, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReplace, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantGenerator } from "./VariantGenerator";
import { ProductFormValues } from "../product.schema";
import { useUploadFileMutation } from "@/redux/api/system/uploadApi";
import { getImageUrl } from "@/lib/utils";
import { ImagePreview } from "./ImagePreview";

interface AttributeSectionProps {
    form: UseFormReturn<ProductFormValues>;
    variantFields: FieldArrayWithId<ProductFormValues, "variants", "id">[];
    appendVariant: UseFieldArrayAppend<ProductFormValues, "variants">;
    removeVariant: UseFieldArrayRemove;
    replaceVariant: UseFieldArrayReplace<ProductFormValues, "variants">;
}

export const AttributeSection = ({ form, variantFields, appendVariant, removeVariant, replaceVariant }: AttributeSectionProps) => {
    const [uploadFile] = useUploadFileMutation();
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
                                            // Using replaceVariant to ensure clean state update
                                            replaceVariant(variants);
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
                                    images: [],
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
                                            {/* Image Upload Column - Newly Added */}
                                            <div className="col-span-12 md:col-span-12 mb-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.images`}
                                                    render={({ field }) => (
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap gap-2">
                                                                {(field.value || []).map((img: string, imgIdx: number) => (
                                                                    <ImagePreview
                                                                        key={imgIdx}
                                                                        src={img}
                                                                        alt="Var"
                                                                        variant="compact"
                                                                        onRemove={() => {
                                                                            const newImages = [...(field.value || [])];
                                                                            newImages.splice(imgIdx, 1);
                                                                            field.onChange(newImages);
                                                                        }}
                                                                    />
                                                                ))}
                                                                <label className="flex items-center justify-center w-12 h-12 border border-dashed rounded cursor-pointer hover:bg-muted/50">
                                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        className="hidden"
                                                                        onChange={async (e) => {
                                                                            const files = e.target.files;
                                                                            if (files && files.length > 0) {
                                                                                try {
                                                                                    const newUrls: string[] = [];
                                                                                    toast.info(`Uploading ${files.length} images...`);

                                                                                    for (let i = 0; i < files.length; i++) {
                                                                                        const formData = new FormData();
                                                                                        formData.append('image', files[i]);
                                                                                        const res = await uploadFile(formData).unwrap();
                                                                                        // uploadApi transforms response to return the url string directly or response.data.url
                                                                                        // So 'res' should be the URL string if success
                                                                                        const url = typeof res === 'string' ? res : (res?.url || res?.data?.url);

                                                                                        console.log("Variant Upload Response:", { res, url });

                                                                                        if (url) {
                                                                                            newUrls.push(url);
                                                                                        }
                                                                                    }

                                                                                    if (newUrls.length > 0) {
                                                                                        field.onChange([...(field.value || []), ...newUrls]);
                                                                                        toast.success("Images uploaded");
                                                                                    }
                                                                                } catch (err) {
                                                                                    console.error(err);
                                                                                    toast.error("Upload failed");
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                            {/* Bulk Apply Options */}
                                                            {(field.value || []).length > 0 && form.watch(`variants.${index}.options`)?.map((opt: any, optIdx: number) => (
                                                                <Button
                                                                    key={optIdx}
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-6 text-[10px] mr-2"
                                                                    onClick={() => {
                                                                        const currentImages = field.value || [];
                                                                        const allVariants = form.getValues("variants") || [];
                                                                        const updatedVariants = allVariants.map(v => {
                                                                            const hasMatch = v.options.some((o: any) => o.name === opt.name && o.value === opt.value);
                                                                            if (hasMatch) {
                                                                                const existing = v.images || [];
                                                                                const merged = Array.from(new Set([...existing, ...currentImages]));
                                                                                return { ...v, images: merged };
                                                                            }
                                                                            return v;
                                                                        });

                                                                        replaceVariant(updatedVariants);
                                                                        toast.success(`Applied images to all ${opt.value} variants`);
                                                                    }}
                                                                >
                                                                    Apply to all "{opt.value}"
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </div>
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

