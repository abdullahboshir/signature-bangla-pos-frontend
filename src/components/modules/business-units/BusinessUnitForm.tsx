"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateBusinessUnitMutation, useUpdateBusinessUnitMutation, useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetCategoriesQuery } from "@/redux/api/catalog/categoryApi";

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
import { Loader2, Building2, MapPin, Globe, Settings, ShieldCheck, FileText, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ModuleMultiSelect } from "@/components/forms/module-multi-select";
import { MODULES } from "@/constant/modules";
import {
    BUSINESS_MODEL_OPTIONS,
    BUSINESS_INDUSTRY_OPTIONS,
    BUSINESS_MODEL,
    BUSINESS_INDUSTRY
} from "@/constant/business-unit.constant";
// Local constants for currencies and languages
const currencies = ["BDT", "USD"] as const;
const webLanguages = ["en", "bn"] as const;


const formSchema = z.object({
    // Identity
    name: z.string().min(2, "Name must be at least 2 characters"),
    id: z.string().min(2, "ID is required"),
    slug: z.string().min(2, "Slug is required"),

    // Architecture
    operationalModel: z.string().min(1, "Operational Model is required"),
    industry: z.string().min(1, "Industry is required"),

    // Contact
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),

    // Branding
    brandingName: z.string().min(2, "Branding Name is required"),
    brandingDescription: z.string().optional(),

    // Location
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),

    // Categorization
    primaryCategory: z.string().optional(),

    // Settings
    currency: z.enum(currencies),
    language: z.enum(webLanguages),
    timezone: z.string().default("Asia/Dhaka"),

    // Features
    hasInventory: z.boolean().default(true),
    hasVariants: z.boolean().default(true),
    hasShipping: z.boolean().default(true),
    hasSeo: z.boolean().default(true),
    hasBundles: z.boolean().default(true),

    // Policies (Optional)
    returnPolicy: z.string().optional(),
    shippingPolicy: z.string().optional(),

    // Modules
    activeModules: z.array(z.string()).default([]),
});


type FormValues = z.infer<typeof formSchema>;

interface BusinessUnitFormProps {
    slug?: string; // Optional: if provided, form is in edit mode
}

