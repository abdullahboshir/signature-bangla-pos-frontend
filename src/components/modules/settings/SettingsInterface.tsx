"use client"

import { useParams, useSearchParams, usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useThemeSettings } from "@/lib/providers/ThemeSettingsProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Shield, Store, Palette, Globe, ShoppingCart, MonitorSmartphone, Package, FileText, Plug, Lock, Scale, Server, Cpu, AlertTriangle, CreditCard, DollarSign, Percent, Hash, Truck, ShieldAlert, BarChart3, Mail, Clock, Users } from "lucide-react"

import { GeneralSettings } from "@/components/modules/settings/GeneralSettings"
import { SalesSettings } from "@/components/modules/settings/SalesSettings"
import { PosSettings } from "@/components/modules/settings/PosSettings"
import { InventorySettings } from "@/components/modules/settings/InventorySettings"
import { ModuleToggleSettings } from "@/components/modules/settings/ModuleToggleSettings"
import { OperationsSettings } from "@/components/modules/settings/OperationsSettings"
import { HRMSettings } from "@/components/modules/settings/HRMSettings"

// PLATFORM SHARED COMPONENTS
import BrandingSettings from "@/components/modules/settings/shared/BrandingSettings"
import SecuritySettings from "@/components/modules/settings/shared/SecuritySettings"
import ComplianceSettings from "@/components/modules/settings/shared/ComplianceSettings"
import LegalSettings from "@/components/modules/settings/shared/LegalSettings"
import InternationalizationSettings from "@/components/modules/settings/shared/InternationalizationSettings"
import MaintenanceSettings from "@/components/modules/settings/shared/MaintenanceSettings"
import CommercialSaaSSettings from "@/components/modules/settings/shared/CommercialSaaSSettings"
import InfrastructureHubSettings from "@/components/modules/settings/shared/InfrastructureHubSettings"

// NEW SHARED COMPONENTS
import FinancialCoreSettings from "@/components/modules/settings/shared/FinancialCoreSettings"
import DocumentGovernanceSettings from "@/components/modules/settings/shared/DocumentGovernanceSettings"
import ReportingSettings from "@/components/modules/settings/shared/ReportingSettings"
import TaxIntelligenceSettings from "@/components/modules/settings/shared/TaxIntelligenceSettings"
import PricingPolicySettings from "@/components/modules/settings/shared/PricingPolicySettings"
import FulfillmentPolicySettings from "@/components/modules/settings/shared/FulfillmentPolicySettings"
import CorporateRegistrySettings from "@/components/modules/settings/shared/CorporateRegistrySettings"
import PrefixPolicySettings from "@/components/modules/settings/shared/PrefixPolicySettings"
import GovernancePolicySettings from "@/components/modules/settings/shared/GovernancePolicySettings"
import ContactSettings from "@/components/modules/settings/shared/ContactSettings"

