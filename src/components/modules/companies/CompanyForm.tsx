
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useCreateCompanyMutation } from "@/redux/api/platform/companyApi"
import { Loader2, Building, ShieldCheck, User } from "lucide-react"

// Schema aligned with backend ICompany interface
const formSchema = z.object({
    // Branding (Required)
    branding: z.object({
        name: z.string().min(2, "Company name must be at least 2 characters."),
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            branding: { name: "" },
            contact: { email: "", phone: "" },
            location: { address: "", city: "", country: "Bangladesh", timezone: "Asia/Dhaka" },
            registrationNumber: "",
            businessType: "proprietorship",
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createCompany(values).unwrap();
            toast.success("Company created successfully! Owner will receive an email to set up their password.");
            onSuccess();
        } catch (error: any) {
            console.error("Company creation error:", error);
            toast.error(error?.data?.message || "Failed to create company");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid gap-6">

                        {/* Company Branding Section */}
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Building className="w-4 h-4" /> Company Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="branding.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name *</FormLabel>
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
                                                <Input placeholder="owner@company.com" {...field} />
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

                        {/* Module Configuration */}
                        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Building className="w-4 h-4" /> Module Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* POS */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.pos"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">POS System</FormLabel>
                                                <FormDescription className="text-xs">Retail terminal & config</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* ERP */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.erp"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">ERP Core</FormLabel>
                                                <FormDescription className="text-xs">Inv, Finance, Logistics</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        form.setValue("activeModules.finance", checked);
                                                        form.setValue("activeModules.logistics", checked);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* HRM */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.hrm"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">HRM & Payroll</FormLabel>
                                                <FormDescription className="text-xs">Staff management</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* E-Commerce */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.ecommerce"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">E-Commerce</FormLabel>
                                                <FormDescription className="text-xs">Storefront & CMS</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* CRM */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.crm"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">CRM Suite</FormLabel>
                                                <FormDescription className="text-xs">Customers & Marketing</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        form.setValue("activeModules.marketing", checked);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Integrations */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.integrations"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Integrations (Add-on)</FormLabel>
                                                <FormDescription className="text-xs">APIs, Webhooks & Gateways</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Governance */}
                                <FormField
                                    control={form.control}
                                    name="activeModules.governance"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 col-span-1 md:col-span-2">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base flex items-center gap-2">
                                                    Governance
                                                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                                                </FormLabel>
                                                <FormDescription className="text-xs">
                                                    Board-level management. Enable for Shareholder & Investor access.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end bg-background z-10 rounded-b-lg">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Company
                    </Button>
                </div>
            </form>
        </Form>
    )
}
