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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useCreateLicenseMutation, useUpdateLicenseMutation } from "@/redux/api/platform/licenseApi"
import { useGetPackagesQuery } from "@/redux/api/platform/packageApi"
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi"

// Helper to calculate expiry
const calculateExpiry = (durationDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + durationDays);
    return date.toISOString();
}

const licenseFormSchema = z.object({
    key: z.string().min(10, { message: "License key must be generated." }),
    packageId: z.string().min(1, { message: "Package is required." }),
    clientId: z.string().min(1, { message: "Business Unit (Client) is required." }), // Renamed and Required
    status: z.enum(["active", "inactive", "expired", "revoked"]).default("active"),
    expiresAt: z.string().optional(), // ISO String
})

type LicenseFormValues = z.infer<typeof licenseFormSchema>

interface LicenseFormProps {
    initialData?: any
    isEdit?: boolean
}

export default function LicenseForm({ initialData, isEdit = false }: LicenseFormProps) {
    const router = useRouter()
    const [createLicense, { isLoading: isCreating }] = useCreateLicenseMutation()
    const [updateLicense, { isLoading: isUpdating }] = useUpdateLicenseMutation()
    const { data: packagesData } = useGetPackagesQuery({})
    const { data: businessUnitsData } = useGetBusinessUnitsQuery({})

    // Safe packages array access
    const packages = Array.isArray((packagesData as any)?.data)
        ? (packagesData as any).data
        : (Array.isArray(packagesData) ? packagesData : []);

    // Safe BU array access
    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData : [];

    const isLoading = isCreating || isUpdating

    const form = useForm<LicenseFormValues>({
        resolver: zodResolver(licenseFormSchema),
        defaultValues: initialData || {
            key: "",
            packageId: "",
            status: "active",
            clientId: "",
        },
    })

    // Auto-generate key on mount if new
    useEffect(() => {
        if (!isEdit && !form.getValues("key")) {
            // Simple random key generator for demo: SIGNATURE-XXXX-XXXX-XXXX
            const randomPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();
            const newKey = `SIG-${randomPart()}-${randomPart()}-${randomPart()}`;
            form.setValue("key", newKey);
        }
    }, [isEdit, form]);

    async function onSubmit(data: LicenseFormValues) {
        try {
            if (isEdit && initialData?.id) {
                await updateLicense({ id: initialData.id, body: data }).unwrap()
                toast.success("License updated successfully")
            } else {
                await createLicense(data).unwrap()
                toast.success("License created successfully")
            }
            router.push("/platform/licenses")
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
                <h1 className="text-3xl font-bold tracking-tight">{isEdit ? "Edit License" : "Issue New License"}</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>License Details</CardTitle>
                            <CardDescription>Issue a license key for a specific package.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>License Key</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} className="font-mono bg-muted" />
                                        </FormControl>
                                        <FormDescription>Auto-generated unique key.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="packageId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Package Plan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a package" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {packages.map((pkg: any) => (
                                                    <SelectItem key={pkg.id || pkg._id} value={pkg.id || pkg._id}>
                                                        {pkg.name} ({pkg.price} {pkg.currency})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client / Business Unit</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Business Unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {businessUnits.map((bu: any) => (
                                                    <SelectItem key={bu.id || bu._id} value={bu.id || bu._id}>
                                                        {bu.name} ({bu.slug})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select the tenant for this license.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="revoked">Revoked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? "Update License" : "Issue License"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
