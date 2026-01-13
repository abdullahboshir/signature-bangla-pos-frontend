"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCreateBusinessUnitMutation, useUpdateBusinessUnitMutation, useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { isSuperAdmin as checkIsSuperAdmin, USER_ROLES } from "@/config/auth-constants";
import { Loader2, Building2, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODULES } from "@/constant/modules";
import {
    BUSINESS_MODEL_OPTIONS,
    BUSINESS_INDUSTRY_OPTIONS,
    BUSINESS_MODEL,
    BUSINESS_INDUSTRY
} from "@/constant/business-unit.constant";

// Shared Components
import InputField from "@/components/forms/InputField";
import { BrandingFields } from "@/components/forms/organization/BrandingFields";
import { ContactFields } from "@/components/forms/organization/ContactFields";
import { LocationFields } from "@/components/forms/organization/LocationFields";
import { ModuleFields } from "@/components/forms/organization/ModuleFields";

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

    // Branding (Nested)
    branding: z.object({
        name: z.string().min(2, "Branding Name is required"),
        description: z.string().optional(),
        tagline: z.string().optional(),
        logoUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        faviconUrl: z.string().optional(),
        theme: z.object({
            primaryColor: z.string().default("#3B82F6"),
            secondaryColor: z.string().default("#1E40AF"),
            accentColor: z.string().default("#F59E0B"),
            fontFamily: z.string().default("Inter"),
        }),
    }),

    // Contact (Nested)
    contact: z.object({
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
        website: z.string().optional().or(z.literal("")),
        supportPhone: z.string().optional(),
        socialMedia: z.object({
            facebook: z.string().optional(),
            instagram: z.string().optional(),
            twitter: z.string().optional(),
            youtube: z.string().optional(),
            linkedin: z.string().optional(),
        }),
    }),

    // Location (Nested)
    location: z.object({
        address: z.string().min(5, "Address must be at least 5 characters"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        timezone: z.string().default("Asia/Dhaka"),
        coordinates: z.object({
            lat: z.string().optional(),
            lng: z.string().optional(),
        }).optional(),
    }),

    // Settings & Features
    settings: z.object({
        currency: z.enum(currencies).default("BDT"),
        language: z.enum(webLanguages).default("en"),
        timezone: z.string().default("Asia/Dhaka"),
    }),

    // Modules (Allow undefined to prevent silent blocks during creation)
    activeModules: z.record(z.string(), z.boolean().or(z.undefined())).default({}),

    // Context
    company: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessUnitFormProps {
    slug?: string;
}

export function BusinessUnitForm({ slug }: BusinessUnitFormProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyIdFromUrl = searchParams.get("company");
    const isEditMode = !!slug;

    const [createBusinessUnit, { isLoading: isCreating }] = useCreateBusinessUnitMutation();
    const [updateBusinessUnit, { isLoading: isUpdating }] = useUpdateBusinessUnitMutation();
    const { data: businessUnits = [], isLoading: loadingBU } = useGetBusinessUnitsQuery({}, { skip: !isEditMode });
    const { data: rawCompanies, isLoading: isLoadingCompanies } = useGetAllCompaniesQuery({});
    const { user } = useAuth();
    const isSuperAdmin = checkIsSuperAdmin(user?.role) || (user?.globalRoles || []).some((r: any) => {
        const rName = typeof r === 'string' ? r : r.id || r.name;
        return checkIsSuperAdmin(rName);
    });

    const allCompanies = Array.isArray(rawCompanies) ? rawCompanies : (rawCompanies?.data || rawCompanies?.result || []);

    useEffect(() => {
        console.log('BU_FORM_DEBUG:', {
            isEditMode,
            companyIdFromUrl,
            allCompaniesCount: allCompanies.length,
            isSuperAdmin,
            userRoles: user?.globalRoles,
            rawCompaniesData: !!rawCompanies,
            isLoadingCompanies
        });
    }, [isEditMode, companyIdFromUrl, allCompanies, isSuperAdmin, user, rawCompanies, isLoadingCompanies]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            id: "",
            slug: "",
            operationalModel: BUSINESS_MODEL.RETAIL,
            industry: BUSINESS_INDUSTRY.GENERAL,
            branding: { name: "", description: "", theme: { primaryColor: "#3B82F6", secondaryColor: "#1E40AF", accentColor: "#F59E0B", fontFamily: "Inter" } },
            contact: { email: "", phone: "", website: "", socialMedia: {} },
            location: { address: "", city: "Dhaka", state: "Dhaka", country: "Bangladesh", postalCode: "", timezone: "Asia/Dhaka" },
            settings: { currency: "BDT", language: "en", timezone: "Asia/Dhaka" },
            activeModules: {
                [MODULES.POS]: true,
                [MODULES.ERP]: true,
                [MODULES.HRM]: false,
                [MODULES.ECOMMERCE]: false,
                [MODULES.CRM]: false,
                [MODULES.LOGISTICS]: false,
                [MODULES.GOVERNANCE]: false,
                [MODULES.INTEGRATIONS]: false,
                [MODULES.SAAS]: false,
            },
            company: companyIdFromUrl || (allCompanies.length === 1 && !isSuperAdmin ? (allCompanies[0]._id || allCompanies[0].id) : ""),
        },
    });

    const selectedCompanyId = form.watch("company") || companyIdFromUrl;
    const parentCompany = allCompanies.find((c: any) => c?._id === selectedCompanyId || c.id === selectedCompanyId);
    const companyName = parentCompany?.name || "Unknown Company";
    const allowedModules = parentCompany?.activeModules;

    const businessUnit = isEditMode ? businessUnits.find((bu: any) => bu.slug === slug || bu.id === slug) : null;

    const watchName = form.watch("name");
    useEffect(() => {
        if (watchName) {
            const slugified = watchName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            if (!form.formState.dirtyFields.id) form.setValue("id", slugified);
            if (!form.formState.dirtyFields.slug) form.setValue("slug", slugified);
            if (!form.formState.dirtyFields.branding?.name) form.setValue("branding.name", watchName);
        }
    }, [watchName, form]);

    // Initialize form with company context from URL if available (for New mode)
    useEffect(() => {
        if (!isEditMode && companyIdFromUrl && !form.getValues("company")) {
            form.setValue("company", companyIdFromUrl);
        }
    }, [isEditMode, companyIdFromUrl, form]);

    // [New] Auto-select company if only one is available (for Company Owners)
    useEffect(() => {
        if (!isEditMode && !companyIdFromUrl && allCompanies.length === 1 && !form.getValues("company")) {
            const singleCompanyId = allCompanies[0]._id || allCompanies[0].id;
            form.setValue("company", singleCompanyId);
        }
    }, [isEditMode, companyIdFromUrl, allCompanies, form]);

    // PRE-SELECT: Auto-enable modules from parent Company on creation
    useEffect(() => {
        if (!isEditMode && allowedModules && !form.formState.dirtyFields.activeModules) {
            form.setValue("activeModules", allowedModules);
        }
    }, [isEditMode, allowedModules, form]);

    useEffect(() => {
        if (isEditMode && businessUnit) {
            form.reset({
                name: businessUnit.name || "",
                id: businessUnit.id || "",
                slug: businessUnit.slug || "",
                operationalModel: businessUnit.operationalModel || BUSINESS_MODEL.RETAIL,
                industry: businessUnit.industry || BUSINESS_INDUSTRY.GENERAL,
                branding: {
                    name: businessUnit.branding?.name || businessUnit.name || "",
                    description: businessUnit.branding?.description || "",
                    tagline: businessUnit.branding?.tagline || "",
                    logoUrl: businessUnit.branding?.logoUrl || "",
                    bannerUrl: businessUnit.branding?.bannerUrl || "",
                    faviconUrl: businessUnit.branding?.faviconUrl || "",
                    theme: businessUnit.branding?.theme || { primaryColor: "#3B82F6", secondaryColor: "#1E40AF", accentColor: "#F59E0B", fontFamily: "Inter" }
                },
                contact: {
                    email: businessUnit.contact?.email || "",
                    phone: businessUnit.contact?.phone || "",
                    website: businessUnit.contact?.website || "",
                    supportPhone: businessUnit.contact?.supportPhone || "",
                    socialMedia: businessUnit.contact?.socialMedia || {},
                },
                location: {
                    address: businessUnit.location?.address || "",
                    city: businessUnit.location?.city || "Dhaka",
                    state: businessUnit.location?.state || "Dhaka",
                    country: businessUnit.location?.country || "Bangladesh",
                    postalCode: businessUnit.location?.postalCode || "",
                    timezone: businessUnit.location?.timezone || "Asia/Dhaka",
                    coordinates: {
                        lat: businessUnit.location?.coordinates?.lat?.toString() || "",
                        lng: businessUnit.location?.coordinates?.lng?.toString() || "",
                    }
                },
                settings: businessUnit.settings || { currency: "BDT", language: "en", timezone: "Asia/Dhaka" },
                activeModules: businessUnit.activeModules || {},
                company: businessUnit.company?._id || businessUnit.company?.id || businessUnit.company || "",
            });
        }
    }, [isEditMode, businessUnit, form]);

    useEffect(() => {
        const errors = form.formState.errors;
        if (Object.keys(errors).length > 0) {
            console.error('BU_FORM_ERRORS:', errors);
            // Optionally show a toast for general awareness
            if (form.formState.isSubmitted) {
                toast.error("Form validation failed. Please check all tabs for errors.");
            }
        }
    }, [form.formState.errors, form.formState.isSubmitted]);

    const onSubmit = async (values: FormValues) => {
        console.log('BU_FORM_SUBMIT_START:', values);
        try {
            const finalCompanyId = values.company || selectedCompanyId || companyIdFromUrl;
            if (!finalCompanyId) {
                console.error('BU_FORM_ERROR: No company ID found');
                return;
            }

            const payload = {
                ...values,
                company: finalCompanyId,
                branding: {
                    ...values.branding,
                    logo: values.branding.logoUrl || "",
                    banner: values.branding.bannerUrl || "",
                    favicon: values.branding.faviconUrl || "",
                },
                location: {
                    ...values.location,
                    coordinates: values.location.coordinates?.lat && values.location.coordinates?.lng
                        ? { lat: Number(values.location.coordinates.lat), lng: Number(values.location.coordinates.lng) }
                        : undefined
                },
                // Add missing objects required by backend validation
                policies: {
                    returnPolicy: "",
                    shippingPolicy: "",
                    privacyPolicy: "",
                    termsOfService: "",
                    warrantyPolicy: "",
                    refundPolicy: ""
                },
                seo: {
                    metaTitle: values.branding.name,
                    metaDescription: values.branding.description || "",
                    keywords: [],
                    canonicalUrl: "",
                    ogImage: values.branding.logoUrl || ""
                }
            };

            if (!payload.company) {
                toast.error("Company context is missing. Please select a company first.");
                return;
            }

            if (isEditMode) {
                await updateBusinessUnit({ id: businessUnit?._id, body: payload }).unwrap();
                toast.success("Business unit updated successfully!");
            } else {
                await createBusinessUnit(payload).unwrap();
                toast.success("Business unit created successfully!");
            }
            router.back();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} business unit`);
        }
    };

    if (isEditMode && loadingBU) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
                        <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        <p className="text-sm font-medium">Please fix the validation errors in the form before submitting.</p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-7 text-[10px]"
                            onClick={() => console.log(form.formState.errors)}
                        >
                            View Details
                        </Button>
                    </div>
                )}

                <Tabs defaultValue="basic" className="w-full space-y-4">
                    <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1">
                        <TabsTrigger value="basic">Identity</TabsTrigger>
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                        <TabsTrigger value="modules">Modules</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Core Identity</CardTitle>
                                <CardDescription>Define the operational structure and industry</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Company Selection Logic: 
                                        1. If coming from URL context (e.g. child list) -> Readonly
                                        2. If Super Admin -> Always Dropdown
                                        3. If Owner & multiple companies -> Dropdown
                                        4. If Owner & 1 company -> Auto-select & Readonly
                                    */}
                                    {(companyIdFromUrl || (!isSuperAdmin && allCompanies.length === 1)) ? (
                                        <div className="space-y-2 col-span-1 md:col-span-2">
                                            <FormLabel>Parent Company</FormLabel>
                                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border text-sm">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold">{companyName}</span>
                                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-auto">Detected</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <FormField
                                            control={form.control}
                                            name="company"
                                            render={({ field }) => (
                                                <FormItem className="col-span-1 md:col-span-2">
                                                    <FormLabel>Parent Company <span className="text-red-500">*</span></FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Parent Company" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {allCompanies?.map((c: any) => (
                                                                <SelectItem key={c._id || c.id} value={c._id || c.id}>
                                                                    {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <InputField name="name" label="Business Unit Name" placeholder="e.g. Acme Retail" required />

                                    <FormField
                                        control={form.control}
                                        name="operationalModel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Operational Model</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                                                    <SelectContent>{BUSINESS_MODEL_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Industry / Segment</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Industry" /></SelectTrigger></FormControl>
                                                    <SelectContent>{BUSINESS_INDUSTRY_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField name="id" label="Unique ID" placeholder="acme-retail" required />
                                        <InputField name="slug" label="Slug" placeholder="acme-retail" required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="branding">
                        <BrandingFields prefix="branding" />
                    </TabsContent>

                    <TabsContent value="contact">
                        <ContactFields prefix="contact" />
                    </TabsContent>

                    <TabsContent value="location">
                        <LocationFields prefix="location" />
                    </TabsContent>

                    <TabsContent value="modules">
                        <ModuleFields prefix="activeModules" allowedModules={allowedModules} />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || isUpdating} className="min-w-[150px]">
                        {isCreating || isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isEditMode ? "Save Changes" : "Create Business Unit"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
