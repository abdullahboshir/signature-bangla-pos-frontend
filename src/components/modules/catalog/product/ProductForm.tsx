"use client";


import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Loader2, Upload, X, Trash2, Plus, Settings, LinkIcon } from "lucide-react";

import { useGetCategoriesQuery } from "@/redux/api/catalog/categoryApi";

import { useGetBrandsQuery } from "@/redux/api/catalog/brandApi";
import { useUploadFileMutation } from "@/redux/api/system/uploadApi";
import { useGetUnitsQuery } from "@/redux/api/catalog/unitApi";
import { useGetTaxsQuery } from "@/redux/api/finance/taxApi";

import {
    useCreateProductMutation,
    useUpdateProductMutation,
} from "@/redux/api/catalog/productApi";
import { useGetBusinessUnitByIdQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetAttributeGroupQuery } from "@/redux/api/catalog/attributeGroupApi";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { defaultProductValues, productSchema, ProductFormValues } from "./product.schema";
import { VariantGenerator } from "./components/VariantGenerator";
import { RelatedProducts } from "./components/RelatedProducts";
import {
    PRODUCT_STATUS,
    PRODUCT_STATUS_OPTIONS,
    DIMENSION_UNIT_OPTIONS,
    PRODUCT_DOMAIN_OPTIONS,
    AVAILABLE_MODULES_OPTIONS,
    WEIGHT_UNIT_OPTIONS
} from "@/constant/product.constant";



interface ProductFormProps {
    initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;
    const role = params["role"] as string;

    // RTK Query Hooks
    // RTK Query Hooks
    const { data: categories = [] } = useGetCategoriesQuery({});
    const { data: brands = [] } = useGetBrandsQuery({});
    const { data: units = [] } = useGetUnitsQuery({});
    const { data: taxes = [] } = useGetTaxsQuery({});

    // Fetch Business Unit to get Attribute Group
    // Assuming 'businessUnit' from params is the ID or Slug. If slug, we might need a different query or logic.
    // Based on previous context, 'business-unit' param seems to be the ID or Slug.
    // Let's assume ID for now as per other code, or check if we need to resolve it.
    // Actually in `ProductForm` params['business-unit'] is used.
    const { data: businessUnitData } = useGetBusinessUnitByIdQuery(businessUnit, { skip: !businessUnit });
    const attributeGroupId = businessUnitData?.attributeGroup?._id || businessUnitData?.attributeGroup;

    // Fetch Attribute Group Details
    const { data: attributeGroupData } = useGetAttributeGroupQuery(attributeGroupId, { skip: !attributeGroupId });
    const dynamicFields = attributeGroupData?.data?.fields || [];

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
            // Cleanup payload: Remove empty strings for optional ObjectId fields
            if (!payload.primaryCategory || payload.primaryCategory === "") delete payload.primaryCategory;
            // primaryCategory is likely required, but good to be safe if schema allows optional. 
            // In backend validation it says primaryCategory is optional in 'productBodySchema' (line 175).

            // Handle arrays of ObjectIds if they contain empty strings? (Less likely for Select multiple)

