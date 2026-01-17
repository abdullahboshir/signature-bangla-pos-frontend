"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useCreateCompanyMutation } from "@/redux/api/platform/companyApi"
import { useGetPackagesQuery } from "@/redux/api/platform/packageApi"
import { Loader2, Building, User, CreditCard } from "lucide-react"
import { ModuleFields } from "@/components/forms/organization/ModuleFields"

// Schema aligned with backend ICompany interface
const formSchema = z.object({
    // Branding (Required)
    branding: z.object({
        name: z.string().min(2, "Organization name must be at least 2 characters."),
    }),
    // Contact (Required)
    contact: z.object({
        email: z.string().email("Invalid email address."),
        phone: z.string().min(10, "Phone number required."),
    }),
    // Location
    location: z.object({
        address: z.string().min(5, "Address required."),
        city: z.string().optional(),
        country: z.string(),
        timezone: z.string(),
    }),
    // Registration
    registrationNumber: z.string().min(2, "Registration number is required."),
    businessType: z.enum(["proprietorship", "partnership", "private_limited", "public_limited", "ngo", "cooperative"]),
    // Package & Licenses
    packageId: z.string().min(1, "Subscription package is required."),
    // Legal Representative (Owner Info)
    legalRepresentative: z.object({
        name: z.string().min(2, "Owner name is required."),
        contactPhone: z.string().optional(),
        nationalId: z.string().optional(),
    }),
    // Module Configuration
    activeModules: z.object({
        pos: z.boolean(),
        erp: z.boolean(),
        hrm: z.boolean(),
        ecommerce: z.boolean(),
        crm: z.boolean(),
        logistics: z.boolean(),
        finance: z.boolean(),
        marketing: z.boolean(),
        integrations: z.boolean(),
        governance: z.boolean(),
        saas: z.boolean(),
    })
})

interface CompanyFormProps {
    onSuccess: () => void;
}

export function CompanyForm({ onSuccess }: CompanyFormProps) {
    const [createCompany, { isLoading }] = useCreateCompanyMutation();
    const { data: packagesData, isLoading: isLoadingPackages } = useGetPackagesQuery({ status: "active" });

    const packages = Array.isArray(packagesData) ? packagesData : (packagesData as any)?.data || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            branding: { name: "" },
            contact: { email: "", phone: "" },
            location: { address: "", city: "", country: "Bangladesh", timezone: "Asia/Dhaka" },
            registrationNumber: "",
            businessType: "proprietorship",
            packageId: "",
            legalRepresentative: { name: "", contactPhone: "", nationalId: "" },
            activeModules: {
                pos: true,
                erp: true,
                hrm: false,
                ecommerce: false,
                crm: false,
                logistics: false,
                finance: false,
                marketing: false,
                integrations: false,
                governance: false,
                saas: true
            }
        },
    })

    const selectedPackageId = form.watch("packageId");
    const activeModules = form.watch("activeModules");

    const pkg = useMemo(() => packages.find((p: any) => p._id === selectedPackageId), [packages, selectedPackageId]);

    const calculatedPrice = useMemo(() => {
        if (!pkg) return 0;
        let total = pkg.price;
        Object.entries(activeModules).forEach(([key, enabled]) => {
            if (enabled) {
                const config = (pkg.moduleAccess as any)[key];
                if (config && !config.enabled) {
                    total += config.monthlyPrice || 0;
                }
            }
        });
        return total;
    }, [pkg, activeModules]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createCompany({
                ...values,
                totalPrice: calculatedPrice
            }).unwrap();
            toast.success("Organization created successfully! Owner will receive an email to set up their password.");
            onSuccess();
        } catch (error: any) {
            console.error("Organization creation error:", error);
            toast.error(error?.data?.message || "Failed to create organization");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid gap-6">

                        {/* Organization Branding Section */}
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Building className="w-4 h-4" /> Organization Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="branding.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Organization Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Acme Corp" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="registrationNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration / BIN *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="BN-123456" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="businessType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="proprietorship">Proprietorship</SelectItem>
                                                    <SelectItem value="partnership">Partnership</SelectItem>
                                                    <SelectItem value="private_limited">Private Limited</SelectItem>
                                                    <SelectItem value="public_limited">Public Limited</SelectItem>
                                                    <SelectItem value="ngo">NGO</SelectItem>
                                                    <SelectItem value="cooperative">Cooperative</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location.address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dhaka, Bangladesh" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact & Owner Section */}
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Owner & Contact Details
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                The owner will receive an email invitation to set up their password and access the dashboard.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="legalRepresentative.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Owner Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="legalRepresentative.nationalId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NID Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1234567890123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="contact.email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Owner Email *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="owner@organization.com" {...field} />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Password setup link will be sent here
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contact.phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+880..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Subscription & Pricing Section */}
                        <div className="space-y-4 rounded-lg border-2 border-primary/20 p-4 bg-primary/5">
                            <h3 className="font-bold flex items-center justify-between gap-2 text-primary">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Subscription Plan
                                </div>
                                {pkg && (
                                    <div className="text-right">
                                        <div className="text-xl font-black">{calculatedPrice.toLocaleString()} BDT</div>
                                        <div className="text-[10px] uppercase tracking-wider font-normal text-muted-foreground opacity-70">Total Monthly Cost</div>
                                    </div>
                                )}
                            </h3>

                            <FormField
                                control={form.control}
                                name="packageId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select onValueChange={(val) => {
                                                field.onChange(val);
                                                const p = packages.find((pkg: any) => pkg._id === val);
                                                if (p) {
                                                    // Sync modules with package defaults
                                                    Object.entries(p.moduleAccess).forEach(([k, v]: any) => {
                                                        form.setValue(`activeModules.${k}` as any, v.enabled);
                                                    });
                                                }
                                            }} value={field.value}>
                                                <SelectTrigger className="h-12 bg-background border-primary/20">
                                                    <SelectValue placeholder="Select a base plan..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {isLoadingPackages ? (
                                                        <div className="p-4 text-center text-sm">Loading plans...</div>
                                                    ) : packages.map((pkg: any) => (
                                                        <SelectItem key={pkg._id} value={pkg._id}>
                                                            {pkg.name} — {pkg.price.toLocaleString()} BDT/mo
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {pkg && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {Object.entries(pkg.moduleAccess).map(([key, config]: [string, any]) => {
                                        const isExtra = !config.enabled && activeModules[key as keyof typeof activeModules];
                                        if (config.monthlyPrice === 0 && !config.enabled) return null;
                                        return (
                                            <div key={key} className={cn(
                                                "flex items-center justify-between px-3 py-1.5 rounded border text-[11px]",
                                                activeModules[key as keyof typeof activeModules] ? "bg-white border-primary/30" : "bg-muted/30 border-transparent opacity-50"
                                            )}>
                                                <span className="capitalize font-medium">{key}</span>
                                                <span className={cn("font-bold", isExtra ? "text-emerald-600" : "text-muted-foreground")}>
                                                    {config.enabled ? "INCLUDED" : `+${config.monthlyPrice}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <div className={cn("transition-all duration-300", !selectedPackageId && "grayscale opacity-50 pointer-events-none")}>
                                <ModuleFields prefix="activeModules" />
                            </div>
                            {!selectedPackageId && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm text-xs font-bold text-primary">
                                        Select a Package Plan First
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end bg-background z-10 rounded-b-lg">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Organization
                    </Button>
                </div>
            </form>
        </Form>
    )
}
