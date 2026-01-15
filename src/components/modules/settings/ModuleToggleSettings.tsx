"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from "@/redux/api/system/settingsApi"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Save, Key, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resolveModules, validateModuleToggle } from "@/config/package-features"

export function ModuleToggleSettings() {
    const { data: settings, isLoading } = useGetSystemSettingsQuery(undefined);
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();

    // Default state
    const [modules, setModules] = useState({
        pos: true,
        erp: true,
        hrm: true,
        ecommerce: true,
        crm: true,
        logistics: true,
        finance: true,
        marketing: true,
        integrations: true,
        governance: false,
        saas: true
    });
    const [licenseKey, setLicenseKey] = useState("");

    useEffect(() => {
        if (settings?.enabledModules) {
            const loadedModules = {
                pos: settings.enabledModules.pos ?? true,
                erp: settings.enabledModules.erp ?? true,
                hrm: settings.enabledModules.hrm ?? true,
                ecommerce: settings.enabledModules.ecommerce ?? true,
                crm: settings.enabledModules.crm ?? true,
                logistics: settings.enabledModules.logistics ?? true,
                finance: settings.enabledModules.finance ?? true,
                marketing: settings.enabledModules.marketing ?? true,
                integrations: settings.enabledModules.integrations ?? true,
                governance: settings.enabledModules.governance ?? false,
                saas: settings.enabledModules.saas ?? true,
            };
            // Apply auto-enable logic when loading from settings
            setModules(resolveModules(loadedModules) as typeof modules);
            if (settings.licenseKey) {
                setLicenseKey(settings.licenseKey);
            }
        }
    }, [settings]);

    const handleToggle = (key: keyof typeof modules, checked: boolean) => {
        // Validate the toggle action
        const validation = validateModuleToggle(modules, key, checked);
        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        setModules(prev => {
            const updated = {
                ...prev,
                [key]: checked
            };
            // Apply auto-enable logic
            return resolveModules(updated) as typeof prev;
        });
    };

    const handleSave = async () => {
        try {
            await updateSettings({
                enabledModules: modules,
                licenseKey: licenseKey
            }).unwrap();
            toast.success("Module settings updated successfully");
            // Optional: Reload page to reflect sidebar changes immediately if not using reactive state everywhere
            // window.location.reload(); 
        } catch (error) {
            console.error(error);
            toast.error("Failed to update module settings");
        }
    };

    if (isLoading) {
        return <div className="p-4 border rounded mb-4 flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Loading module settings...</div>
    }

    return (
        <Card className="mb-6 border-blue-200 bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-800/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            System Modules & Licensing
                        </CardTitle>
                        <CardDescription>
                            Manage active modules and valid commercial licenses.
                        </CardDescription>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* License Key Section */}
                <div className="bg-background p-4 rounded-lg border border-blue-100 dark:border-blue-900/50 space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                        <Key className="h-4 w-4 text-orange-500" />
                        Commercial License Key
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            className="font-mono uppercase tracking-wider"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                        />
                        <Button variant="outline" className="shrink-0 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
                            Verified
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        License Type: <span className="font-medium text-blue-700 dark:text-blue-400">Enterprise Global Unlimited</span> • Valid until Dec 2030
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ModuleSwitch
                        label="POS System"
                        description="Point of Sale terminal and config"
                        checked={modules.pos}
                        onCheckedChange={(c) => handleToggle('pos', c)}
                    />
                    <ModuleSwitch
                        label="ERP Core & Master Data"
                        description="Shared business entities, workflows & master data framework"
                        checked={modules.erp}
                        onCheckedChange={(c) => handleToggle('erp', c)}
                    />
                    <ModuleSwitch
                        label="Finance & Accounting"
                        description="General Ledger, Invoicing & Financial Reports"
                        checked={modules.finance}
                        onCheckedChange={(c) => handleToggle('finance', c)}
                    />
                    <ModuleSwitch
                        label="Logistics & Supply Chain"
                        description="Inventory, Shipments & Warehouse"
                        checked={modules.logistics}
                        onCheckedChange={(c) => handleToggle('logistics', c)}
                    />
                    <ModuleSwitch
                        label="HRM & Payroll"
                        description="Staff, Attendance, Payroll, Departments"
                        checked={modules.hrm}
                        onCheckedChange={(c) => handleToggle('hrm', c)}
                    />
                    <ModuleSwitch
                        label="E-Commerce"
                        description="Online Storefront, Themes & CMS"
                        checked={modules.ecommerce}
                        onCheckedChange={(c) => handleToggle('ecommerce', c)}
                    />
                    <ModuleSwitch
                        label="CRM Suite"
                        description="Customer Relation & Sales pipeline"
                        checked={modules.crm}
                        onCheckedChange={(c) => handleToggle('crm', c)}
                    />
                    <ModuleSwitch
                        label="Marketing Automation"
                        description="Campaigns, Emails & Social engagement"
                        checked={modules.marketing}
                        onCheckedChange={(c) => handleToggle('marketing', c)}
                    />

                    <ModuleSwitch
                        label="Integrations (Add-on)"
                        description="APIs, Webhooks & Gateways"
                        checked={modules.integrations}
                        onCheckedChange={(c) => handleToggle('integrations', c)}
                    />
                    <ModuleSwitch
                        label="Governance & Elite Policy"
                        description="Board-level management, shareholder voting & enterprise compliance"
                        checked={modules.governance}
                        onCheckedChange={(c) => handleToggle('governance', c)}
                    />
                    <ModuleSwitch
                        label="SaaS Ecosystem"
                        description="Multi-tenant subscription management, licensing & billing orchestration"
                        checked={modules.saas}
                        onCheckedChange={(c) => handleToggle('saas', c)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function ModuleSwitch({ label, description, checked, onCheckedChange }: { label: string, description: string, checked: boolean, onCheckedChange: (c: boolean) => void }) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm dark:border-muted">
            <div className="space-y-0.5">
                <Label className="text-base font-semibold">{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    )
}

