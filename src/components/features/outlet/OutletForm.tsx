"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Store, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { useCreateOutletMutation, useUpdateOutletMutation } from "@/redux/api/organization/outletApi";
import { useGetBusinessUnitsQuery } from "@/redux/api/organization/businessUnitApi";
import { useCurrentBusinessUnit } from "@/hooks/useCurrentBusinessUnit";
import { MODULES } from "@/constant/modules";

// Shared Components
import InputField from "@/components/forms/InputField";
import { BrandingFields } from "@/components/forms/organization/BrandingFields";
import { ContactFields } from "@/components/forms/organization/ContactFields";
import { LocationFields } from "@/components/forms/organization/LocationFields";
import { ModuleFields } from "@/components/forms/organization/ModuleFields";
import { ManagerFields } from "@/components/forms/organization/ManagerFields";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    code: z.string().min(2, "Code is required"),
    businessUnitId: z.string().min(1, "Business Unit is required"),
    isActive: z.boolean().default(true),

    // Branding
    branding: z.object({
        name: z.string().min(1, "Branding name is required"),
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

    // Contact
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

    // Location
    location: z.object({
        address: z.string().min(5, "Address must be at least 5 characters"),
        city: z.string().min(1, "City is required"),
        state: z.string().optional(),
        postalCode: z.string().min(1, "Postal code is required"),
        country: z.string().default("Bangladesh"),
        timezone: z.string().default("Asia/Dhaka"),
        coordinates: z.object({
            lat: z.string().optional(),
            lng: z.string().optional(),
        }).optional(),
    }),

    // Manager
    manager: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
    }),

    // Modules
    activeModules: z.record(z.string(), z.boolean()).default({}),
});

type FormValues = z.infer<typeof formSchema>;

interface OutletFormProps {
    preSelectedSlug?: string;
    initialData?: any;
    isEditMode?: boolean;
}