            if (!payload.warranty?.hasWarranty) {
                delete payload.warranty;
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


            // Sync root images with details images
            payload.images = payload.details?.images || [];
            // Sync root model and origin
            payload.productmodel = payload.details?.model || payload.productmodel || "";
            payload.origine = payload.details?.origin || payload.origine || "";
            // Sync root tax and delivery (Required by Backend)
            payload.tax = payload.pricing?.tax || payload.tax || { taxable: false, taxClass: "standard", taxRate: 0 };
            payload.delivery = payload.shipping?.delivery || payload.delivery || { estimatedDelivery: "3-5 days", availableFor: "home_delivery" };

            // Ensure physical properties are correctly mapped for variants
            if (payload.variants && Array.isArray(payload.variants)) {
                payload.variants = payload.variants.map((v: any) => ({
                    ...v,
                    physicalProperties: v.physicalProperties || {
                        weight: v.weight || 0,
                        weightUnit: v.weightUnit || "kg",
                        dimensions: v.dimensions || {
                            length: v.length || 0,
                            width: v.width || 0,
                            height: v.height || 0,
                            unit: v.dimensionUnit || "cm"
                        }
                    }
                }));
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
                        <TabsTrigger value="recommended">Recommended</TabsTrigger>
                        {dynamicFields.length > 0 && <TabsTrigger value="attributes">{attributeGroupData?.data?.name || "Attributes"}</TabsTrigger>}
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
                                <FormField
                                    control={form.control}
                                    name="nameBangla"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name (Bangla)</FormLabel>
                                            <FormControl><Input placeholder="পণ্যের নাম (বাংলায়)" {...field} /></FormControl>
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
                                                }} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {categories.map((c: any) => (
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
                                                        {units.map((u: any) => (
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
                                                        {brands.map((b: any) => (
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
                                                <Select onValueChange={field.onChange} value={field.value || PRODUCT_STATUS.DRAFT}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {PRODUCT_STATUS_OPTIONS.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator className="my-4" />
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold">Visibility & Channel Settings</h3>
                                    <FormField
                                        control={form.control}
                                        name="availableModules"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Available In Modules</FormLabel>
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {AVAILABLE_MODULES_OPTIONS.map((module) => (
                                                        <div key={module.value} className="flex items-center space-x-2 border rounded-md px-3 py-1 bg-background">
                                                            <Checkbox 
                                                                id={`module-${module.value}`}
                                                                checked={(field.value || []).includes(module.value)}
                                                                onCheckedChange={(checked) => {
                                                                    const current = field.value || [];
                                                                    if (checked) field.onChange([...current, module.value]);
                                                                    else field.onChange(current.filter(v => v !== module.value));
                                                                }}
                                                            />
                                                            <Label htmlFor={`module-${module.value}`} className="text-xs cursor-pointer">{module.label}</Label>
                                                        </div>
                                                    ))}
                                                </div>
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
                                                    const selectedTax = taxes.find((t: any) => t._id === val || t.name === val); // Assuming val is ID or Name depending on what we store
                                                    // Typically store ID. Let's assume ID.
                                                    if (selectedTax) {
                                                        form.setValue("pricing.tax.taxRate", selectedTax.rate);
                                                    }
                                                }} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Tax" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="standard">Standard (No Tax)</SelectItem>
                                                        {taxes.map((t: any) => (
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

                                <Separator className="my-4" />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Flash Sale Settings</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="pricing.flashSale.price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Flash Sale Price</FormLabel>
                                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pricing.flashSale.stock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Allocated</FormLabel>
                                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pricing.flashSale.startDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Date</FormLabel>
                                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pricing.flashSale.endDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Date</FormLabel>
                                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Wholesale Pricing Tiers</h3>
                                    <div className="border rounded-md p-4 space-y-2">
                                        {form.watch("pricing.wholesaleTiers")?.map((tier: any, index: number) => (
                                            <div key={index} className="grid grid-cols-7 gap-2 items-end">
                                                <div className="col-span-2">
                                                    <Label className="text-xs">Min Qty</Label>
                                                    <Input type="number" value={tier.minQuantity} onChange={(e) => {
                                                        const newTiers = [...(form.getValues("pricing.wholesaleTiers") || [])];
                                                        newTiers[index].minQuantity = parseFloat(e.target.value);
                                                        form.setValue("pricing.wholesaleTiers", newTiers);
                                                    }} className="h-8" />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">Max Qty (Opt)</Label>
                                                    <Input type="number" value={tier.maxQuantity || ''} onChange={(e) => {
                                                        const newTiers = [...(form.getValues("pricing.wholesaleTiers") || [])];
                                                        newTiers[index].maxQuantity = e.target.value ? parseFloat(e.target.value) : undefined;
                                                        form.setValue("pricing.wholesaleTiers", newTiers);
                                                    }} className="h-8" />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label className="text-xs">Unit Price</Label>
                                                    <Input type="number" value={tier.price} onChange={(e) => {
                                                        const newTiers = [...(form.getValues("pricing.wholesaleTiers") || [])];
                                                        newTiers[index].price = parseFloat(e.target.value);
                                                        form.setValue("pricing.wholesaleTiers", newTiers);
                                                    }} className="h-8" />
                                                </div>
                                                <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                                    const current = form.getValues("pricing.wholesaleTiers") || [];
                                                    form.setValue("pricing.wholesaleTiers", current.filter((_: any, i: number) => i !== index));
                                                }}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => {
                                            const current = form.getValues("pricing.wholesaleTiers") || [];
                                            form.setValue("pricing.wholesaleTiers", [...current, { minQuantity: 1, price: 0 }]);
                                        }}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Tier
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recommended">
                        <RelatedProducts form={form} />
                    </TabsContent>

                    <TabsContent value="inventory">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory Management</CardTitle>
                                <CardDescription>
                                    Stock management is handled via the <b>Purchase / GRN</b> module to ensure accurate accounting and history.
                                    Direct stock editing is disabled.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-md border text-sm text-muted-foreground mb-4">
                                    <p>To add stock, please create a new <b>Purchase Order</b>.</p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="inventory.inventory.stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Global Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    readOnly
                                                    className="bg-muted cursor-not-allowed"
                                                    title="Go to Purchase Module to add stock"
                                                />
                                            </FormControl>
                                            <FormDescription>Total stock across all outlets.</FormDescription>
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
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="details.video.provider"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Video Provider</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || "youtube"}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="youtube">YouTube</SelectItem>
                                                        <SelectItem value="vimeo">Vimeo</SelectItem>
                                                        <SelectItem value="dailymotion">Dailymotion</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="details.video.link"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Video Link (URL)</FormLabel>
                                                <FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Images placeholder */}
                                <div className="space-y-4">
                                    <FormLabel>Product Images</FormLabel>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-muted/50">
                                        <div className="flex flex-wrap gap-4 justify-center">
                                            {(form.watch("details.images") || []).map((img: string, idx: number) => (
                                                <div key={idx} className="relative group w-24 h-24 border rounded-md overflow-hidden bg-background">
                                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const current = form.getValues("details.images") || [];
                                                            form.setValue("details.images", current.filter((_, i) => i !== idx));
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <Upload className="h-8 w-8 mb-2" />
                                                <span className="text-xs">Upload from PC</span>
                                                 <Input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    id="img-upload"
                                                    onChange={async (e) => {
                                                        const files = e.target.files;
                                                        if (files && files.length > 0) {
                                                            try {
                                                                toast.info(`Uploading ${files.length} images...`);
                                                                const newUrls: string[] = [];

                                                                for (let i = 0; i < files.length; i++) {
                                                                    const formData = new FormData();
                                                                    formData.append('image', files[i]);
                                                                    const res = await uploadFile(formData).unwrap();
                                                                    const url = res?.url || res?.data?.url;
                                                                    if (url) newUrls.push(url);
                                                                }

                                                                if (newUrls.length > 0) {
                                                                    const current = form.getValues("details.images") || [];
                                                                    form.setValue("details.images", [...current, ...newUrls]);
                                                                    toast.success(`${newUrls.length} images uploaded!`);
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
                                                    placeholder="Or paste URLs (separated by comma or enter)"
                                                    className="h-8 text-xs"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = e.currentTarget.value;
                                                            if (val) {
                                                                const urls = val.split(/[,\s\n]+/).filter(u => u.trim() !== "");
                                                                const current = form.getValues("details.images") || [];
                                                                form.setValue("details.images", [...current, ...urls]);
                                                                e.currentTarget.value = "";
                                                                toast.success(`${urls.length} URLs added`);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <FormMessage>{form.formState.errors.details?.images?.message}</FormMessage>

                                    <Separator className="my-6" />

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold">Compliance & Safety</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                                            <FormField
                                                control={form.control}
                                                name="compliance.hasCertification"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                        <div className="space-y-1"><FormLabel>Has Certification</FormLabel></div>
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch("compliance.hasCertification") && (
                                                <FormField
                                                    control={form.control}
                                                    name="compliance.certifications"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Certifications (e.g. ISO, CE)</FormLabel>
                                                            <FormControl><Input placeholder="Certifications" {...field} value={field.value?.join(", ")} onChange={e => field.onChange(e.target.value.split(",").map(s => s.trim()))} /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                            <FormField
                                                control={form.control}
                                                name="compliance.safetyStandards"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Safety Standards</FormLabel>
                                                        <FormControl><Input placeholder="Safety Standards" {...field} /></FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="compliance.importRestrictions"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Import Restrictions</FormLabel>
                                                        <FormControl><Input placeholder="Import Restrictions" {...field} /></FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FormLabel>Product Videos (URLs)</FormLabel>
                                    <div className="space-y-2 border p-4 rounded-md">
                                        {form.watch("videos")?.length === 0 && <div className="text-xs text-muted-foreground">No videos added.</div>}
                                        {form.watch("videos")?.map((vid: string, idx: number) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <div className="flex-1 bg-muted p-2 rounded text-xs truncate font-mono" title={vid}>{vid}</div>
                                                <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => {
                                                    const current = form.getValues("videos") || [];
                                                    form.setValue("videos", current.filter((_, i) => i !== idx));
                                                }}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex gap-2 pt-2">
                                            <Input
                                                placeholder="Paste YouTube/Vimeo URL and press Enter"
                                                id="new-video-url"
                                                className="h-9 text-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const el = e.currentTarget;
                                                        if (el.value) {
                                                            const current = form.getValues("videos") || [];
                                                            form.setValue("videos", [...current, el.value]);
                                                            el.value = "";
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button type="button" size="sm" onClick={() => {
                                                const el = document.getElementById("new-video-url") as HTMLInputElement;
                                                if (el && el.value) {
                                                    const current = form.getValues("videos") || [];
                                                    form.setValue("videos", [...current, el.value]);
                                                    el.value = "";
                                                }
                                            }}>Add</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="attributes">
                        <Card>
                            <CardHeader>
                                <CardTitle>{attributeGroupData?.data?.name || "Product Attributes"}</CardTitle>
                                <CardDescription>
                                    {attributeGroupData?.data?.description || "Specific details for this product type."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {dynamicFields.map((field: any) => (
                                    <FormField
                                        key={field.key}
                                        control={form.control}
                                        name={`attributes.${field.key}`}
                                        render={({ field: formField }) => (
                                            <FormItem>
                                                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                                                <FormControl>
                                                    {field.type === 'textarea' ? (
                                                        <Textarea placeholder={field.placeholder} {...formField} />
                                                    ) : field.type === 'select' ? (
                                                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder={field.placeholder || "Select option"} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {field.options?.map((opt: string) => (
                                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : field.type === 'boolean' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                checked={formField.value}
                                                                onCheckedChange={formField.onChange}
                                                            />
                                                            <span>{formField.value ? "Yes" : "No"}</span>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                                            placeholder={field.placeholder}
                                                            {...formField}
                                                        />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                {dynamicFields.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No dynamic attributes defined for this Business Unit.
                                    </div>
                                )}
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
                                                <div key={field.id} className="grid grid-cols-8 gap-2 border p-2 rounded items-center">
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
                                                                                            toast.info(`Uploading ${files.length} variant images...`);

                                                                                            for (let i = 0; i < files.length; i++) {
                                                                                                const formData = new FormData();
                                                                                                formData.append('image', files[i]);
                                                                                                const res = await uploadFile(formData).unwrap();
                                                                                                const url = res?.url || res?.data?.url || (typeof res === 'string' ? res : null);
                                                                                                if (url) newUrls.push(url);
                                                                                            }

                                                                                            if (newUrls.length > 0) {
                                                                                                field.onChange([...(field.value || []), ...newUrls]);
                                                                                                toast.success(`${newUrls.length} variant images uploaded`);
                                                                                            }
                                                                                        } catch (err) {
                                                                                            console.error(err);
                                                                                            toast.error("Variant upload failed");
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </label>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <Button type="button" variant="outline" size="icon" className="h-12 w-12 border-dashed">
                                                                                    <LinkIcon className="h-4 w-4" />
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-80">
                                                                                <div className="space-y-2">
                                                                                    <Label className="text-xs">Paste Image URLs</Label>
                                                                                    <Input
                                                                                        placeholder="URLs separated by commas"
                                                                                        className="h-8 text-xs"
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter') {
                                                                                                e.preventDefault();
                                                                                                const val = e.currentTarget.value;
                                                                                                if (val) {
                                                                                                    const urls = val.split(/[,\s\n]+/).filter(u => u.trim() !== "");
                                                                                                    field.onChange([...(field.value || []), ...urls]);
                                                                                                    e.currentTarget.value = "";
                                                                                                    toast.success(`${urls.length} variant URLs added`);
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <p className="text-[10px] text-muted-foreground text-center">Press Enter to add</p>
                                                                                </div>
                                                                            </PopoverContent>
                                                                        </Popover>
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

                                                    <div className="col-span-1">
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.barcode` as any}
                                                            render={({ field }) => (
                                                                <FormItem className="space-y-0"><FormControl><Input placeholder="Barcode" className="h-8 text-xs" {...field} /></FormControl></FormItem>
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

                                                    <div className="col-span-1 flex justify-end gap-1">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                    <Settings className="h-4 w-4" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80">
                                                                <div className="grid gap-4">
                                                                    <div className="space-y-2">
                                                                        <h4 className="font-medium leading-none">Physical Properties</h4>
                                                                        <p className="text-sm text-muted-foreground">Set weight and dimensions for this variant.</p>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`variants.${index}.weight`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-1">
                                                                                    <FormLabel className="text-[10px] uppercase">Weight</FormLabel>
                                                                                    <FormControl><Input type="number" step="0.01" className="h-8 text-xs" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`variants.${index}.weightUnit`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-1">
                                                                                    <FormLabel className="text-[10px] uppercase">Unit</FormLabel>
                                                                                    <Select onValueChange={field.onChange} value={field.value || "kg"}>
                                                                                        <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger></FormControl>
                                                                                        <SelectContent>
                                                                                            {WEIGHT_UNIT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 gap-2">
                                                                        {['length', 'width', 'height'].map((dim) => (
                                                                            <FormField
                                                                                key={dim}
                                                                                control={form.control}
                                                                                name={`variants.${index}.${dim}` as any}
                                                                                render={({ field }) => (
                                                                                    <FormItem className="space-y-1">
                                                                                        <FormLabel className="text-[10px] uppercase">{dim[0]}</FormLabel>
                                                                                        <FormControl><Input type="number" step="0.01" className="h-8 text-xs" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        ))}
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`variants.${index}.dimensionUnit`}
                                                                            render={({ field }) => (
                                                                                <FormItem className="space-y-1">
                                                                                    <FormLabel className="text-[10px] uppercase">Unit</FormLabel>
                                                                                    <Select onValueChange={field.onChange} value={field.value || "cm"}>
                                                                                        <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger></FormControl>
                                                                                        <SelectContent>
                                                                                            {DIMENSION_UNIT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
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

                    {/* Shipping Content */}
                    <TabsContent value="shipping">
                            <Card>
                                <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight</FormLabel>
                                                    <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.weightUnit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {WEIGHT_UNIT_OPTIONS.map((unit) => (
                                                                <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Height</FormLabel>
                                                    <FormControl><Input type="number" step="0.01" placeholder="H" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.width"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Width</FormLabel>
                                                    <FormControl><Input type="number" step="0.01" placeholder="W" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.length"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Length</FormLabel>
                                                    <FormControl><Input type="number" step="0.01" placeholder="L" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            {DIMENSION_UNIT_OPTIONS.map((unit) => (
                                                                <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

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

