"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Save, Sparkles, Settings, ShieldCheck, HeartPulse, Palette, Boxes } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { useCreatePackageMutation, useUpdatePackageMutation } from "@/redux/api/platform/packageApi"
import { PACKAGE_FEATURES, PACKAGE_LIMITS, SUBSCRIPTION_CYCLES, SUPPORT_PRIORITIES, SUPPORT_CHANNELS } from "@/config/package-features"

// --- Zod Schema ---
const packageFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    recommendedFor: z.string().optional(),
    highlightText: z.string().optional(),
    icon: z.string().default("Package"),
    headerColor: z.string().optional(),
    tags: z.string().optional(), // Will be split by comma

    price: z.coerce.number().min(0),
    currency: z.string().default("BDT"),
    billingCycle: z.enum(["monthly", "yearly", "lifetime"]),

    isActive: z.boolean().default(true),
    isPublic: z.boolean().default(true),
    isRecommended: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isDefaultPlan: z.boolean().default(false),
    isHidden: z.boolean().default(false),

    status: z.enum(["active", "inactive", "archived"]).default("active"),

    setupFee: z.coerce.number().default(0),
    gracePeriodDays: z.coerce.number().default(7),
    supportType: z.enum(["basic", "priority", "dedicated"]).default("basic"),
    supportTicketPriority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    supportChannels: z.array(z.string()).default([]),
    allowCustomOverride: z.boolean().default(true),

    // --- Legal & Security ---
    tosUrl: z.string().optional(),
    privacyPolicyUrl: z.string().optional(),
    maxConcurrentLogins: z.coerce.number().default(5),

    // --- New Backend Parity Fields ---
    features: z.string().optional(), // Multi-line bullet points
    appliesTo: z.enum(["organization", "business-unit"]).default("business-unit"),
    trialPeriodDays: z.coerce.number().default(0),
    sortOrder: z.coerce.number().default(0),

    // Dynamic Limits
    limits: z.object(
        PACKAGE_LIMITS.reduce((acc, limit) => {
            acc[limit.key] = z.coerce.number().min(-1);
            return acc;
        }, {} as Record<string, any>)
    ),
    // Dynamic Modules
    moduleAccess: z.object(
        PACKAGE_FEATURES.reduce((acc, feature) => {
            acc[feature.key] = z.object({
                enabled: z.boolean().default(false),
                monthlyPrice: z.coerce.number().default(0)
            });
            return acc;
        }, {} as Record<string, any>)
    ),
})

type PackageFormValues = z.infer<typeof packageFormSchema>

interface PackageFormProps {
    initialData?: any
    isEdit?: boolean
}

