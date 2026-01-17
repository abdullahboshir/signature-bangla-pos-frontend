
"use client";

import { useState, useMemo, useEffect } from "react";
import { baseURL } from "@/redux/api/base/config";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGetPackagesQuery } from "@/redux/api/platform/packageApi";
import { useCreateLicenseMutation, useGetLicensesQuery } from "@/redux/api/platform/licenseApi";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, User, Building, LayoutDashboard, Database, ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";
import { OrganizationColumn } from "./columns";

interface SubscriptionDialogProps {
    organization: OrganizationColumn;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({ organization, open, onOpenChange }: SubscriptionDialogProps) {
    const { data: packages, isLoading: isLoadingPackages } = useGetPackagesQuery({ status: "active" });
    const [createLicense, { isLoading: isSubmitting }] = useCreateLicenseMutation();

    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [duration, setDuration] = useState<string>("12"); // 12 Months default
    const [status, setStatus] = useState<string>("active");
    const [billingType, setBillingType] = useState<string>("standard");

    // [NEW] Modular pricing states
    const [customModules, setCustomModules] = useState<Record<string, boolean>>({});
    const [customLimits, setCustomLimits] = useState<any>({});
    const [showLimits, setShowLimits] = useState(false);

    // [NEW] Real-time pricing sync with backend
    const [backendPricing, setBackendPricing] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const pkg = useMemo(() => packages?.data?.find((p: any) => p._id === selectedPackage), [packages, selectedPackage]);

    console.log('pkg', pkg, backendPricing, isCalculating, packages)

    // [NEW] Fetch existing license to prefill form
    const { data: licenseData, isLoading: isLoadingLicense } = useGetLicensesQuery(
        { clientId: organization.id || (organization as any)._id || (organization as any).value },
        { skip: !open } // Only fetch when dialog is open
    );

    const activeLicense = useMemo(() => {
        if (!licenseData) return null;
        
        console.log("SubscriptionDialog: licenseData received:", licenseData);

        // Based on axiosInstance + axiosBaseQuery:
        // axiosInstance returns response.data (Body)
        // axiosBaseQuery returns { data: Body }
        // RTK Query hook returns { data: Body, ... }
        // So 'licenseData' variable here IS the Body.
        
        const responseBody = licenseData;

        let list: any[] = [];
        
        // Structure check:
        // 1. Direct array: [ ... ]
        // 2. { data: [...] } (Common API wrapper)
        // 3. { result: [...] }
        // 4. { data: { result: [...] } }
        
        if (Array.isArray(responseBody)) {
            list = responseBody;
        } else if (responseBody?.data && Array.isArray(responseBody.data)) {
            list = responseBody.data;
        } else if (responseBody?.result && Array.isArray(responseBody.result)) {
            list = responseBody.result;
        } else if (responseBody?.data?.result && Array.isArray(responseBody.data.result)) {
            list = responseBody.data.result;
        } else if (responseBody?.docs && Array.isArray(responseBody.docs)) {
            list = responseBody.docs;
        }

        console.log("SubscriptionDialog: Extracted list:", list);

        if (list.length > 0) return list[0]; 

        // If body itself is the license object (not array)
        if (responseBody?.packageId || responseBody?._id) return responseBody;
        if (responseBody?.data?.packageId) return responseBody.data;

        return null;
    }, [licenseData]);

    // PREFILL FORM with existing license data OR Fallback to Organization details
    useEffect(() => {
        if (!open) return;

        if (activeLicense) {
            console.log("Prefilling from Active License:", activeLicense);
            if (activeLicense.packageId) setSelectedPackage(activeLicense.packageId._id || activeLicense.packageId);
            if (activeLicense.status) setStatus(activeLicense.status);
            
            // Prefill modules
            if (activeLicense.customModules) {
                const modules: Record<string, boolean> = {};
                Object.entries(activeLicense.customModules).forEach(([key, val]: [string, any]) => {
                    modules[key] = val.enabled;
                });
                setCustomModules(modules);
            }

            // Prefill limits
            if (activeLicense.overriddenLimits) {
                setCustomLimits(activeLicense.overriddenLimits);
            }
        } else if (organization && !isLoadingLicense) {
            // FALLBACK: Use Organization Data directly if License API validation fails/is empty
            console.log("Prefilling from Organization Data (Fallback):", organization);
            
            // 1. Try to match Package
            if (organization.subscription?.planName && packages?.data) {
                const matchedPkg = packages.data.find((p: any) => p.name === organization.subscription?.planName);
                if (matchedPkg) setSelectedPackage(matchedPkg._id);
            }

            // 2. Prefill Status
            if (organization.subscription?.status) {
                setStatus(organization.subscription.status === 'expired' ? 'active' : organization.subscription.status); 
                // Default to active if expired, assuming they want to renew
            }

            // 3. Prefill Modules
            if (organization.activeModules) {
                setCustomModules(organization.activeModules);
            }
        }
    }, [activeLicense, open, organization, packages, isLoadingLicense]);

    // FETCH Real-time pricing from backend when configuration changes
    useEffect(() => {
        if (!selectedPackage) return;

        const calculatePrice = async () => {
            setIsCalculating(true);
            try {
                // Map custom selection to backend-ready structure
                const customModulesPayload: any = {};
                Object.entries(customModules).forEach(([key, enabled]) => {
                    customModulesPayload[key] = { enabled };
                });

                const response: any = await axiosInstance.post(`/platform/licenses/calculate-price`, {
                    packageId: selectedPackage,
                    customModules: customModulesPayload,
                    overriddenLimits: customLimits
                });

                if (response.success) {
                    setBackendPricing(response.data);
                }
            } catch (err) {
                console.error("Pricing sync failed:", err);
            } finally {
                setIsCalculating(false);
            }
        };

        const timer = setTimeout(calculatePrice, 500); // Debounce to allow user to click multiple checkboxes
        return () => clearTimeout(timer);
    }, [selectedPackage, customModules, customLimits]);

    const displayPrice = backendPricing?.totalPrice ?? (pkg?.price || 0);

    const handleSubmit = async () => {
        if (!selectedPackage) {
            toast.error("Please select a package plan");
            return;
        }

        try {
            let expiresAt = new Date();

            if (billingType === 'complimentary') {
                expiresAt = new Date('2099-12-31');
            } else {
                expiresAt.setMonth(expiresAt.getMonth() + parseInt(duration));
            }

            // Map custom selection to backend-ready structure
            const customModulesPayload: any = {};
            Object.entries(customModules).forEach(([key, enabled]) => {
                customModulesPayload[key] = { enabled };
            });

            // ROBUST ID RESOLUTION: Ensure we have a valid ID string
            const clientId = organization.id || (organization as any)._id || (organization as any).value;
            console.log("🚀 Submitting license for Target ID:", clientId);

            if (!clientId) {
                toast.error("Target Client identity not found. Cannot proceed.");
                return;
            }

            await createLicense({
                clientId: clientId,
                packageId: selectedPackage,
                status: status,
                expiresAt: expiresAt.toISOString(),
                customModules: customModulesPayload,
                overriddenLimits: customLimits,
                totalPrice: displayPrice
            }).unwrap();

            toast.success(billingType === 'complimentary' ? "Complimentary lifetime access granted" : "Subscription updated successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error("❌ Submit Failed:", error);
            const errorMsg = error?.data?.message || error?.message || "Failed to update subscription";
            toast.error(errorMsg);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" /> Manage Subscription
                    </DialogTitle>
                    <DialogDescription>
                        Update plan and billing status for <span className="font-semibold text-foreground">{organization.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="grid gap-4">
                        {/* Package Selection */}
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Package Plan</Label>
                            <Select value={selectedPackage} onValueChange={(val) => {
                                setSelectedPackage(val);
                                const pkg = packages?.data?.find((p: any) => p._id === val);
                                if (pkg) {
                                    // Reset custom modules
                                    const defaults: any = {};
                                    Object.entries(pkg.moduleAccess).forEach(([k, v]: any) => {
                                        // Strategy: If Trial, enable ALL modules by default (Full Feature Trial)
                                        if (pkg.slug === 'trial') {
                                            defaults[k] = true;
                                        } else {
                                            defaults[k] = v.enabled;
                                        }
                                    });
                                    setCustomModules(defaults);

                                    // Reset limits to package defaults
                                    setCustomLimits(pkg.limits || {});

                                    if (pkg.slug === 'lifetime') {
                                        setBillingType('complimentary');
                                        setStatus('active');
                                    } else if (pkg.slug === 'trial') {
                                        setStatus('trial');
                                        setDuration('1');
                                    }
                                }
                            }}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingPackages ? (
                                        <div className="p-2 text-xs text-center">Loading plans...</div>
                                    ) : packages?.data?.length ? (
                                        [...packages.data]
                                            .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                                            .map((pkg: any) => (
                                                <SelectItem key={pkg._id} value={pkg._id}>
                                                    <div className="flex flex-col text-left">
                                                        <span>{pkg.name}</span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {pkg.billingCycle === 'lifetime' ? 'One-time Payment' : `${pkg.price.toLocaleString()} ${pkg.currency}/mo`}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                    ) : (
                                        <SelectItem value="custom" disabled>No Active Plans Found</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* [NEW] Feature Selector & Pricing Breakdown */}
                        {pkg && (
                            <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-inner">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Modules & Pricing</span>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="flex items-center gap-1.5">
                                            {isCalculating && <RefreshCcw className="w-3 h-3 text-primary animate-spin" />}
                                            <div className={cn("text-lg font-black text-primary leading-none transition-opacity", isCalculating && "opacity-50")}>
                                                {displayPrice.toLocaleString()} {pkg.currency}
                                                <span className="text-[10px] font-normal text-muted-foreground ml-1">/mo</span>
                                            </div>
                                        </div>
                                        {backendPricing?.priceBreakdown?.modulePrices?.length > 0 && (
                                            <span className="text-[9px] text-muted-foreground font-medium">
                                                Incl. {backendPricing.priceBreakdown.modulePrices.length} add-ons
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.entries(pkg.moduleAccess).map(([key, config]: [string, any]) => {
                                        const isErp = key === 'erp';
                                        return (
                                            <div key={key} className="flex items-center justify-between gap-2 p-1.5 transition-colors hover:bg-white/50 rounded-md border border-transparent hover:border-primary/10">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`mod-dl-${key}`}
                                                        checked={isErp ? true : customModules[key]}
                                                        disabled={isErp || (config.enabled && pkg.slug !== 'trial')} // Package base modules are mandatory except in trials, ERP is ALWAYS mandatory
                                                        onChange={(e) => setCustomModules(prev => ({ ...prev, [key]: e.target.checked }))}
                                                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                                                    />
                                                    <label htmlFor={`mod-dl-${key}`} className="text-[11px] font-semibold capitalize cursor-pointer flex items-center gap-1.5">
                                                        {key}
                                                        {isErp && <span className="text-[9px] bg-primary/10 text-primary px-1 rounded border border-primary/20">CORE</span>}
                                                    </label>
                                                </div>
                                                {isErp ? (
                                                     <span className="text-[9px] font-medium text-muted-foreground bg-gray-100 px-1.5 rounded">Included</span>
                                                ) : (config.monthlyPrice > 0 && !config.enabled) && (
                                                    <span className={cn("text-[9px] font-bold px-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100", !customModules[key] && "opacity-40 grayscale")}>
                                                        +{config.monthlyPrice}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* [NEW] Custom Limits Overrides */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowLimits(!showLimits)}
                                className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showLimits ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                MANAGE RESOURCE LIMITS (CUSTOM OVERRIDES)
                            </button>

                            {showLimits && (
                                <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/40 border-2 border-dashed border-muted-foreground/20">
                                    {[
                                        { label: "Max Users", key: "maxUsers", icon: User },
                                        { label: "Max Business Units", key: "maxBusinessUnits", icon: Building },
                                        { label: "Max Outlets", key: "maxOutlets", icon: LayoutDashboard },
                                        { label: "Storage (MB)", key: "maxStorage", icon: Database },
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-1">
                                            <Label className="text-[10px] font-bold flex items-center gap-1">
                                                <field.icon className="w-3 h-3 text-muted-foreground" /> {field.label}
                                            </Label>
                                            <Input
                                                type="number"
                                                value={customLimits[field.key] ?? -1}
                                                onChange={(e) => setCustomLimits({ ...customLimits, [field.key]: parseInt(e.target.value) })}
                                                className="h-8 text-xs bg-background"
                                                placeholder="-1 for unlimited"
                                            />
                                        </div>
                                    ))}
                                    <p className="col-span-2 text-[9px] text-muted-foreground italic text-center">
                                        Use -1 for unlimited access to resources.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active (Paid)</SelectItem>
                                        <SelectItem value="trial" disabled={billingType === 'complimentary'}>Trial</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration (Months)</Label>
                                <Select value={duration} onValueChange={setDuration} disabled={billingType === 'complimentary'}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Month</SelectItem>
                                        <SelectItem value="3">3 Months</SelectItem>
                                        <SelectItem value="6">6 Months</SelectItem>
                                        <SelectItem value="12">1 Year</SelectItem>
                                        <SelectItem value="24">2 Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing Type</Label>
                            <Select value={billingType} onValueChange={setBillingType}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard (Paid/Trial)</SelectItem>
                                    <SelectItem value="complimentary" className="text-emerald-600 font-medium">Complimentary (Waived)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4 mt-2">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-9">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || isLoadingPackages} className="h-9 font-bold">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Apply & Update License
                    </Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}
