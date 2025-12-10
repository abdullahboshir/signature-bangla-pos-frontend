
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner or similar toast
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { defaultProductValues, productSchema, ProductFormValues } from "./product.schema";
import { productService } from "@/services/catalog/product.service";

// Helper component for Variant Generation
function VariantGenerator({ onGenerate }: { onGenerate: (variants: any[]) => void }) {
    const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([
        { name: "Size", values: [] }, // Default example
        { name: "Color", values: [] }
    ]);

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [] }]);
    };

    const removeAttribute = (index: number) => {
        const newAttrs = [...attributes];
        newAttrs.splice(index, 1);
        setAttributes(newAttrs);
    };

    const updateAttributeName = (index: number, name: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].name = name;
        setAttributes(newAttrs);
    };

    const addValue = (index: number, value: string) => {
        if (!value.trim()) return;
        const newAttrs = [...attributes];
        if (!newAttrs[index].values.includes(value)) {
            newAttrs[index].values.push(value);
        }
        setAttributes(newAttrs);
    };

    const removeValue = (attrIndex: number, valIndex: number) => {
        const newAttrs = [...attributes];
        newAttrs[attrIndex].values.splice(valIndex, 1);
        setAttributes(newAttrs);
    };

    const handleGenerate = () => {
        // Cartesian Product Logic
        // Filter out empty attributes
        const validAttributes = attributes.filter(a => a.name && a.values.length > 0);

        if (validAttributes.length === 0) {
            toast.error("Please add at least one attribute with values.");
            return;
        }

        const cartesian = (args: any[][]) => {
            const r: any[] = [];
            const max = args.length - 1;
            function helper(arr: any[], i: number) {
                for (let j = 0, l = args[i].length; j < l; j++) {
                    const a = arr.slice(0); // clone arr
                    a.push(args[i][j]);
                    if (i === max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        };

        const combinations = cartesian(validAttributes.map(a => a.values.map(v => ({ name: a.name, value: v }))));

        const generatedVariants = combinations.map(combo => {
            const name = combo.map((c: any) => c.value).join(" - "); // e.g. "Small - Red"
            return {
                name: name,
                sku: "", // User to fill or auto-generate
                price: 0,
                stock: 0,
                options: combo, // [{name: 'Size', value: 'Small'}, {name: 'Color', value: 'Red'}]
                isDefault: false
            };
        });

        onGenerate(generatedVariants);
        toast.success(`Generated ${generatedVariants.length} variants!`);
    };

    return (
        <div className="space-y-4 border p-4 rounded bg-background">
            {attributes.map((attr, idx) => (
                <div key={idx} className="space-y-2">
                    <div className="flex gap-2 items-start">
                        <div className="flex-1">
                            <label className="text-xs font-medium">Attribute Name (e.g. Size)</label>
                            <Input
                                value={attr.name}
                                onChange={(e) => updateAttributeName(idx, e.target.value)}
                                placeholder="Attribute Name"
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="mt-5" onClick={() => removeAttribute(idx)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center pl-2 border-l-2">
                        {attr.values.map((val, vIdx) => (
                            <span key={vIdx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                                {val}
                                <button type="button" onClick={() => removeValue(idx, vIdx)} className="hover:text-destructive">×</button>
                            </span>
                        ))}
                        <div className="flex items-center gap-1">
                            <Input
                                className="h-7 w-24 text-xs"
                                placeholder="Value..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addValue(idx, e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                addValue(idx, input.value);
                                input.value = "";
                            }}>
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={addAttribute}>
                    <Plus className="mr-2 h-3 w-3" /> Add Attribute
                </Button>
                <Button type="button" size="sm" onClick={handleGenerate}>
                    Generate Variants
                </Button>
            </div>
        </div>
    );
}

export default function AddProductForm() {
    const router = useRouter();
    const params = useParams();
    const businessUnit = params["business-unit"] as string;

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);

    // Initialize Form
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: defaultProductValues,
        mode: "onChange",
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    // Fetch Dependencies
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, brnds] = await Promise.all([
                    productService.getCategories(),
                    productService.getBrands()
                ]);

                // DATA DEBUGGING
                console.log("Fetched Categories:", cats);

                // Helper to build tree if flat
                const buildTree = (items: any[]) => {
                    if (!items || !Array.isArray(items)) return [];
                    const map = new Map();
                    items.forEach(c => map.set(c._id || c.id, { ...c, children: [] }));
                    const roots: any[] = [];
                    items.forEach(c => {
                        const parentId = c.parent || c.parentId || c.parent_id;
                        if (parentId && map.has(parentId)) {
                            map.get(parentId).children.push(map.get(c._id || c.id));
                        } else {
                            roots.push(map.get(c._id || c.id));
                        }
                    });
                    return roots;
                };

                // Check if categories are already nested
                const isNested = cats.some((c: any) => c.children && c.children.length > 0);

                if (isNested) {
                    setCategories(cats);
                } else {
                    console.log("Detected flat categories, building tree...");
                    const tree = buildTree(cats);
                    setCategories(tree);
                }

                setBrands(brnds);
            } catch (error) {
                console.error("Error fetching dependencies:", error);
                toast.error("Failed to load categories or brands");
            }
        };
        fetchData();
    }, []);

    // Handle Submit
    const onSubmit = async (data: ProductFormValues) => {
        setIsLoading(true);
        try {
            // Inject Business Unit ID (Assuming backend needs ID, but for now passing slug or we need to fetch ID)
            // Ideally businessUnit should be an ID. 
            // NOTE: We need to fetch Business Unit ID based on slug OR standard way is context.
            // For now, let's assume the backend resolves slug or we pass it as is to validation schema if generic string allowed.
            // Checking validation: businessUnit is "objectIdSchema". This will fail if we pass a slug like "telemedicine".
            // We need to fetch the Business Unit ID.

            // Temporary: We will let the backend resolve it OR fetch it.
            // Implementing a quick look up if we have it in categories or user context.

            // Workaround: We will rely on default default value or context.
            // Actually, let's patch the data with a dummy ID for now if not present, OR fetch real ID.

            const payload = { ...data, businessUnit };

            await productService.create(payload as any);
            toast.success("Product created successfully!");
            router.push("/products"); // Adjust redirect as needed
        } catch (error: any) {
            console.error("Create Product Error:", error);
            toast.error(error?.response?.data?.message || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-7 lg:w-[800px]">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="variants">Variants</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>

                    {/* === BASIC INFO === */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="primaryCategory"
                                        render={({ field }) => {
                                            // Helper to find selected category object from ID
                                            const findCategory = (id: string, list: any[]): any => {
                                                for (const cat of list) {
                                                    if (cat._id === id) return cat;
                                                    if (cat.children) {
                                                        const found = findCategory(id, cat.children);
                                                        if (found) return found;
                                                    }
                                                }
                                                return null;
                                            };

                                            // State to track hierarchy locally for display
                                            // Ideally we derive this from field.value but for creation flow local state + effect is easier
                                            // However, form state is source of truth.
                                            // Better approach: Derived state from watching form values implies full path storage.
                                            // Current schema only stores 'categories' array and 'primaryCategory'.

                                            // Let's implement independent Selects that update the main form state.
                                            // We need to know the PATH of the selected category.
                                            // Since we only have `categories` flat array or `primaryCategory` ID, we'll traverse `categories` prop.

                                            const [level1, setLevel1] = useState<string>("");
                                            const [level2, setLevel2] = useState<string>("");
                                            const [level3, setLevel3] = useState<string>("");

                                            // Options based on selection
                                            const level1Options = categories;
                                            const level2Options = level1 ? categories.find(c => c._id === level1)?.children || [] : [];
                                            const level3Options = level2 ? level2Options.find((c: any) => c._id === level2)?.children || [] : [];

                                            return (
                                                <FormItem className="col-span-1">
                                                    <FormLabel>Category Hierarchy</FormLabel>
                                                    <div className="space-y-2">
                                                        {/* Level 1 */}
                                                        <div className="flex gap-2">
                                                            <Select onValueChange={(val) => {
                                                                setLevel1(val);
                                                                setLevel2("");
                                                                setLevel3("");
                                                                field.onChange(val); // Set primary to this for now
                                                                form.setValue('categories', [val]); // Reset path
                                                            }} value={level1}>
                                                                <FormControl>
                                                                    <SelectTrigger className="flex-1">
                                                                        <SelectValue placeholder="Select Main Category" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {level1Options.map((c: any) => (
                                                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button type="button" variant="outline" size="icon" onClick={() => toast.info("Quick Category Add coming soon!")} title="Add New Category">
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Level 2 */}
                                                        {level1Options.find((c: any) => c._id === level1)?.children?.length > 0 && (
                                                            <Select onValueChange={(val) => {
                                                                setLevel2(val);
                                                                setLevel3("");
                                                                field.onChange(val);
                                                                form.setValue('categories', [level1, val]);
                                                            }} value={level2}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Sub-Category" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {level2Options.map((c: any) => (
                                                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}

                                                        {/* Level 3 */}
                                                        {level2Options.find((c: any) => c._id === level2)?.children?.length > 0 && (
                                                            <Select onValueChange={(val) => {
                                                                setLevel3(val);
                                                                field.onChange(val);
                                                                form.setValue('categories', [level1, level2, val]);
                                                            }} value={level3}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select Child Category" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {level3Options.map((c: any) => (
                                                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}

                                                        <div className="flex justify-end">
                                                            <Button variant="link" size="sm" className="h-auto p-0 text-xs" type="button" onClick={() => router.push("/catalog/categories")}>
                                                                Manage Categories
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />

                                    {/* Brand Select (Simplified) */}
                                    <FormField
                                        control={form.control}
                                        name="details.manufacturer" // Mapping brand to manufacturer for now or separate field if schema has brands ID
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand / Manufacturer</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Brand Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="details.origin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country of Origin</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. China" {...field} />
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
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter tags separated by comma (e.g. mobile, electronics)"
                                                    value={field.value?.join(", ") || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val.split(",").map(t => t.trim()).filter(Boolean));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>Separate tags with commas.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader><CardTitle>Organization & Status</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="unit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit of Measure</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="piece">Piece</SelectItem>
                                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                                        <SelectItem value="gram">Gram (g)</SelectItem>
                                                        <SelectItem value="litre">Litre (L)</SelectItem>
                                                        <SelectItem value="ml">Millilitre (ml)</SelectItem>
                                                        <SelectItem value="dozen">Dozen</SelectItem>
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
                                                <FormLabel>Product Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="under_review">Under Review</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormLabel>Marketing Flags</FormLabel>
                                    <div className="flex flex-wrap gap-4">
                                        <FormField
                                            control={form.control}
                                            name="marketing.isFeatured"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Featured Product</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="marketing.isNew"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>New Arrival</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="marketing.isBestSeller"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel>Best Seller</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === PRICING === */}
                    <TabsContent value="pricing">
                        <Card>
                            <CardHeader><CardTitle>Pricing & Tax</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="pricing.basePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Base Selling Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.costPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cost Price</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Currency</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="BDT">BDT</SelectItem>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator />
                                <div className="grid grid-cols-3 gap-4 items-end">
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Class</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="standard">Standard</SelectItem>
                                                        <SelectItem value="reduced">Reduced</SelectItem>
                                                        <SelectItem value="zero">Zero-Rated</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Rate (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pricing.tax.taxInclusive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Tax Inclusive</FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === INVENTORY === */}
                    <TabsContent value="inventory">
                        <Card>
                            <CardHeader><CardTitle>Inventory Management</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="inventory.inventory.stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Initial Stock Quantity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inventory.inventory.lowStockThreshold"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Low Stock Alert Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="inventory.inventory.trackQuantity"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>Track Quantity</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inventory.inventory.allowBackorder"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel>Allow Backorders (Continue selling when out of stock)</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === DETAILS === */}
                    <TabsContent value="details">
                        <Card>
                            <CardHeader><CardTitle>Description & Media</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="details.shortDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description (Summary)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Brief summary of the product..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="details.description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-[200px]" placeholder="Detailed product description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Images</FormLabel>
                                    <div className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground">
                                        <Upload className="h-10 w-10 mb-2" />
                                        <p>Image Upload Coming Soon</p>
                                        <p className="text-xs">For now, enter image URLs manually below</p>
                                    </div>
                                    {/* Temporary URL input for images */}
                                    <FormField
                                        control={form.control}
                                        name="details.images.0"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader><CardTitle>Warranty & Return Policy</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="warranty.warranty.hasWarranty"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-md">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel>Has Warranty?</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="warranty.warranty.duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (Months)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === VARIANTS === */}
                    <TabsContent value="variants">
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
                                                    {/* Attributes Input Area - Simplified for MVP */}
                                                    {/* In a real app, we'd have dynamic array for attributes like [{name: 'Color', values: ['Red', 'Blue']}] */}
                                                    {/* For now, let's allow adding manually or we can build the generator. Let's build a simple generator. */}

                                                    <VariantGenerator
                                                        onGenerate={(variants: any[]) => {
                                                            // Clear existing
                                                            form.setValue('variants', []);
                                                            // Add new
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

                                        <div className="border rounded-md">
                                            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                                                <div className="col-span-3">Variant Name</div>
                                                <div className="col-span-3">SKU</div>
                                                <div className="col-span-2">Price</div>
                                                <div className="col-span-2">Stock</div>
                                                <div className="col-span-2">Action</div>
                                            </div>
                                            {variantFields.map((field, index) => (
                                                <div key={field.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                                                    <div className="col-span-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`variants.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g. Red - Small" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
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
                                                                        <Input placeholder="SKU" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
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
                                                                        <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                                    </FormControl>
                                                                    <FormMessage />
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
                                                                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {variantFields.length === 0 && (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No variants added. Click "Add Variant" to start.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === SHIPPING === */}
                    <TabsContent value="shipping">
                        <Card>
                            <CardHeader><CardTitle>Shipping & Delivery</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="shipping.physicalProperties.weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                    <Select defaultValue="kg">
                                                        <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                                                        <SelectContent><SelectItem value="kg">kg</SelectItem></SelectContent>
                                                    </Select>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.length"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Length</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.width"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Width</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shipping.physicalProperties.dimensions.height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Height</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="shipping.delivery.estimatedDelivery"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estimated Delivery Time</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 3-5 Business Days" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === SEO === */}
                    <TabsContent value="seo">
                        <Card>
                            <CardHeader><CardTitle>Search Engine Optimization</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="marketing.seo.metaTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SEO Title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="marketing.seo.metaDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="SEO Description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
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