export default function PackageForm({ initialData, isEdit = false }: PackageFormProps) {
    const router = useRouter()
    const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation()
    const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation()

    const isLoading = isCreating || isUpdating

    const defaultValues: Partial<PackageFormValues> = {
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        recommendedFor: "",
        highlightText: "",
        icon: "Package",
        headerColor: "#3b82f6",
        tags: "",
        price: 0,
        currency: "BDT",
        billingCycle: "monthly",
        isActive: true,
        isPublic: true,
        isRecommended: false,
        isFeatured: false,
        isDefaultPlan: false,
        status: "active",
        setupFee: 0,
        gracePeriodDays: 7,
        supportType: "basic",
        supportTicketPriority: "medium",
        supportChannels: [],
        allowCustomOverride: true,
        tosUrl: "",
        privacyPolicyUrl: "",
        maxConcurrentLogins: 5,
        features: "",
        appliesTo: "business-unit",
        trialPeriodDays: 0,
        sortOrder: 0,
        limits: PACKAGE_LIMITS.reduce((acc, limit) => ({ ...acc, [limit.key]: -1 }), {}),
        moduleAccess: PACKAGE_FEATURES.reduce((acc, feature) => ({
            ...acc,
            [feature.key]: { enabled: (feature as any).mandatory || false, monthlyPrice: 0 }
        }), {}),
    }

    const form = useForm<PackageFormValues>({
        resolver: zodResolver(packageFormSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
            tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags || ""
        } : defaultValues,
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...defaultValues,
                ...initialData,
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : initialData.tags || "",
                features: Array.isArray(initialData.features) ? initialData.features.join("\n") : initialData.features || "",
                moduleAccess: PACKAGE_FEATURES.reduce((acc, feature) => {
                    const existing = initialData.moduleAccess?.[feature.key];
                    (acc as any)[feature.key] = {
                        enabled: typeof existing === 'boolean' ? existing : (existing?.enabled || false),
                        monthlyPrice: existing?.monthlyPrice || 0
                    };
                    return acc;
                }, {}),
                limits: {
                    ...defaultValues.limits,
                    ...(initialData.limits || {})
                },
                appliesTo: initialData.appliesTo || "business-unit",
                trialPeriodDays: initialData.trialPeriodDays || 0,
                sortOrder: initialData.sortOrder || 0
            })
        }
    }, [initialData, form])

    async function onSubmit(values: PackageFormValues) {
        try {
            const payload = {
                ...values,
                tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                features: values.features ? values.features.split("\n").map(f => f.trim()).filter(Boolean) : []
            };

            if (isEdit && initialData?.id) {
                await updatePackage({ id: initialData.id, body: payload }).unwrap()
                toast.success("Package updated successfully")
            } else {
                await createPackage(payload).unwrap()
                toast.success("Package created successfully")
            }
            router.push("/platform/packages")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Plan" : "Create New Plan"}</h1>
                        <p className="text-sm text-muted-foreground italic">
                            Define a new subscription tier with custom limits and pricing.
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <CardTitle>Brand & Identity</CardTitle>
                                            <CardDescription>How this package appears on pricing pages.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Package Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Enterprise Pro" {...field} onChange={e => {
                                                            field.onChange(e);
                                                            if (!isEdit) form.setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                                                        }} />
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
                                                    <FormLabel>URL Slug</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="enterprise-pro" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="shortDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>One-liner (Short Description)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Best for large chains with 10+ outlets" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Description</FormLabel>
                                                <FormControl>
                                                    <Textarea className="min-h-[100px]" placeholder="Detailed description of the plan..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="highlightText"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Highlight ribbon text</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Most Popular" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="icon"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Icon Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Zap, Star, Shield" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="appliesTo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Target Audience</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="organization">Entire Organization</SelectItem>
                                                            <SelectItem value="business-unit">Individual Outlet/BU</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sortOrder"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rank / Sort Order</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Boxes className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <CardTitle>Modules & Add-ons</CardTitle>
                                            <CardDescription>Control access and set per-module modular pricing.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {PACKAGE_FEATURES.map((feature) => (
                                            <div key={feature.key} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                                <div className="flex gap-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`moduleAccess.${feature.key}.enabled` as any}
                                                        render={({ field }) => (
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    disabled={(feature as any).mandatory}
                                                                />
                                                            </FormControl>
                                                        )}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold">{feature.label}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{feature.key}</p>
                                                    </div>
                                                </div>
                                                <div className="w-24">
                                                    <FormField
                                                        control={form.control}
                                                        name={`moduleAccess.${feature.key}.monthlyPrice` as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <div className="relative">
                                                                        <Input type="number" className="h-8 text-xs pl-4" {...field} value={field.value ?? 0} />
                                                                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground">৳</span>
                                                                    </div>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <CardTitle>Quantitative Resource Limits</CardTitle>
                                            <CardDescription>Hard limits for system resources. (-1 for Unlimited)</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {PACKAGE_LIMITS.map((limit) => (
                                        <FormField
                                            key={limit.key}
                                            control={form.control}
                                            name={`limits.${limit.key}` as any}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">{limit.label}</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-9" {...field} value={field.value ?? -1} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Pricing & Ops */}
                        <div className="space-y-6">
                            <Card className="border-primary/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg">Subscription Model</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Base Price</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} readOnly className="bg-muted" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="billingCycle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Billing Cycle</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {SUBSCRIPTION_CYCLES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="setupFee"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Setup Fee (One-time)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="trialPeriodDays"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Free Trial (Days)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Marketplace Features</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="features"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground uppercase">Point-by-Point Feature List</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="min-h-[150px] font-mono text-xs"
                                                        placeholder="One feature per line...&#10;Unlimited Cloud Storage&#10;24/7 Dedicated Support&#10;Custom API Access"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-[10px]">
                                                    Enter each feature on a new line. These will appear as bullet points on the pricing card.
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <HeartPulse className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Support & SLA</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="supportType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Support Tier</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="basic">Basic (48h Email)</SelectItem>
                                                        <SelectItem value="priority">Priority (24h Chat)</SelectItem>
                                                        <SelectItem value="dedicated">Dedicated Manager</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <FormLabel className="text-xs">Support Channels</FormLabel>
                                        <div className="grid grid-cols-1 gap-2 border p-3 rounded-lg bg-muted/20">
                                            {SUPPORT_CHANNELS.map((item) => (
                                                <FormField
                                                    key={item.value}
                                                    control={form.control}
                                                    name="supportChannels"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem key={item.value} className="flex flex-row items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.value)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...(field.value || []), item.value])
                                                                                : field.onChange(field.value?.filter((value) => value !== item.value))
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-xs font-normal cursor-pointer">
                                                                    {item.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Palette className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Legal & Security</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="tosUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">TOS URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="privacyPolicyUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Privacy Policy URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxConcurrentLogins"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Max Concurrent Logins</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Settings className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-lg">Visibility & Status</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { label: "Publicly Visible", key: "isPublic" as const, desc: "Show on the main pricing page." },
                                        { label: "Best Value / Pop", key: "isRecommended" as const, desc: "Add recommendation badges." },
                                        { label: "Default Plan", key: "isDefaultPlan" as const, desc: "Pre-select for new businesses." },
                                        { label: "Allow Manual Overrides", key: "allowCustomOverride" as const, desc: "Let admins customize limits per-client." },
                                    ].map((sw) => (
                                        <FormField
                                            key={sw.key}
                                            control={form.control}
                                            name={sw.key}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between rounded-lg border p-3 bg-muted/10">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-xs">{sw.label}</FormLabel>
                                                        <FormDescription className="text-[10px]">{sw.desc}</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="fixed bottom-6 right-6 flex gap-3 shadow-2xl p-4 bg-background border rounded-xl">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="gap-2 px-8">
                            {isLoading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" /> : <Save className="h-4 w-4" />}
                            {isEdit ? "Save Configuration" : "Publish Plan"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