import {
    useGetBusinessUnitSettingsQuery,
    useUpdateBusinessUnitSettingsMutation,
    useGetSystemSettingsQuery,
    useUpdateSystemSettingsMutation,
    useGetPlatformSettingsQuery,
    useUpdatePlatformSettingsMutation,
    useGetCompanySettingsQuery,
    useUpdateCompanySettingsMutation,
    useGetOutletSettingsQuery,
    useUpdateOutletSettingsMutation
} from "@/redux/api/system/settingsApi"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export function SettingsInterface() {
    const params = useParams()
    const searchParams = useSearchParams()
    const { user } = useAuth();
    const { hasPermission } = usePermissions();

    const router = useRouter()
    const pathname = usePathname()

    const paramBusinessUnit = params?.["business-unit"] as string
    const outletId = searchParams.get('outlet');

    const matchedBU = user?.businessUnits?.find((bu: any) => bu.id === paramBusinessUnit || bu._id === paramBusinessUnit || bu.slug === paramBusinessUnit);
    const businessUnit = matchedBU?._id || matchedBU?.id || paramBusinessUnit;

    const { theme, isLoading: themeLoading, updateTheme } = useThemeSettings()

    // Robust check for Organization Settings context using proper hooks
    const isCompanySettings = searchParams.get('context') === 'organization' || pathname?.includes('organization-settings');

    const companyId = (user as any)?.companyId || searchParams.get('organization');
    const { data: companySettingsData, isLoading: companySettingsLoading } = useGetCompanySettingsQuery(companyId, { skip: !isCompanySettings || !companyId });

    // Fetch Business Unit settings
    const { data: buSettingsData, isLoading: buSettingsLoading } = useGetBusinessUnitSettingsQuery(businessUnit, { skip: !businessUnit || !!outletId || isCompanySettings });

    // Fetch Outlet settings
    const { data: outletSettingsData, isLoading: outletSettingsLoading } = useGetOutletSettingsQuery(outletId as string, { skip: !outletId });

    // Fetch Platform settings for Global Context ONLY
    const { data: platformSettingsData, isLoading: platformLoading } = useGetPlatformSettingsQuery(undefined, { skip: !!businessUnit || isCompanySettings || !!outletId });

    let settingsLoading = platformLoading;

    if (outletId) {
        settingsLoading = outletSettingsLoading;
    } else if (businessUnit) {
        settingsLoading = buSettingsLoading;
    } else if (isCompanySettings) {
        settingsLoading = companySettingsLoading;
    }

    const [updateBUSettings, { isLoading: updateBULoading }] = useUpdateBusinessUnitSettingsMutation();
    const [updatePlatformSettings, { isLoading: updatePlatformLoading }] = useUpdatePlatformSettingsMutation();
    const [updateCompanySettings, { isLoading: updateCompanyLoading }] = useUpdateCompanySettingsMutation();
    const [updateOutletSettings, { isLoading: updateOutletLoading }] = useUpdateOutletSettingsMutation();

    const updateLoading = updateBULoading || updatePlatformLoading || updateCompanyLoading || updateOutletLoading;

    const [localSettings, setLocalSettings] = useState<any>(null); // Platform or Organization/BU Settings

    useEffect(() => {
        if (settingsLoading) return;

        if (outletId) {
            setLocalSettings(outletSettingsData ? JSON.parse(JSON.stringify(outletSettingsData)) : {});
        } else if (businessUnit && !isCompanySettings) {
            setLocalSettings(buSettingsData ? JSON.parse(JSON.stringify(buSettingsData)) : {});
        } else if (isCompanySettings) {
            setLocalSettings(companySettingsData ? JSON.parse(JSON.stringify(companySettingsData)) : {});
        } else if (platformSettingsData) {
            setLocalSettings(JSON.parse(JSON.stringify(platformSettingsData)));
        } else {
            // Fallback for platform settings if data is not yet there but expected
            setLocalSettings({});
        }
    }, [
        settingsLoading,
        outletSettingsData,
        buSettingsData,
        companySettingsData,
        platformSettingsData,
        outletId,
        businessUnit,
        isCompanySettings
    ]);

    const defaultTab = outletId ? "store-identity" : (businessUnit ? "overview" : (isCompanySettings ? "branding" : "branding"));
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || defaultTab);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    // Update URL when tab changes to persist state and allow deep linking
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('tab', val);
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    };

    // --- State Handlers for Organization/BU Settings (localSettings) ---
    const handleZenithChange = (section: string, ...args: any[]) => {
        setLocalSettings((prev: any) => {
            if (!prev) return prev;
            const updated = { ...prev };

            if (args.length === 1) {
                // Depth 1: Root key update (e.g., handleZenithChange('fiscalPeriods', [..]))
                updated[section] = args[0];
            } else if (args.length === 2) {
                // Depth 2: Nested key update (e.g., handleZenithChange('branding', 'name', 'foo'))
                updated[section] = { ...(prev[section] || {}), [args[0]]: args[1] };
            } else if (args.length === 3) {
                // Depth 3: Deep nested update (e.g., handleZenithChange('security', 'mfa', 'enabled', true))
                updated[section] = {
                    ...(prev[section] || {}),
                    [args[0]]: { ...(prev[section]?.[args[0]] || {}), [args[1]]: args[2] }
                };
            }
            return updated;
        });
    };


    const saveSettings = async () => {
        try {
            if (businessUnit) {
                await updateBUSettings({ businessUnitId: businessUnit, data: localSettings }).unwrap();
                toast.success("Business settings updated successfully");
                if (outletId) {
                    await updateOutletSettings({ outletId: outletId, data: localSettings }).unwrap();
                    toast.success("Outlet settings updated successfully");
                }
            } else if (outletId) {
                await updateOutletSettings({ outletId: outletId, data: localSettings }).unwrap();
                toast.success("Outlet settings updated successfully");
            } else {
                // Global Save - Platform Settings only
                if (localSettings) await updatePlatformSettings(localSettings).unwrap();

                // Also update local theme if Branding changed
                if (localSettings?.branding?.theme) {
                    await updateTheme({
                        primary: localSettings.branding.theme.primaryColor,
                        secondary: localSettings.branding.theme.secondaryColor
                    });
                }

                toast.success("Global configuration updated successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update settings");
        }
    }

    const canSave = true; // Simplified for now, rely on API guards

    if (settingsLoading && !localSettings) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>
    }

    return (
        <div className="container mx-auto py-6 max-w-[1600px]">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {outletId ? "Outlet Settings" : (businessUnit ? "Business Settings" : (isCompanySettings ? "Organization Settings" : "Global Settings"))}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {outletId ? "Configure settings specific to this outlet" : (businessUnit ? "Manage your Business Unit configuration" : (isCompanySettings ? "Manage Organization preferences" : "Manage complete platform configuration"))}
                    </p>
                </div>
                <Button onClick={saveSettings} disabled={updateLoading || !localSettings || !canSave}>
                    {updateLoading ? "Saving..." : "Save Configuration"}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} orientation="vertical" className="flex flex-col lg:flex-row gap-6">

                {/* --- Vertical Sidebar --- */}
                <Card className="w-full lg:w-auto h-fit shrink-0 p-0 overflow-hidden bg-background sticky top-6">
                    <div className="bg-muted/40 p-3 border-b">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings Menu
                        </h3>
                    </div>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        <TabsList className="flex flex-col h-full w-full justify-start items-stretch p-2 gap-0.5 bg-transparent">

                            {/* GLOBAL CONTEXT (PLATFORM SETTINGS) */}
                            {!businessUnit && !outletId && !isCompanySettings && (
                                <>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">Platform Infrastructure</div>
                                    <TabsTrigger value="infrahub" className="justify-start h-8 px-3 text-xs"><Cpu className="h-4 w-4 mr-2" /> SSO & API Hub</TabsTrigger>
                                    <TabsTrigger value="internationalization" className="justify-start h-8 px-3 text-xs"><Globe className="h-4 w-4 mr-2" /> Internationalization</TabsTrigger>
                                    <TabsTrigger value="maintenance" className="justify-start h-8 px-3 text-xs"><AlertTriangle className="h-4 w-4 mr-2" /> Maintenance</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-1">Business & Environment</div>
                                    <TabsTrigger value="branding" className="justify-start h-8 px-3 text-xs"><Palette className="h-4 w-4 mr-2" /> White-labeling</TabsTrigger>
                                    <TabsTrigger value="commercial" className="justify-start h-8 px-3 text-xs"><Store className="h-4 w-4 mr-2" /> Commercial SaaS</TabsTrigger>
                                    <TabsTrigger value="security" className="justify-start h-8 px-3 text-xs"><Lock className="h-4 w-4 mr-2" /> Security Hardening</TabsTrigger>
                                    <TabsTrigger value="compliance" className="justify-start h-8 px-3 text-xs"><Shield className="h-4 w-4 mr-2" /> Compliance</TabsTrigger>
                                    <TabsTrigger value="legal" className="justify-start h-8 px-3 text-xs"><Scale className="h-4 w-4 mr-2" /> Legal Governance</TabsTrigger>
                                </>
                            )}

                            {/* COMPANY CONTEXT */}
                            {isCompanySettings && (
                                <>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Core Identity</div>
                                    <TabsTrigger value="branding" className="justify-start h-8 px-3 text-xs"><Palette className="h-4 w-4 mr-2" /> Branding & Theme</TabsTrigger>
                                    <TabsTrigger value="contact" className="justify-start h-8 px-3 text-xs"><Mail className="h-4 w-4 mr-2" /> Contact Methods</TabsTrigger>
                                    <TabsTrigger value="internationalization" className="justify-start h-8 px-3 text-xs"><Globe className="h-4 w-4 mr-2" /> Local & i18n</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Finance & Tax</div>
                                    <TabsTrigger value="financial-core" className="justify-start h-8 px-3 text-xs"><DollarSign className="h-4 w-4 mr-2" /> Financial Core</TabsTrigger>
                                    <TabsTrigger value="tax-intelligence" className="justify-start h-8 px-3 text-xs"><Percent className="h-4 w-4 mr-2" /> Tax Intelligence</TabsTrigger>
                                    <TabsTrigger value="pricing-policy" className="justify-start h-8 px-3 text-xs"><ShoppingCart className="h-4 w-4 mr-2" /> Pricing Policy</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Compliance & Legal</div>
                                    <TabsTrigger value="corporate" className="justify-start h-8 px-3 text-xs"><Store className="h-4 w-4 mr-2" /> Corporate Registry</TabsTrigger>
                                    <TabsTrigger value="legal" className="justify-start h-8 px-3 text-xs"><Scale className="h-4 w-4 mr-2" /> Legal Governance</TabsTrigger>
                                    <TabsTrigger value="compliance" className="justify-start h-8 px-3 text-xs"><Shield className="h-4 w-4 mr-2" /> Compliance</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Infrastructure</div>
                                    <TabsTrigger value="doc-governance" className="justify-start h-8 px-3 text-xs"><FileText className="h-4 w-4 mr-2" /> Document Policy</TabsTrigger>
                                    <TabsTrigger value="prefixes" className="justify-start h-8 px-3 text-xs"><Hash className="h-4 w-4 mr-2" /> Global Prefixes</TabsTrigger>
                                    <TabsTrigger value="fulfillment" className="justify-start h-8 px-3 text-xs"><Truck className="h-4 w-4 mr-2" /> Fulfillment</TabsTrigger>
                                    <TabsTrigger value="infra-hub" className="justify-start h-8 px-3 text-xs"><Cpu className="h-4 w-4 mr-2" /> Infrastructure Hub</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Security & Logs</div>
                                    <TabsTrigger value="security" className="justify-start h-8 px-3 text-xs"><Lock className="h-4 w-4 mr-2" /> Security Hardening</TabsTrigger>
                                    <TabsTrigger value="governance-policy" className="justify-start h-8 px-3 text-xs"><ShieldAlert className="h-4 w-4 mr-2" /> System Governance</TabsTrigger>
                                    <TabsTrigger value="reporting" className="justify-start h-8 px-3 text-xs"><BarChart3 className="h-4 w-4 mr-2" /> Analytics Setup</TabsTrigger>
                                </>
                            )}

                            {/* BUSINESS UNIT CONTEXT */}
                            {businessUnit && !outletId && (
                                <>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Core Operations</div>
                                    <TabsTrigger value="overview" className="justify-start h-8 px-3 text-xs"><Store className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
                                    <TabsTrigger value="operations" className="justify-start h-8 px-3 text-xs"><Clock className="h-4 w-4 mr-2" /> Hours & Service Area</TabsTrigger>
                                    <TabsTrigger value="hrm" className="justify-start h-8 px-3 text-xs"><Users className="h-4 w-4 mr-2" /> HRM & Payroll</TabsTrigger>
                                    <TabsTrigger value="contact" className="justify-start h-8 px-3 text-xs"><Mail className="h-4 w-4 mr-2" /> Contact Info</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Commerce & Sales</div>
                                    <TabsTrigger value="sales" className="justify-start h-8 px-3 text-xs"><ShoppingCart className="h-4 w-4 mr-2" /> Sales & Checkout</TabsTrigger>
                                    <TabsTrigger value="pos" className="justify-start h-8 px-3 text-xs"><MonitorSmartphone className="h-4 w-4 mr-2" /> POS Config</TabsTrigger>
                                    <TabsTrigger value="inventory" className="justify-start h-8 px-3 text-xs"><Package className="h-4 w-4 mr-2" /> Inventory</TabsTrigger>

                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Identity & Finance</div>
                                    <TabsTrigger value="financial-core" className="justify-start h-8 px-3 text-xs"><DollarSign className="h-4 w-4 mr-2" /> Finance & Tax</TabsTrigger>
                                    <TabsTrigger value="branding" className="justify-start h-8 px-3 text-xs"><Palette className="h-4 w-4 mr-2" /> Branding</TabsTrigger>
                                </>
                            )}

                            {/* OUTLET CONTEXT */}
                            {outletId && (
                                <>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">Operational View</div>
                                    <TabsTrigger value="store-identity" className="justify-start h-8 px-3 text-xs"><Store className="h-4 w-4 mr-2" /> Store Identity</TabsTrigger>
                                    <TabsTrigger value="storefront" className="justify-start h-8 px-3 text-xs"><MonitorSmartphone className="h-4 w-4 mr-2" /> Storefront & Hours</TabsTrigger>
                                    <TabsTrigger value="pos-registry" className="justify-start h-8 px-3 text-xs"><CreditCard className="h-4 w-4 mr-2" /> POS & Registry</TabsTrigger>
                                    <TabsTrigger value="inventory-rules" className="justify-start h-8 px-3 text-xs"><Package className="h-4 w-4 mr-2" /> Inventory Rules</TabsTrigger>
                                </>
                            )}

                        </TabsList>
                    </div>
                </Card>

                {/* --- Content Area --- */}
                <div className="flex-1 space-y-4 min-h-[600px]">

                    {/* === PLATFORM SETTINGS CONTENT === */}
                    {!businessUnit && !outletId && !isCompanySettings && (
                        <>
                            <TabsContent value="branding" className="mt-0">
                                <BrandingSettings
                                    context="platform"
                                    data={localSettings?.branding}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="commercial" className="mt-0">
                                <CommercialSaaSSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="security" className="mt-0">
                                <SecuritySettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="compliance" className="mt-0">
                                <ComplianceSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="legal" className="mt-0">
                                <LegalSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="infrahub" className="mt-0">
                                <InfrastructureHubSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="maintenance" className="mt-0">
                                <MaintenanceSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="internationalization" className="mt-0">
                                <InternationalizationSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>
                        </>
                    )}

                    {/* === COMPANY CONTENT === */}
                    {isCompanySettings && (
                        <>
                            <TabsContent value="branding" className="mt-0">
                                <BrandingSettings
                                    data={localSettings?.branding}
                                    onChange={handleZenithChange}
                                    context="organization"
                                />
                            </TabsContent>

                            <TabsContent value="contact" className="mt-0">
                                <ContactSettings
                                    data={localSettings?.contact || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="financial-core" className="mt-0">
                                <FinancialCoreSettings
                                    data={{
                                        ...(localSettings?.financialCore || {}),
                                        fiscalPeriods: localSettings?.fiscalPeriods || []
                                    }}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="tax-intelligence" className="mt-0">
                                <TaxIntelligenceSettings
                                    data={localSettings?.taxIntelligence || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="pricing-policy" className="mt-0">
                                <PricingPolicySettings
                                    data={localSettings?.pricingPolicy || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="corporate" className="mt-0">
                                <CorporateRegistrySettings
                                    data={localSettings?.corporateRegistry || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="doc-governance" className="mt-0">
                                <DocumentGovernanceSettings
                                    data={localSettings?.documentGovernance || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="prefixes" className="mt-0">
                                <PrefixPolicySettings
                                    data={localSettings?.prefixes || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="fulfillment" className="mt-0">
                                <FulfillmentPolicySettings
                                    data={localSettings?.fulfillmentPolicy || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="security" className="mt-0">
                                <SecuritySettings
                                    data={localSettings?.securityHardening}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="governance-policy" className="mt-0">
                                <GovernancePolicySettings
                                    data={localSettings?.governance || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="compliance" className="mt-0">
                                <ComplianceSettings
                                    data={localSettings?.compliance}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="legal" className="mt-0">
                                <LegalSettings
                                    data={localSettings?.legal}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="reporting" className="mt-0">
                                <ReportingSettings
                                    data={localSettings?.reporting || {}}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="internationalization" className="mt-0">
                                <InternationalizationSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="infra-hub" className="mt-0">
                                <InfrastructureHubSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>
                        </>
                    )}

                    {/* === BUSINESS UNIT CONTENT === */}
                    {businessUnit && !outletId && (
                        <>
                            <TabsContent value="overview" className="mt-0"><GeneralSettings data={localSettings} onChange={handleZenithChange} isBusinessUnit={true} /></TabsContent>
                            <TabsContent value="operations" className="mt-0"><OperationsSettings data={localSettings} onChange={handleZenithChange} /></TabsContent>
                            <TabsContent value="hrm" className="mt-0"><HRMSettings data={localSettings} onChange={handleZenithChange} /></TabsContent>

                            <TabsContent value="sales" className="mt-0"><SalesSettings data={localSettings} onChange={handleZenithChange} /></TabsContent>
                            <TabsContent value="pos" className="mt-0"><PosSettings data={localSettings} onChange={handleZenithChange} /></TabsContent>
                            <TabsContent value="inventory" className="mt-0"><InventorySettings data={localSettings} onChange={handleZenithChange} /></TabsContent>

                            {/* Shared Components in BU Context */}
                            <TabsContent value="contact" className="mt-0"><ContactSettings data={localSettings?.contact || {}} onChange={handleZenithChange} /></TabsContent>
                            <TabsContent value="financial-core" className="mt-0"><FinancialCoreSettings data={localSettings?.financialCore || {}} onChange={handleZenithChange} /></TabsContent>
                            <TabsContent value="branding" className="mt-0"><BrandingSettings data={localSettings?.branding} onChange={handleZenithChange} context="business" /></TabsContent>
                        </>
                    )}

                    {/* === OUTLET CONTENT === */}
                    {outletId && (
                        <>
                            <TabsContent value="store-identity" className="mt-0 space-y-6">
                                <BrandingSettings
                                    data={localSettings?.branding}
                                    onChange={handleZenithChange}
                                    context="outlet"
                                />
                                <ContactSettings
                                    data={localSettings?.contact || {}}
                                    onChange={handleZenithChange}
                                />
                                <GeneralSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                    isBusinessUnit={!!businessUnit}
                                />
                            </TabsContent>

                            <TabsContent value="storefront" className="mt-0 space-y-6">
                                <OperationsSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="pos-registry" className="mt-0 space-y-6">
                                <PosSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                                <SalesSettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>

                            <TabsContent value="inventory-rules" className="mt-0">
                                <InventorySettings
                                    data={localSettings}
                                    onChange={handleZenithChange}
                                />
                            </TabsContent>
                        </>
                    )}

                </div>
            </Tabs>
        </div>
    )
}
