
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllCompaniesQuery } from "@/redux/api/platform/companyApi";
import { useGetLicensesQuery } from "@/redux/api/platform/licenseApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2, XCircle, Calendar, CreditCard, Package, AlertTriangle, Building } from "lucide-react";
import { SubscriptionDialog } from "@/app/(protected)/global/companies/SubscriptionDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SubscriptionPage() {
    const searchParams = useSearchParams();
    const companyIdParam = searchParams.get("company");
    const { user } = useAuth();
    
    const { data: rawCompanies, isLoading: loadingCompanies } = useGetAllCompaniesQuery({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Resolve Company Context
    const activeCompany = useMemo(() => {
        const companies = Array.isArray(rawCompanies) ? rawCompanies : (rawCompanies?.data || rawCompanies?.result || []);
        if (!companies || companies.length === 0) return null;
        
        if (companyIdParam) {
            return companies.find((c: any) => (c._id === companyIdParam || c.id === companyIdParam)) || companies[0];
        }
        // In global context, do not auto-select first company if no param is provided.
        // Or if we want to show a "Select Company" state. 
        // For now, consistent behavior:
        return companies[0];
    }, [rawCompanies, companyIdParam]);

    // Fetch License
    const { data: licenseData, isLoading: loadingLicense } = useGetLicensesQuery(
        { clientId: activeCompany?._id || activeCompany?.id },
        { skip: !activeCompany }
    );

    const currentLicense = useMemo(() => {
        if (!licenseData) return null;
        const list = Array.isArray(licenseData) ? licenseData : (licenseData?.data || licenseData?.result || []);
        // Prefer active license, or just the first one
        return list[0] || null;
    }, [licenseData]);

    if (loadingCompanies || (activeCompany && loadingLicense)) {
        return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!activeCompany) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mb-4 text-amber-500" />
                <h2 className="text-xl font-semibold text-foreground">No Company Found</h2>
                <p>You do not appear to have any company assigned to your account.</p>
            </div>
        );
    }

    const planName = currentLicense?.packageId?.name || activeCompany.subscription?.planName || "Trial Plan";
    const status = currentLicense?.status || activeCompany.subscription?.status || "active";
    const nextBilling = currentLicense?.nextBillingDate || activeCompany.subscription?.endDate;
    
    // Merge Modules: License overrides > Package Defaults > Empty
    const activeModules = currentLicense?.customModules 
        ? Object.entries(currentLicense.customModules).filter(([_, val]: any) => val.enabled).map(([key]) => key)
        : (currentLicense?.packageId?.moduleAccess 
            ? Object.entries(currentLicense.packageId.moduleAccess).filter(([_, val]: any) => val.enabled).map(([key]) => key)
            : Object.keys(activeCompany.activeModules || {}).filter(k => activeCompany.activeModules[k]));

    // Ensure ERP is present if mandated (Visual check)
    const uniqueModules = Array.from(new Set([...activeModules, 'erp']));

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
                    <p className="text-muted-foreground mt-1">Manage your plan, billing cycle, and active modules.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2 font-semibold shadow-lg">
                    <CreditCard className="w-4 h-4" /> Change Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Plan Card */}
                <Card className="md:col-span-2 border-primary/20 shadow-sm relative overflow-hidden bg-gradient-to-br from-background to-primary/5">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <ShieldCheck className="w-40 h-40" />
                    </div>
                    <CardHeader className="pb-4">
                        <CardDescription className="uppercase tracking-wider font-semibold text-xs text-primary">Current Plan</CardDescription>
                        <CardTitle className="text-4xl font-extrabold text-primary flex items-center gap-3">
                            {planName}
                            <Badge variant={status === 'active' ? "default" : "destructive"} className="text-sm px-3 py-1 font-bold capitalize">
                                {status}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Building className="w-4 h-4" /> Licensed To
                                </span>
                                <span className="font-semibold text-lg">{activeCompany.name}</span>
                                <span className="text-xs text-muted-foreground font-mono">{activeCompany.id}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Next Billing
                                </span>
                                <span className="font-semibold text-lg">
                                    {nextBilling ? format(new Date(nextBilling), "MMMM d, yyyy") : "Lifetime Access"}
                                </span>
                                <span className="text-xs text-emerald-600 font-medium">
                                    {status === 'active' ? 'Auto-renewal active' : 'Action required'}
                                </span>
                            </div>
                        </div>

                        {currentLicense?.priceBreakdown && (
                            <div className="p-4 bg-background/50 rounded-lg border backdrop-blur-sm">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Base Plan Cost</span>
                                    <span className="font-mono font-medium">{currentLicense.priceBreakdown.basePrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="text-muted-foreground">Add-ons ({currentLicense.priceBreakdown.modulePrices.length})</span>
                                    <span className="font-mono font-medium">
                                        + {currentLicense.priceBreakdown.modulePrices.reduce((a: any, b: any) => a + b.price, 0)}
                                    </span>
                                </div>
                                <div className="border-t my-2 border-dashed"></div>
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span>Total Monthly</span>
                                    <span className="text-primary">{currentLicense.totalPrice} {currentLicense.packageId?.currency || 'BDT'}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Status Summary */}
                <Card className="flex flex-col justify-center items-center text-center p-6 border-l-4 border-l-primary/50">
                     <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                         <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <h3 className="font-bold text-lg">System Operational</h3>
                     <p className="text-sm text-muted-foreground mt-2">
                         Your account is in good standing. All core modules including ERP are active and synced.
                     </p>
                </Card>
            </div>

            {/* Active Modules Map */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="w-5 h-5 text-indigo-500" /> Active Modules
                    </CardTitle>
                    <CardDescription>
                        Features currently enabled for your workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                         {uniqueModules.map((moduleKey) => {
                             const isErp = moduleKey === 'erp';
                             return (
                                 <div key={moduleKey} className={cn(
                                     "flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-muted/50",
                                     isErp ? "bg-indigo-50 border-indigo-100 text-indigo-900" : "bg-card"
                                 )}>
                                     <div className={cn(
                                         "h-2 w-2 rounded-full",
                                         isErp ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"
                                     )} />
                                     <div className="flex flex-col">
                                        <span className="font-semibold capitalize text-sm">{moduleKey}</span>
                                        {isErp && <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Core System</span>}
                                     </div>
                                 </div>
                             );
                         })}
                    </div>
                </CardContent>
            </Card>

            <SubscriptionDialog 
                company={activeCompany} 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
            />
        </div>
    );
}