export function OutletForm({ preSelectedSlug, initialData, isEditMode = false }: OutletFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get("company");
    const [createOutlet, { isLoading: isCreating }] = useCreateOutletMutation();
    const [updateOutlet, { isLoading: isUpdating }] = useUpdateOutletMutation();
    const { data: businessUnitsData, isLoading: loadingBU } = useGetBusinessUnitsQuery(undefined);
    const { currentBusinessUnit } = useCurrentBusinessUnit();

    const businessUnits = Array.isArray(businessUnitsData) ? businessUnitsData :
        ((businessUnitsData as any)?.data || businessUnitsData || []);

    const isObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val || "");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: initialData?.branding?.name || initialData?.name || "",
            code: initialData?.code || "",
            businessUnitId: initialData?.businessUnit?._id?.toString() ||
                initialData?.businessUnit?.toString() ||
                (preSelectedSlug && isObjectId(preSelectedSlug) ? preSelectedSlug : ""),
            isActive: initialData?.isActive ?? true,
            branding: {
                name: initialData?.branding?.name || initialData?.name || "",
                description: initialData?.branding?.description || "",
                tagline: initialData?.branding?.tagline || "",
                logoUrl: initialData?.branding?.logoUrl || "",
                bannerUrl: initialData?.branding?.bannerUrl || "",
                faviconUrl: initialData?.branding?.faviconUrl || "",
                theme: initialData?.branding?.theme || { primaryColor: "#3B82F6", secondaryColor: "#1E40AF", accentColor: "#F59E0B", fontFamily: "Inter" },
            },
            contact: {
                email: initialData?.contact?.email || initialData?.email || "",
                phone: initialData?.contact?.phone || initialData?.phone || "",
                website: initialData?.contact?.website || "",
                supportPhone: initialData?.contact?.supportPhone || "",
                socialMedia: initialData?.contact?.socialMedia || {},
            },
            location: {
                address: initialData?.location?.address || initialData?.address || "",
                city: initialData?.location?.city || initialData?.city || "Dhaka",
                state: initialData?.location?.state || "Dhaka",
                postalCode: initialData?.location?.postalCode || "",
                country: initialData?.location?.country || "Bangladesh",
                timezone: initialData?.location?.timezone || "Asia/Dhaka",
                coordinates: {
                    lat: initialData?.location?.coordinates?.lat?.toString() || "",
                    lng: initialData?.location?.coordinates?.lng?.toString() || "",
                },
            },
            manager: initialData?.manager || { name: "", phone: "", email: "" },
            activeModules: initialData?.activeModules || { [MODULES.POS]: true, [MODULES.ERP]: true },
        },
    });

    useEffect(() => {
        if (!preSelectedSlug) return;

        const currentVal = form.getValues("businessUnitId");

        // If preSelectedSlug is an ID and we don't have a value yet, set it immediately
        if (isObjectId(preSelectedSlug) && !currentVal) {
            form.setValue("businessUnitId", preSelectedSlug, { shouldValidate: true });
            return;
        }

        // If it's a slug, we need to find the matching BU
        if (!currentVal || !isObjectId(currentVal)) {
            const slugLower = preSelectedSlug.toLowerCase();

            // 1. Try to find in the list of all business units (handles Super Admin view)
            const matchedBU = businessUnits.find((bu: any) =>
                (bu.slug && bu.slug.toLowerCase() === slugLower) ||
                (bu.id && bu.id === preSelectedSlug) ||
                (bu._id && bu._id.toString() === preSelectedSlug)
            );

            if (matchedBU) {
                form.setValue("businessUnitId", matchedBU._id?.toString() || matchedBU.id, { shouldValidate: true });
            } else if (currentBusinessUnit) {
                // 2. Fallback to current context (handles scoped view for Business Admins)
                const isMatch =
                    (currentBusinessUnit.slug || "").toLowerCase() === slugLower ||
                    currentBusinessUnit.id === preSelectedSlug ||
                    currentBusinessUnit._id?.toString() === preSelectedSlug;

                if (isMatch) {
                    form.setValue("businessUnitId", currentBusinessUnit._id?.toString() || currentBusinessUnit.id, { shouldValidate: true });
                }
            }
        }
    }, [preSelectedSlug, businessUnits, currentBusinessUnit, form]);

    const watchName = form.watch("name");
    useEffect(() => {
        if (watchName && !form.formState.dirtyFields.branding?.name) {
            form.setValue("branding.name", watchName);
        }
    }, [watchName, form]);

    const onSubmit = async (values: FormValues) => {
        try {
            const payload = {
                ...values,
                code: values.code.toUpperCase(),
                businessUnit: values.businessUnitId,
                location: {
                    ...values.location,
                    coordinates: values.location.coordinates?.lat && values.location.coordinates?.lng
                        ? { lat: Number(values.location.coordinates.lat), lng: Number(values.location.coordinates.lng) }
                        : undefined
                }
            };

            if (isEditMode && initialData?._id) {
                await updateOutlet({ id: initialData._id, body: payload }).unwrap();
                toast.success("Outlet updated successfully!");
            } else {
                await createOutlet(payload).unwrap();
                toast.success("Outlet created successfully!");
            }

            // Redirect to All Outlets page with context
            const redirectBase = preSelectedSlug ? `/${preSelectedSlug}/outlets` : "/global/outlets";
            const redirectUrl = companyId ? `${redirectBase}?company=${companyId}` : redirectBase;
            router.push(redirectUrl);
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    if (isEditMode && loadingBU) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <CardDescription>Define the operational structure and identity.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="businessUnitId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Parent Business Unit</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!!preSelectedSlug}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="Select Business Unit" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {(() => {
                                                            const seen = new Set();
                                                            const unique = [];
                                                            const rawList = [...businessUnits];
                                                            if (currentBusinessUnit) rawList.push(currentBusinessUnit);
                                                            for (const bu of rawList) {
                                                                const id = bu._id?.toString() || bu.id;
                                                                if (id && !seen.has(id)) {
                                                                    seen.add(id);
                                                                    unique.push(bu);
                                                                }
                                                            }
                                                            return unique.map((bu: any) => {
                                                                const val = bu._id?.toString() || bu.id;
                                                                return (
                                                                    <SelectItem key={val} value={val}>{bu.name}</SelectItem>
                                                                );
                                                            });
                                                        })()}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <InputField name="name" label="Outlet Name" placeholder="e.g. Dhanmondi Branch" required />

                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField name="code" label="Outlet Code" placeholder="e.g. DHM-01" required />
                                        <FormField
                                            control={form.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-auto h-[40px]">
                                                    <FormLabel className="text-sm font-medium">Active Status</FormLabel>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <ManagerFields prefix="manager" />
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
                        <ModuleFields prefix="activeModules" />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isCreating || isUpdating} className="min-w-[150px]">
                        {isCreating || isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isEditMode ? "Save Changes" : "Create Outlet"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
