"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Package, Zap, HardDrive, Activity, Globe, Server } from "lucide-react"
import { toast } from "sonner"

import { ModuleToggleSettings } from "@/components/modules/settings/ModuleToggleSettings"
import SystemCoreSettings from "@/components/modules/settings/shared/SystemCoreSettings"
import ObservabilitySettings from "@/components/modules/settings/shared/ObservabilitySettings"
import GatewayGovernanceSettings from "@/components/modules/settings/shared/GatewayGovernanceSettings"
import StorageRegistrySettings from "@/components/modules/settings/shared/StorageRegistrySettings"
import InternationalizationSettings from "@/components/modules/settings/shared/InternationalizationSettings"
import InfrastructureClusterSettings from "@/components/modules/settings/shared/InfrastructureClusterSettings"

import {
    useGetSystemSettingsQuery,
    useUpdateSystemSettingsMutation,
} from "@/redux/api/system/settingsApi"

export function SystemSettingsInterface() {
    const searchParams = useSearchParams()
    const tabParam = searchParams?.get("tab")
    const [activeTab, setActiveTab] = useState(tabParam || "general")

    const { data: systemSettings, isLoading } = useGetSystemSettingsQuery(undefined)
    const [updateSystemSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation()

    const [localSettings, setLocalSettings] = useState<any>({})

    useEffect(() => {
        if (systemSettings) {
            setLocalSettings(systemSettings)
        }
    }, [systemSettings])

    useEffect(() => {
        if (tabParam) setActiveTab(tabParam)
    }, [tabParam])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const url = new URL(window.location.href)
        url.searchParams.set("tab", value)
        window.history.pushState({}, "", url)
    }

    // Root-level handler (e.g., licenseKey, softDeleteRetentionDays)
    const handleRootChange = (key: string, _: string, value: any) => {
        setLocalSettings((prev: any) => ({ ...prev, [key]: value }))
    }

    // Nested handler (e.g., core, observability, storageRegistry, infrastructureHub)
    const handleNestedChange = (section: string, key: string, value: any) => {
        setLocalSettings((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }))
    }

    // Special handler for Core nested fields which might be emitted as onNestedChange('core', 'smtp', ...)
    // But SystemCoreSettings calls onNestedChange('smtp', '', 'host', val) currently? 
    // Wait, the plan says update SystemCoreSettings to: onNestedChange('core', 'smtp', key, val)
    // So SystemSettingsInterface needs a handler that accepts 4 args? Or reuse handleDeepNestedChange?
    // handleDeepNestedChange uses (section, subsection, key, value). 
    // If I call onNestedChange('core', 'smtp', 'host', val), that fits handleDeepNestedChange signature if I rename the prop in child.


    // Deep nested handler (e.g., observability.healthCheck, gatewayGovernance.rateLimiting)
    const handleDeepNestedChange = (section: string, subsection: string, key: string, value: any) => {
        setLocalSettings((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: { ...prev[section]?.[subsection], [key]: value }
            }
        }))
    }

    const handleSave = async () => {
        try {
            await updateSystemSettings(localSettings).unwrap()
            toast.success("System settings updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update system settings")
        }
    }

    if (isLoading) {
        return <div className="p-6">Loading system settings...</div>
    }

    return (
        <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Configure platform-level infrastructure, observability, and governance.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isUpdating} size="lg">
                    {isUpdating ? "Saving..." : "Save All Changes"}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} orientation="vertical" className="flex flex-col lg:flex-row gap-6">
                {/* Vertical Sidebar */}
                <Card className="w-full lg:w-auto h-fit shrink-0 p-0 overflow-hidden bg-background sticky top-6">
                    <div className="bg-muted/40 p-3 border-b">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            System Settings
                        </h3>
                    </div>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        <TabsList className="flex flex-col items-stretch w-full h-auto bg-transparent p-2 gap-1">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">Core & Governance</div>
                            <TabsTrigger value="general" className="justify-start h-8 px-3 text-xs"><Settings className="h-4 w-4 mr-2" /> General Config</TabsTrigger>
                            <TabsTrigger value="modules" className="justify-start h-8 px-3 text-xs"><Package className="h-4 w-4 mr-2" /> Module Registry</TabsTrigger>
                            <TabsTrigger value="gateway" className="justify-start h-8 px-3 text-xs"><Zap className="h-4 w-4 mr-2" /> Gateway Governance</TabsTrigger>
                            <TabsTrigger value="storage" className="justify-start h-8 px-3 text-xs"><HardDrive className="h-4 w-4 mr-2" /> Storage Registry</TabsTrigger>
                            <TabsTrigger value="cluster" className="justify-start h-8 px-3 text-xs"><Server className="h-4 w-4 mr-2" /> Infrastructure Cluster</TabsTrigger>
                            <TabsTrigger value="internationalization" className="justify-start h-8 px-3 text-xs"><Globe className="h-4 w-4 mr-2" /> Internationalization</TabsTrigger>

                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-1">Observability & Ops</div>
                            <TabsTrigger value="observability" className="justify-start h-8 px-3 text-xs"><Activity className="h-4 w-4 mr-2" /> Observability</TabsTrigger>
                        </TabsList>
                    </div>
                </Card>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <TabsContent value="general" className="mt-0">
                        <SystemCoreSettings
                            data={localSettings}
                            onChange={handleRootChange}
                            onNestedChange={handleDeepNestedChange}
                        />
                    </TabsContent>

                    <TabsContent value="modules" className="mt-0">
                        <ModuleToggleSettings />
                    </TabsContent>

                    <TabsContent value="gateway" className="mt-0">
                        <GatewayGovernanceSettings
                            data={localSettings}
                            onChange={handleDeepNestedChange}
                        />
                    </TabsContent>

                    <TabsContent value="storage" className="mt-0">
                        <StorageRegistrySettings
                            data={localSettings}
                            onChange={handleNestedChange}
                        />
                    </TabsContent>

                    <TabsContent value="cluster" className="mt-0">
                        <InfrastructureClusterSettings
                            data={localSettings}
                            onChange={handleNestedChange}
                        />
                    </TabsContent>

                    <TabsContent value="observability" className="mt-0">
                        <ObservabilitySettings
                            data={localSettings}
                            onChange={handleDeepNestedChange}
                        />
                    </TabsContent>

                    <TabsContent value="internationalization" className="mt-0">
                        <InternationalizationSettings
                            data={localSettings}
                            onChange={handleNestedChange}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
