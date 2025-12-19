"use client";


import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Upload, X, Trash2 } from "lucide-react";

import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetSubCategoriesQuery, useGetSubCategoriesByParentQuery } from "@/redux/api/subCategoryApi";
import { useGetChildCategoriesQuery, useGetChildCategoriesByParentQuery } from "@/redux/api/childCategoryApi";
import { useGetBrandsQuery } from "@/redux/api/brandApi";
import { useGetUnitsQuery } from "@/redux/api/unitApi";
import { useGetTaxesQuery } from "@/redux/api/taxApi";
import {
    useCreateProductMutation,
    useUpdateProductMutation,
} from "@/redux/api/productApi";
import { useUploadFileMutation } from "@/redux/api/uploadApi";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { defaultProductValues, productSchema, ProductFormValues } from "./product.schema";
import { VariantGenerator } from "./components/VariantGenerator";



interface ProductFormProps {
    initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;
    const role = params["role"] as string;

    // RTK Query Hooks
    const { data: categories = [] } = useGetCategoriesQuery({});
    const { data: brands = [] } = useGetBrandsQuery({});
    const { data: units = [] } = useGetUnitsQuery({});
    const { data: taxes = [] } = useGetTaxesQuery({});

    // Mutations
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadFile] = useUploadFileMutation();

    const isLoading = isCreating || isUpdating;

    // Normalize initialData to handle populated fields (objects -> IDs)
    const normalizedDefaultValues = initialData ? {
        ...defaultProductValues,
        ...initialData,
        // Handle populated fields by extracting _id if they are objects
        primaryCategory: initialData.primaryCategory?._id || initialData.primaryCategory,
        subCategory: initialData.subCategory?._id || initialData.subCategory,
        childCategory: initialData.childCategory?._id || initialData.childCategory,
        unit: initialData.unit?._id || initialData.unit,
        businessUnit: initialData.businessUnit?._id || initialData.businessUnit,
        brands: initialData.brands?.map((b: any) => b._id || b) || [],

        // Ensure nested structures are preserved or re-mapped if needed
        pricing: {
            ...defaultProductValues.pricing,
            ...initialData.pricing,
            tax: {
                ...defaultProductValues.pricing.tax,
                ...(initialData.pricing?.tax || initialData.tax)
            }
        },
        inventory: {
            ...defaultProductValues.inventory,
            ...initialData.inventory,
            inventory: { // Fix double nesting if it exists in data but flattened in form or vice versa
                ...defaultProductValues.inventory.inventory,
                ...(initialData.inventory?.inventory || {})
            }
        },
        shipping: {
            ...defaultProductValues.shipping,
            ...initialData.shipping
        },
        details: {
            ...defaultProductValues.details,
            ...initialData.details
        },
        marketing: {
            ...defaultProductValues.marketing,
            ...initialData.marketing
        },
        statusInfo: {
            ...defaultProductValues.statusInfo,
            ...initialData.statusInfo
        },
        // Fix warranty: if it's an ID string (not populated), reset to default to pass Zod validation
        warranty: (initialData.warranty && typeof initialData.warranty === 'object' && !Array.isArray(initialData.warranty))
            ? initialData.warranty
            : defaultProductValues.warranty,
    } : defaultProductValues;

    const form = useForm<ProductFormValues>({
        // cast resolver to any to avoid complex type mismatches between Zod defaults and RHF types
        resolver: zodResolver(productSchema) as any,
        defaultValues: normalizedDefaultValues,
        mode: "onChange",
    });



    // Cascading Effects
    const selectedPrimary = form.watch("primaryCategory");
    const selectedSub = form.watch("subCategory");

    // Fetch Sub/Child based on selection
    // Note: We use 'skip' to prevent fetching when no parent is selected.
    const { data: subCategories = [] } = useGetSubCategoriesByParentQuery(
        selectedPrimary,
        { skip: !selectedPrimary }
    );

    const { data: childCategories = [] } = useGetChildCategoriesByParentQuery(
        selectedSub,
        { skip: !selectedSub }
    );

    // Calculation Logic (Moved to proper scope)
    const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariants } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Price Calculation Logic
    // Debugging Form Errors
    console.log("Form Errors:", form.formState.errors);

    const handlePriceCalculation = (type: 'cost' | 'selling' | 'margin', value: number) => {
        const cost = type === 'cost' ? value : form.getValues("pricing.costPrice") || 0;
        const selling = type === 'selling' ? value : form.getValues("pricing.basePrice") || 0;
        const margin = type === 'margin' ? value : form.getValues("pricing.profitMargin") || 0;
        const marginType = form.getValues("pricing.profitMarginType") || "percentage";

        if (type === 'cost') {
            if (margin > 0) {
                let newSelling = 0;
                if (marginType === "percentage") {
                    // Markup logic: Cost + (Cost * Margin%)
                    newSelling = cost * (1 + (margin / 100));
                } else {
                    newSelling = cost + margin;
                }
                form.setValue("pricing.basePrice", parseFloat(newSelling.toFixed(2)));
            }
            form.setValue("pricing.costPrice", value);
        } else if (type === 'selling') {
            if (value > 0 && cost >= 0) {
                let newMargin = 0;
                if (marginType === "percentage") {
                    // Margin = ((Selling - Cost) / Cost) * 100
                    if (cost > 0) newMargin = ((value - cost) / cost) * 100;
                    else newMargin = 100; // infinite markup if cost 0
                } else {
                    newMargin = value - cost;
                }
                form.setValue("pricing.profitMargin", parseFloat(newMargin.toFixed(2)));
            }
            form.setValue("pricing.basePrice", value);
        } else if (type === 'margin') {
            if (cost > 0) {
                let newSelling = 0;
                if (marginType === "percentage") {
                    newSelling = cost * (1 + (value / 100));
                } else {
                    newSelling = cost + value;
                }
                form.setValue("pricing.basePrice", parseFloat(newSelling.toFixed(2)));
            }
            form.setValue("pricing.profitMargin", value);
        }
    };

    // Watch for margin type change to recalculate
    const marginType = form.watch("pricing.profitMarginType");
    useEffect(() => {
        const cost = form.getValues("pricing.costPrice");
        const margin = form.getValues("pricing.profitMargin");
        if (cost && margin) {
            handlePriceCalculation('margin', margin);
        }
    }, [marginType]);





    const onSubmit = async (data: ProductFormValues) => {

        try {
            // Remove warranty from payload if it's default/invalid to preserve backend reference or avoid error
            const payload: any = { ...data, businessUnit };
            if (!payload.warranty?.hasWarranty) {
                delete payload.warranty;
            } else {
                // Or if it IS set but we want to ensure we don't send a partial object if backend strictly wants an ID?
                // Actually the error was "expected object, received string". This means we SENT a string (ID) but schema validation (Zod?) or Backend expected object?
                // Wait, backend model has Ref. Backend Update acts on `Partial<IProductDocument>`.
                // If we send an object for a Ref field in Mongoose update, it might fail if not careful?
                // The USER said "Invalid input: expected object, received string". This error likely comes from ZodResolver on Frontend BEFORE submit, OR from Backend validation?
                // If it's "Invalid input: expected object, received string", and the type is "invalid_type", it's likely Zod.
                // So fixing the form values (which we just did) should fix the submission payload too.
                // But let's be safe and clean the payload.
            }

            // Just ensuring we don't send the ID string back if it somehow persisted.
            // But since we reset form with Object, 'data.warranty' should be Object here.

            // However, IF the user didn't touch it and it was reset to default (because original was ID), 
            // we are sending default values. This overwrites the existing ID connection with "No Warranty".
            // That's acceptable if we can't edit it. Better than crashing.

            // For now, let's just proceed with the payload as is, assuming the form value fix solved the Zod error.
            // But wait, if I want to PRESERVE the existing warranty connection that was an ID, I should exclude 'warranty' from payload 
            // if I know I reset it to dummy default.

            // Check if we forced it to default
            if (initialData?.warranty && typeof initialData.warranty !== 'object') {
                delete payload.warranty;
            }


            if (initialData && initialData._id) {
                await updateProduct({ id: initialData._id, body: payload }).unwrap();
                toast.success("Product updated successfully!");
            } else {
                await createProduct(payload).unwrap();
                toast.success("Product created successfully!");
            }
            router.push(`/${role}/${businessUnit}/catalog/product`);
        } catch (error: any) {
            console.error("Product Save Error:", error);
            toast.error(error?.data?.message || "Failed to save product");
        } // Loading state handled by hooks
    };

    const onFormError = (errors: any) => {
        console.error("Form Validation Errors:", errors);
        toast.error("Please check the form for errors. Required fields are missing.");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-8 pb-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">{initialData ? "Edit Product" : "New Product"}</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Update Product" : "Save Product"}
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-2">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="variants">Variants</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <Card>
                            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl><Input placeholder="Product Name" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="primaryCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("categories", [val]); // Reset categories array to just this one + sub/child can verify later
                                                    form.setValue("subCategory", ""); // Reset sub
                                                    form.setValue("childCategory", ""); // Reset child
                                                }} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {categories.map((c) => (
                                                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sub-Category</FormLabel>
                                                <Select onValueChange={(val) => {
                                                    field.onChange(val);
                                                    form.setValue("childCategory", ""); // Reset child
                                                    // Update categories array to include this [primary, sub]
                                                    const primary = form.getValues("primaryCategory");
                                                    form.setValue("categories", [primary, val]);
                                                }} value={field.value} disabled={!subCategories.length}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Sub-Category" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {subCategories.map((c) => (
                                                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="childCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Child-Category</FormLabel>
                                                <Select onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Update categories array to include this [primary, sub, child]
                                                    const primary = form.getValues("primaryCategory");
                                                    const sub = form.getValues("subCategory");
                                                    // Filter out undefined if sub is somehow missing (shouldn't be)
                                                    const cats = [primary, sub, val].filter(Boolean) as string[];
                                                    form.setValue("categories", cats);
                                                }} value={field.value} disabled={!childCategories.length}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Child-Category" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {childCategories.map((c) => (
                                                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {units.map((u) => (
                                                            <SelectItem key={u._id} value={u._id}>{u.name} ({u.symbol})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="brands"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <Select onValueChange={(val) => field.onChange([val])} value={field.value?.[0] || ""}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {brands.map((b) => (
                                                            <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="statusInfo.status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || "draft"}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing">
                        <Card>
                            <CardHeader><CardTitle>Pricing & Tax</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="pricing.costPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cost Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => handlePriceCalculation('cost', parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.profitMarginType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profit Type</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || "percentage"}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.profitMargin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profit Margin</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => handlePriceCalculation('margin', parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.basePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Selling Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => handlePriceCalculation('selling', parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Rule</FormLabel>
                                                <Select onValueChange={(val) => {
                                                    field.onChange(val);
                                                    // Auto-set rate based on selection
                                                    const selectedTax = taxes.find(t => t._id === val || t.name === val); // Assuming val is ID or Name depending on what we store
                                                    // Typically store ID. Let's assume ID.
                                                    if (selectedTax) {
                                                        form.setValue("pricing.tax.taxRate", selectedTax.rate);
                                                    }
                                                }} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Tax" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="standard">Standard (No Tax)</SelectItem>
                                                        {taxes.map((t) => (
                                                            <SelectItem key={t._id} value={t._id}>{t.name} ({t.rate}%)</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Rate (%)</FormLabel>
                                                <FormControl><Input type="number" readOnly {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxInclusive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <FormLabel>Price includes Tax?</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inventory">
                        <Card>
                            <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="inventory.inventory.stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="inventory.inventory.trackQuantity"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel>Track Quantity</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="details.description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="details.shortDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="details.origin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Origin (Country)</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Images placeholder */}
                                <div className="space-y-4">
                                    <FormLabel>Product Images</FormLabel>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Current Images List */}
                                        {form.watch("details.images")?.map((img: string, idx: number) => (
                                            <div key={idx} className="relative group border rounded-md overflow-hidden aspect-square">
                                                <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        const current = form.getValues("details.images");
                                                        form.setValue("details.images", current.filter((_, i) => i !== idx));
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}

                                        {/* Add New Image Area */}
                                        <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 space-y-2 aspect-square text-muted-foreground hover:bg-muted/50 transition-colors">
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <Upload className="h-8 w-8 mb-2" />
                                                <span className="text-xs">Upload from PC</span>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="img-upload"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            try {
                                                                const formData = new FormData();
                                                                formData.append('image', file);
                                                                toast.info("Uploading image...");

                                                                const res = await uploadFile(formData).unwrap();

                                                                // Handle response structure { url: "..." } or { data: { url: "..." } }
                                                                const url = res?.url || res?.data?.url;
                                                                if (url) {
                                                                    const current = form.getValues("details.images") || [];
                                                                    form.setValue("details.images", [...current, url]);
                                                                    toast.success("Image uploaded!");
                                                                }
                                                            } catch (err) {
                                                                console.error(err);
                                                                toast.error("Upload failed");
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('img-upload')?.click()}>
                                                    Select File
                                                </Button>
                                            </div>
                                            <div className="w-full h-px bg-border my-2" />
                                            <div className="w-full">
                                                <Input
                                                    placeholder="Or paste URL"
                                                    className="h-8 text-xs"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.currentTarget.value;
                                                            if (val) {
                                                                const current = form.getValues("details.images") || [];
                                                                form.setValue("details.images", [...current, val]);
                                                                e.currentTarget.value = "";
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <FormMessage>{form.formState.errors.details?.images?.message}</FormMessage>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="variants">
                        <Card className="border-2 border-red-500"> {/* DEBUG: Red border to verify file update */}
                            <CardHeader>
                                <CardTitle>Variants (Debug: {variantFields.length} items)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="hasVariants"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-4 rounded-md">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Enable Variants</FormLabel></div>
                                        </FormItem>
                                    )}
                                />
                                {form.watch("hasVariants") && (
                                    <>
                                        <VariantGenerator onGenerate={(vars) => {
                                            replaceVariants(vars);
                                        }} />
                                        <div className="space-y-2 mt-4">
                                            {variantFields.map((field, index) => (
                                                <div key={field.id} className="grid grid-cols-7 gap-2 border p-2 rounded items-center">
                                                    {/* Image Column */}
                                                    <div className="col-span-1">
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.images`}
                                                            render={({ field }) => (
                                                                <div className="space-y-2">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {(field.value || []).map((img: string, imgIdx: number) => (
                                                                            <div key={imgIdx} className="relative w-12 h-12 border rounded overflow-hidden group">
                                                                                <img src={img} alt="Var" className="w-full h-full object-cover" />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="destructive"
                                                                                    size="icon"
                                                                                    className="absolute top-0 right-0 h-4 w-4 opacity-0 group-hover:opacity-100 p-0 rounded-none"
                                                                                    onClick={() => {
                                                                                        const newImages = [...(field.value || [])];
                                                                                        newImages.splice(imgIdx, 1);
                                                                                        field.onChange(newImages);
                                                                                    }}
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
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
                                                                                                const res = await uploadImage(formData).unwrap();

                                                                                                if (res.success) {
                                                                                                    newUrls.push(res.data.url);
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
                                                                            className="h-6 text-[10px] w-full"
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
                                                                                replaceVariants(updatedVariants);
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

                                                    <div className="col-span-2 text-sm font-medium truncate" title={field.name}>{field.name}</div>

                                                    <div className="col-span-1">
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.sku`}
                                                            render={({ field }) => (
                                                                <FormItem className="space-y-0"><FormControl><Input placeholder="SKU" className="h-8 text-xs" {...field} /></FormControl></FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0"><FormControl><Input type="number" placeholder="Price" className="h-8 text-xs" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.stock`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-0"><FormControl><Input type="number" placeholder="Stock" className="h-8 text-xs" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
                                                        )}
                                                    />

                                                    <div className="col-span-1 flex justify-end">
                                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => removeVariant(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shipping">
                        <Card>
                            <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="shipping.delivery.estimatedDelivery"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estimated Delivery</FormLabel>
                                            <FormControl><Input placeholder="e.g. 3-5 days" {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo">
                        <Card>
                            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="marketing.seo.metaTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="marketing.seo.metaDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </form>
        </Form>
    );
}