export function BusinessUnitForm({ slug }: BusinessUnitFormProps = {}) {
    const router = useRouter();
    const isEditMode = !!slug;

    const [createBusinessUnit, { isLoading: isCreating }] = useCreateBusinessUnitMutation();
    const [updateBusinessUnit, { isLoading: isUpdating }] = useUpdateBusinessUnitMutation();
    const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery({ limit: 100 });

    // Fetch business units for edit mode
    const { data: businessUnits = [], isLoading: loadingBU } = useGetBusinessUnitsQuery({}, {
        skip: !isEditMode // Only fetch if in edit mode
    });

    // Find business unit by slug
    const businessUnit = isEditMode
        ? businessUnits.find((bu: any) => bu.slug === slug || bu.id === slug)
        : null;

    const isLoading = isCreating || isUpdating;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            id: "",
            slug: "",
            operationalModel: BUSINESS_MODEL.RETAIL,
            industry: BUSINESS_INDUSTRY.GENERAL,
            contactEmail: "",
            contactPhone: "",
            website: "",
            brandingName: "",
            brandingDescription: "",
            address: "",
            city: "Dhaka",
            country: "Bangladesh",
            postalCode: "",
            primaryCategory: "",
            currency: "BDT",
            language: "en",
            timezone: "Asia/Dhaka",
            hasInventory: true,
            hasVariants: true,
            hasShipping: true,
            hasSeo: true,
            hasBundles: true,
            activeModules: [MODULES.POS, MODULES.ERP],
            returnPolicy: "",
            shippingPolicy: "",
        },
    });

    // Auto-generate ID/Slug/BrandingName from Name
    const watchName = form.watch("name");
    const { dirtyFields } = form.formState;

    useEffect(() => {
        if (watchName) {
            const slugified = watchName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            if (!dirtyFields.id) form.setValue("id", slugified);
            if (!dirtyFields.slug) form.setValue("slug", slugified);
            if (!dirtyFields.brandingName) form.setValue("brandingName", watchName);
        }
    }, [watchName, dirtyFields, form]);

    // Pre-populate form in edit mode
    useEffect(() => {
        if (isEditMode && businessUnit) {
            const activeModulesList = Object.entries(businessUnit.activeModules || {})
                .filter(([_, isActive]) => isActive)
                .map(([module]) => module);

            form.reset({
                name: businessUnit.name || "",
                id: businessUnit.id || "",
                slug: businessUnit.slug || "",
                operationalModel: businessUnit.operationalModel || BUSINESS_MODEL.RETAIL,
                industry: businessUnit.industry || BUSINESS_INDUSTRY.GENERAL,
                contactEmail: businessUnit.contact?.email || "",
                contactPhone: businessUnit.contact?.phone || "",
                website: businessUnit.contact?.website || "",
                brandingName: businessUnit.branding?.name || businessUnit.name || "",
                brandingDescription: businessUnit.branding?.description || "",
                address: businessUnit.location?.address || "",
                city: businessUnit.location?.city || "Dhaka",
                country: businessUnit.location?.country || "Bangladesh",
                postalCode: businessUnit.location?.postalCode || "",
                primaryCategory: businessUnit.primaryCategory || "",
                currency: businessUnit.settings?.currency || "BDT",
                language: businessUnit.settings?.language || "en",
                timezone: businessUnit.location?.timezone || businessUnit.settings?.timezone || "Asia/Dhaka",
                hasInventory: businessUnit.features?.hasInventory ?? true,
                hasVariants: businessUnit.features?.hasVariants ?? true,
                hasShipping: businessUnit.features?.hasShipping ?? true,
                hasSeo: businessUnit.features?.hasSeo ?? true,
                hasBundles: businessUnit.features?.hasBundles ?? true,
                activeModules: activeModulesList,
                returnPolicy: businessUnit.policies?.returnPolicy || "",
                shippingPolicy: businessUnit.policies?.shippingPolicy || "",
            });
        }
    }, [isEditMode, businessUnit, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            const payload = {
                name: values.name,
                ...(isEditMode ? {} : { id: values.id }),
                slug: values.slug,
                operationalModel: values.operationalModel,
                industry: values.industry,
                contact: {
                    email: values.contactEmail,
                    phone: values.contactPhone,
                    website: values.website
                },
                branding: {
                    name: values.brandingName,
                    description: values.brandingDescription
                },
                location: {
                    address: values.address,
                    city: values.city,
                    country: values.country,
                    postalCode: values.postalCode,
                    timezone: values.timezone
                },
                primaryCategory: values.primaryCategory || undefined,
                categories: values.primaryCategory ? [values.primaryCategory] : [],
                settings: {
                    currency: values.currency,
                    language: values.language,
                    timezone: values.timezone,
                    inventoryManagement: values.hasInventory
                },
                activeModules: Object.values(MODULES).reduce((acc, mod) => {
                    acc[mod] = values.activeModules.includes(mod);
                    return acc;
                }, {} as Record<string, boolean>),
                features: {
                    hasInventory: values.hasInventory,
                    hasVariants: values.hasVariants,
                    hasShipping: values.hasShipping,
                    hasSeo: values.hasSeo,
                    hasBundles: values.hasBundles
                },
                policies: {
                    returnPolicy: values.returnPolicy,
                    shippingPolicy: values.shippingPolicy
                },
                status: "published",
                visibility: "public"
            };

            if (isEditMode) {
                await updateBusinessUnit({ id: businessUnit?._id, body: payload }).unwrap();
                toast.success("Business unit updated successfully!");
            } else {
                await createBusinessUnit(payload).unwrap();
                toast.success("Business unit created successfully!");
            }
            router.push("/global/business-units");
        } catch (error: any) {
            console.error(`${isEditMode ? 'Update' : 'Create'} error:`, error);
            toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} business unit`);
        }
    };

    // Loading state for edit mode
    if (isEditMode && loadingBU) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not found state for edit mode
    if (isEditMode && !businessUnit) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Business Unit Not Found</h2>
                <p className="text-muted-foreground mb-4">The requested business unit doesn't exist.</p>
                <Button onClick={() => router.push("/global/business-units")}>
                    Back to Business Units
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    toast.error("Please check all tabs for validation errors");
                    console.log("Form Validation Errors:", errors);
                })} className="space-y-8">

                    <Tabs defaultValue="basic" className="w-full space-y-4">
                        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
                            <TabsTrigger value="basic">Identity & Model</TabsTrigger>
                            <TabsTrigger value="branding">Branding & Cat</TabsTrigger>
                            <TabsTrigger value="location">Contact & Loc</TabsTrigger>
                            <TabsTrigger value="settings">Settings & Config</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Core Identity</CardTitle>
                                    <CardDescription>Define the operational structure and industry</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Name & Type Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Business Unit Name <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Acme Retail" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="operationalModel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Operational Model</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Model" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {BUSINESS_MODEL_OPTIONS.map(t => (
                                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="text-xs">How the business operates (POS, B2B, etc)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Industry & IDs Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="industry"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Industry / Segment</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Industry" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {BUSINESS_INDUSTRY_OPTIONS.map(t => (
                                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="text-xs">The market niche (Fashion, Grocery, etc)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Unique ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="acme-retail" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="slug"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Slug</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="acme-retail" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="branding">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Category & Brand Story</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="primaryCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Primary Product Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {loadingCategories ? (
                                                            <div className="p-2 text-center text-sm">Loading...</div>
                                                        ) : (
                                                            categories.map((cat: any) => (
                                                                <SelectItem key={cat._id} value={cat._id}>
                                                                    {cat.name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Specific product catalog root</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                        <FormField
                                            control={form.control}
                                            name="brandingName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Display Brand Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="brandingDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Brand Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Describe the business unit story..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="location">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Contact & Location</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="contactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="contact@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="contactPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+880..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="postalCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Zip</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Operation Settings</CardTitle>
                                    <CardDescription>Configure currency, units and features</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="pt-4">
                                        <div className="mb-6">
                                            <h4 className="mb-2 text-sm font-medium">Active Modules</h4>
                                            <ModuleMultiSelect
                                                name="activeModules"
                                                label="Select System Modules to Enable"
                                                placeholder="Select modules..."
                                            />
                                            <FormDescription>
                                                These modules will be active for this business unit.
                                            </FormDescription>
                                        </div>

                                        <h4 className="mb-4 text-sm font-medium">Feature Toggles</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="hasInventory"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Inventory Management</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hasVariants"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Product Variants</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hasShipping"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Shipping Module</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="hasSeo"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Advanced SEO</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 sticky bottom-0 bg-background/80 p-4 border-t backdrop-blur z-10 transition-all">
                        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} size="lg">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Business Unit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
