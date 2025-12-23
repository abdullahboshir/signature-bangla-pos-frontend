
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "../product.schema";

interface BasicInfoProps {
    form: UseFormReturn<ProductFormValues>;
    categories: any[];
    brands: any[];
    level1?: string;
    level2?: string;
    level3?: string;
    setLevel1?: (val: string) => void;
    setLevel2?: (val: string) => void;
    setLevel3?: (val: string) => void;
}

export const BasicInfo = ({ form, categories, brands, setLevel1, setLevel2, setLevel3 }: BasicInfoProps) => {
    // Watch category fields to drive the hierarchy options dynamically
    const watchedL1 = form.watch("primaryCategory");
    const watchedL2 = form.watch("subCategory");
    const watchedL3 = form.watch("childCategory");

    const getSafeId = (item: any) => {
        if (!item) return "";
        if (typeof item === 'string') return item.trim();
        return String(item._id || item.id || "").trim();
    };

    const selectedL1 = categories.find(c => getSafeId(c) === getSafeId(watchedL1));
    const selectedL2 = (selectedL1?.children || []).find((c: any) => getSafeId(c) === getSafeId(watchedL2));

    console.log("DEBUG: BasicInfo Render ->", {
        catsLen: categories?.length,
        brandsLen: brands?.length,
        wL1: watchedL1,
        wL2: watchedL2,
        wL3: watchedL3,
        l1hasChildren: selectedL1?.children?.length,
        l2hasChildren: selectedL2?.children?.length
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Wireless Headphones" {...field} />
                                </FormControl>
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
                                <FormControl>
                                    <Input placeholder="e.g. তারহীন হেডফোন" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input placeholder="Auto-generated if empty" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Hierarchy */}
                    <FormField
                        control={form.control}
                        name="primaryCategory"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    key={field.value || "empty"}
                                    onValueChange={(val) => {
                                        if (setLevel1) setLevel1(val);
                                        if (setLevel2) setLevel2("");
                                        if (setLevel3) setLevel3("");
                                        field.onChange(val);
                                        // Reset sub and child in form
                                        form.setValue("subCategory", "");
                                        form.setValue("childCategory", "");
                                        form.setValue('categories', [val]);
                                    }} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Main Category" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {categories.map((c: any) => <SelectItem key={c._id || c.id} value={c._id || c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => {
                            // Find selected Level 1 to get Level 2 options
                            const getSafeId = (item: any) => {
                                if (!item) return "";
                                if (typeof item === 'string') return item.trim();
                                return String(item._id || item.id || "").trim();
                            };

                            const selectedL1 = categories.find(c => getSafeId(c) === getSafeId(watchedL1));
                            const l2Ops = selectedL1?.children || [];

                            return (
                                <FormItem className="col-span-1">
                                    <FormLabel>Sub Category</FormLabel>
                                    <Select
                                        key={field.value || "empty"}
                                        disabled={!watchedL1 || l2Ops.length === 0}
                                        onValueChange={(val) => {
                                            if (setLevel2) setLevel2(val);
                                            if (setLevel3) setLevel3("");
                                            field.onChange(val);
                                            // Reset child in form
                                            form.setValue("childCategory", "");
                                            form.setValue('categories', [watchedL1, val]);
                                        }} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Sub Category" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {l2Ops.map((c: any) => <SelectItem key={c._id || c.id} value={c._id || c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="childCategory"
                        render={({ field }) => {
                            const getSafeId = (item: any) => {
                                if (!item) return "";
                                if (typeof item === 'string') return item.trim();
                                return String(item._id || item.id || "").trim();
                            };

                            // Find selected Level 1 and Level 2 to get Level 3 options
                            const selectedL1 = categories.find(c => getSafeId(c) === getSafeId(watchedL1));
                            const l2Ops = selectedL1?.children || [];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const selectedL2 = l2Ops.find((c: any) => getSafeId(c) === getSafeId(watchedL2));
                            const l3Ops = selectedL2?.children || [];

                            return (
                                <FormItem className="col-span-1">
                                    <FormLabel>Child Category</FormLabel>
                                    <Select
                                        key={field.value || "empty"}
                                        disabled={!watchedL2 || l3Ops.length === 0}
                                        onValueChange={(val) => {
                                            if (setLevel3) setLevel3(val);
                                            field.onChange(val);
                                            form.setValue('categories', [watchedL1, watchedL2 || "", val]);
                                        }} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Child Category" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {l3Ops.map((c: any) => <SelectItem key={c._id || c.id} value={c._id || c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="brands"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <Select
                                    key={field.value?.[0] || "empty"}
                                    onValueChange={(val) => field.onChange([val])}
                                    value={field.value?.[0] || ""}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {brands && brands.length > 0 ? (
                                            brands.map((brand: any) => (
                                                <SelectItem key={brand._id} value={brand._id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-muted-foreground text-center">No brands found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="details.origin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Origin</FormLabel>
                                <FormControl>
                                    <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags (Comma separated)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="mobile, electronics"
                                        value={field.value?.join(", ") || ""}
                                        onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tagsBangla"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags (Bangla)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="মোবাইল, ইলেকট্রনিক্স"
                                        value={field.value?.join(", ") || ""}
                                        onChange={(e) => field.onChange(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
