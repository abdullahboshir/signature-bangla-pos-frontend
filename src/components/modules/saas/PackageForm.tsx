"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useCreatePackageMutation, useUpdatePackageMutation } from "@/redux/api/platform/packageApi"
import { PACKAGE_FEATURES, PACKAGE_LIMITS, SUBSCRIPTION_CYCLES } from "@/config/package-features"

// --- Zod Schema ---
const packageFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    currency: z.string().default("BDT"),
    billingCycle: z.enum(["monthly", "yearly", "lifetime"]),
    isActive: z.boolean().default(true),
    // Dynamic Limits
    limits: z.object(
        PACKAGE_LIMITS.reduce((acc, limit) => {
            acc[limit.key] = z.coerce.number().min(-1); // -1 for unlimited
            return acc;
        }, {} as Record<string, any>)
    ),
    // Dynamic Modules
    moduleAccess: z.object(
        PACKAGE_FEATURES.reduce((acc, feature) => {
            acc[feature.key] = z.boolean().default(false);
            return acc;
        }, {} as Record<string, any>)
    ),
})

type PackageFormValues = z.infer<typeof packageFormSchema>

interface PackageFormProps {
    initialData?: any // Loose type for now, corresponds to Package entity
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
        price: 0,
        currency: "BDT",
        billingCycle: "monthly",
        isActive: true,
        limits: PACKAGE_LIMITS.reduce((acc, limit) => ({ ...acc, [limit.key]: 0 }), {}),
        moduleAccess: PACKAGE_FEATURES.reduce((acc, feature) => ({ ...acc, [feature.key]: false }), {}),
    }

    const form = useForm<PackageFormValues>({
        resolver: zodResolver(packageFormSchema),
        defaultValues: initialData || defaultValues,
    })

    // Reset form when initialData loads (if editing)
    useEffect(() => {
        if (initialData) {
            form.reset({
                ...defaultValues,
                ...initialData,
                moduleAccess: {
                    ...defaultValues.moduleAccess,
                    ...(initialData.moduleAccess || {})
                },
                limits: {
                    ...defaultValues.limits,
                    ...(initialData.limits || {})
                }
            })
        }
    }, [initialData, form])

    async function onSubmit(data: PackageFormValues) {
        try {
            if (isEdit && initialData?.id) {
                await updatePackage({ id: initialData.id, body: data }).unwrap()
                toast.success("Package updated successfully")
            } else {
                await createPackage(data).unwrap()
                toast.success("Package created successfully")
            }
            router.push("/global/packages")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            toast.error(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{isEdit ? "Edit Package" : "New Package"}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>General details about the subscription plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Starter Plan" {...field} onChange={e => {
                                                field.onChange(e);
                                                if (!isEdit) {
                                                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                                    form.setValue('slug', slug);
                                                }
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
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="starter-plan" {...field} />
                                        </FormControl>
                                        <FormDescription>Unique identifier for URL and API.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="billingCycle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billing Cycle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a cycle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {SUBSCRIPTION_CYCLES.map(cycle => (
                                                    <SelectItem key={cycle.value} value={cycle.value}>{cycle.label} ({cycle.durationDays} days)</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center space-x-2 pt-8">
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Active Status</FormLabel>
                                                <FormDescription>
                                                    Visible to customers for purchase.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Modules */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Features & Modules</CardTitle>
                            <CardDescription>Select which modules are accessible in this plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {PACKAGE_FEATURES.map((feature) => (
                                    <FormField
                                        key={feature.key}
                                        control={form.control}
                                        name={`moduleAccess.${feature.key}`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        {feature.label}
                                                    </FormLabel>
                                                    <FormDescription>
                                                        {feature.description}
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Limits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Usage Limits</CardTitle>
                            <CardDescription>Set numeric limits for resources. Use -1 for Unlimited.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {PACKAGE_LIMITS.map((limit) => (
                                    <FormField
                                        key={limit.key}
                                        control={form.control}
                                        name={`limits.${limit.key}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{limit.label}</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormDescription>{limit.description}</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? "Update Package" : "Create Package"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
