"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useThemeSettings } from "@/lib/providers/ThemeSettingsProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, User, Shield, Store, Palette, Globe, ShoppingCart, MonitorSmartphone, Package } from "lucide-react"

import { GeneralSettings } from "@/components/modules/settings/GeneralSettings"
import { SalesSettings } from "@/components/modules/settings/SalesSettings"
import { PosSettings } from "@/components/modules/settings/PosSettings"
import { SystemSettings } from "@/components/modules/settings/SystemSettings"
import { InventorySettings } from "@/components/modules/settings/InventorySettings"
import { ModuleToggleSettings } from "@/components/modules/settings/ModuleToggleSettings"

import { useGetBusinessUnitSettingsQuery, useUpdateBusinessUnitSettingsMutation, useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from "@/redux/api/system/settingsApi"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { usePermissions } from "@/hooks/usePermissions"
import { PERMISSION_KEYS } from "@/config/permission-keys"

export function SettingsInterface() {
    const params = useParams()
    const searchParams = useSearchParams()
    // Determine context
    const { user } = useAuth();
    const { isSuperAdmin } = usePermissions();

    // For [role] routes, we have these params. For SA route, we might not.
    const paramBusinessUnit = params?.["business-unit"] as string
    const outletId = searchParams.get('outlet');

    // Resolve slug to ID if param exists and matches a BU in user context
    const matchedBU = user?.businessUnits?.find((bu: any) => bu.id === paramBusinessUnit || bu._id === paramBusinessUnit || bu.slug === paramBusinessUnit);
    const businessUnit = matchedBU?._id || matchedBU?.id || paramBusinessUnit; // undefined if global

    const { theme, isLoading: themeLoading, isSaving, updateTheme, resetTheme, previewTheme } = useThemeSettings()

    // Permission Hook
    const { hasPermission } = usePermissions();

    // API Hooks
    // If businessUnit is defined, fetch specific BU settings.
    const { data: buSettingsData, isLoading: buSettingsLoading } = useGetBusinessUnitSettingsQuery(businessUnit, { skip: !businessUnit });

    // If businessUnit is undefined (Global), fetch System settings
    const { data: systemSettingsData, isLoading: systemSettingsLoading } = useGetSystemSettingsQuery(undefined, { skip: !!businessUnit });

    const settingsData = businessUnit ? buSettingsData : systemSettingsData;
    const settingsLoading = businessUnit ? buSettingsLoading : systemSettingsLoading;

    // Use updateSystemSettings if global
    const [updateBUSettings, { isLoading: updateBULoading }] = useUpdateBusinessUnitSettingsMutation();
    const [updateSystemSettings, { isLoading: updateSystemLoading }] = useUpdateSystemSettingsMutation();
    const updateLoading = updateBULoading || updateSystemLoading;

    const [localSettings, setLocalSettings] = useState<any>(null);

    // Default Tab Logic
    const tabFromUrl = searchParams.get('tab');
    // Calculate default tab based on context
    const defaultTab = outletId ? "outlet-setup" : (businessUnit ? "overview" : "system");

    const [activeTab, setActiveTab] = useState(tabFromUrl || defaultTab);

    // Sync state with URL if it changes (e.g. Sidebar navigation)
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    // Update URL when tab changes (optional but good for deep linking)
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        // We could pushRouter here to update URL, but purely UI state is okay too if sidebar drives it.
        // If user clicks Tab manually, URL won't update, but content will. 
        // If user clicks Sidebar, URL updates, useEffect picks it up, content updates. This works.
    }

    useEffect(() => {
        if (settingsData) {
            setLocalSettings(JSON.parse(JSON.stringify(settingsData)));
        }
    }, [settingsData]);


    const handleSettingsChange = (section: string, value: any) => {
        setLocalSettings((prev: any) => ({
            ...prev,
            [section]: value
        }));
    }

    const saveSettings = async () => {
        try {
            if (businessUnit) {
                await updateBUSettings({ businessUnitId: businessUnit, body: localSettings }).unwrap();
                toast.success("Outlet settings updated successfully");
            } else {
                await updateSystemSettings(localSettings).unwrap();
                toast.success("System settings updated successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update settings");
        }
    }

    // Theme State
    const [primary, setPrimary] = useState(theme.primary || "")
    const [secondary, setSecondary] = useState(theme.secondary || "")
    const [radius, setRadius] = useState(theme.radius ?? 10)
    const [fontScale, setFontScale] = useState(theme.fontScale ?? 1)
    const [buttonScale, setButtonScale] = useState(theme.buttonScale ?? 1)
    const [tableRowHeight, setTableRowHeight] = useState(theme.tableRowHeight ?? 56)

    useEffect(() => {
        if (!themeLoading) {
            setPrimary(theme.primary || "")
            setSecondary(theme.secondary || "")
            setRadius(theme.radius ?? 10)
            setFontScale(theme.fontScale ?? 1)
            setButtonScale(theme.buttonScale ?? 1)
            setTableRowHeight(theme.tableRowHeight ?? 56)
        }
    }, [theme, themeLoading])

    // Live Preview Effect
    const handlePreviewChange = (key: keyof typeof theme, value: any) => {
        switch (key) {
            case 'primary': setPrimary(value); break;
            case 'secondary': setSecondary(value); break;
            case 'radius': setRadius(value); break;
            case 'fontScale': setFontScale(value); break;
            case 'buttonScale': setButtonScale(value); break;
            case 'tableRowHeight': setTableRowHeight(value); break;
        }
        previewTheme({ [key]: value });
    }

    const handleThemeSave = async (overrides?: Partial<typeof theme>) => {
        await updateTheme({
            primary: overrides?.primary ?? primary,
            secondary: overrides?.secondary ?? secondary,
            radius: overrides?.radius ?? radius,
            fontScale: overrides?.fontScale ?? fontScale,
            buttonScale: overrides?.buttonScale ?? buttonScale,
            tableRowHeight: overrides?.tableRowHeight ?? tableRowHeight,
        })
        toast.success("Theme settings saved");
    }

    // Simplified Loading/Error State
    if (settingsLoading && !localSettings && businessUnit) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>
    }

    // Determine write permission based on context
    const canSave = outletId
        ? hasPermission(PERMISSION_KEYS.OUTLET.UPDATE) // Outlet context
        : businessUnit
            ? hasPermission(PERMISSION_KEYS.BUSINESS_UNIT.UPDATE) || hasPermission(PERMISSION_KEYS.SYSTEM.UPDATE) // Business context (fallback to system for SA)
            : hasPermission(PERMISSION_KEYS.SYSTEM.UPDATE); // Global context

    return (
        <div className="container mx-auto py-6 space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {outletId ? "Outlet Settings" : (businessUnit ? "Business Settings" : "Global Settings")}
                    </h1>
                    <p className="text-muted-foreground">
                        {outletId
                            ? "Configure settings specific to this outlet"
                            : (businessUnit
                                ? "Manage your Business Unit configuration and preferences"
                                : "Manage global system modules, licensing, and platform defaults")}
                    </p>
                </div>
                <Button onClick={saveSettings} disabled={updateLoading || !localSettings || !canSave}>
                    {updateLoading ? "Saving..." : (outletId ? "Save Outlet Config" : "Save Configuration")}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <TabsList>
                    {/* --- Global Tabs --- */}
                    {!businessUnit && !outletId && (
                        <>
                            <TabsTrigger value="system" className="flex items-center gap-2"><Settings className="h-4 w-4" /> General</TabsTrigger>
                            <TabsTrigger value="modules" className="flex items-center gap-2"><Package className="h-4 w-4" /> Modules & Licensing</TabsTrigger>
                            <TabsTrigger value="theme" className="flex items-center gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
                            <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile & Security</TabsTrigger>
                        </>
                    )}

                    {/* --- Business Unit Tabs --- */}
                    {businessUnit && !outletId && (
                        <>
                            <TabsTrigger value="overview" className="flex items-center gap-2"><Store className="h-4 w-4" /> Overview</TabsTrigger>
                            <TabsTrigger value="general" className="flex items-center gap-2"><Settings className="h-4 w-4" /> General</TabsTrigger>
                            <TabsTrigger value="outlet-setup" className="flex items-center gap-2"><Globe className="h-4 w-4" /> Outlets</TabsTrigger>
                            <TabsTrigger value="sales" className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Sales</TabsTrigger>
                            <TabsTrigger value="pos" className="flex items-center gap-2"><MonitorSmartphone className="h-4 w-4" /> POS</TabsTrigger>
                            <TabsTrigger value="inventory" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Inventory</TabsTrigger>
                            <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
                        </>
                    )}

                    {/* --- Outlet Tabs --- */}
                    {outletId && (
                        <TabsTrigger value="outlet-setup" className="flex items-center gap-2"><Globe className="h-4 w-4" /> Outlet Setup</TabsTrigger>
                    )}
                </TabsList>

                {/* ================= GLOBAL CONTENT ================= */}
                {!businessUnit && !outletId && (
                    <>
                        <TabsContent value="system" className="space-y-6">
                            {/* Global System Settings */}
                            {localSettings ? (
                                <SystemSettings data={localSettings} onChange={handleSettingsChange} isBusinessUnit={false} />
                            ) : (
                                <div className="p-4 border rounded mb-4 text-muted-foreground">Loading system settings...</div>
                            )}
                        </TabsContent>

                        {/* Separate Modules Tab */}
                        <TabsContent value="modules" className="space-y-6">
                            <ModuleToggleSettings />
                        </TabsContent>

                        <TabsContent value="theme" className="space-y-4">
                            {/* Theme Settings - STRICTLY GLOBAL (Super Admin Only usually) */}
                            {isSuperAdmin && (
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center space-x-2">
                                            <Palette className="h-5 w-5" />
                                            <CardTitle>Appearance & Theme</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Configure global colors and typography for your POS dashboard
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2">

                                            <div className="space-y-2">
                                                <Label>Primary Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="color"
                                                        value={primary}
                                                        onChange={(e) => handlePreviewChange('primary', e.target.value)}
                                                        className="h-10 w-10 p-1 cursor-pointer rounded-md border"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={primary}
                                                        onChange={(e) => handlePreviewChange('primary', e.target.value)}
                                                        placeholder="#000000"
                                                        className="font-mono uppercase"
                                                    />
                                                </div>
                                            </div>

                                            {/* Secondary Color */}
                                            <div className="space-y-2">
                                                <Label>Secondary Color</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="color"
                                                        value={secondary}
                                                        onChange={(e) => handlePreviewChange('secondary', e.target.value)}
                                                        className="h-10 w-10 p-1 cursor-pointer rounded-md border"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={secondary}
                                                        onChange={(e) => handlePreviewChange('secondary', e.target.value)}
                                                        placeholder="#000000"
                                                        className="font-mono uppercase"
                                                    />
                                                </div>
                                            </div>

                                            {/* Border Radius */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Border Radius (px)</Label>
                                                    <span className="text-xs text-muted-foreground">{radius}px</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="range"
                                                        min="0"
                                                        max="20"
                                                        value={radius}
                                                        onChange={(e) => handlePreviewChange('radius', Number(e.target.value))}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={radius}
                                                        onChange={(e) => handlePreviewChange('radius', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>


                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Font Scale</Label>
                                                    <span className="text-xs text-muted-foreground">{fontScale}x</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="range"
                                                        min="0.5"
                                                        max="2"
                                                        step="0.05"
                                                        value={fontScale}
                                                        onChange={(e) => handlePreviewChange('fontScale', Number(e.target.value))}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={fontScale}
                                                        onChange={(e) => handlePreviewChange('fontScale', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>

                                            {/* Button Scale */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Button Scale</Label>
                                                    <span className="text-xs text-muted-foreground">{buttonScale}x</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="range"
                                                        min="0.5"
                                                        max="1.5"
                                                        step="0.05"
                                                        value={buttonScale}
                                                        onChange={(e) => handlePreviewChange('buttonScale', Number(e.target.value))}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        value={buttonScale}
                                                        onChange={(e) => handlePreviewChange('buttonScale', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>

                                            {/* Table Row Height */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Table Row Height (px)</Label>
                                                    <span className="text-xs text-muted-foreground">{tableRowHeight}px</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="range"
                                                        min="10"
                                                        max="80"
                                                        value={tableRowHeight}
                                                        onChange={(e) => handlePreviewChange('tableRowHeight', Number(e.target.value))}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={tableRowHeight}
                                                        onChange={(e) => handlePreviewChange('tableRowHeight', Number(e.target.value))}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4 gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={async () => {
                                                    if (window.confirm("Are you sure you want to reset all theme settings to default?")) {
                                                        await resetTheme();
                                                        toast.success("Theme reset to defaults");
                                                    }
                                                }}
                                                disabled={isSaving}
                                            >
                                                Reset Defaults
                                            </Button>
                                            <Button onClick={() => handleThemeSave()} disabled={isSaving || !hasPermission(PERMISSION_KEYS.SYSTEM.UPDATE)}>Save Theme</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </>
                )}

                {/* ================= BUSINESS UNIT CONTENT ================= */}
                {businessUnit && !outletId && (
                    <>
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Store className="h-5 w-5" />
                                        <CardTitle>Business Unit</CardTitle>
                                    </div>
                                    <CardDescription>Manage business unit settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessName">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            placeholder="Business Name"
                                            defaultValue={businessUnit ? businessUnit.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Global Config'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" placeholder="Business Address" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Input id="timezone" placeholder="UTC+6" defaultValue="UTC+6" />
                                    </div>
                                    <Button className="w-full">Update Business Unit</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="general" className="space-y-4">
                            {/* BU General Settings (reusing SystemSettings component but in BU mode) */}
                            {localSettings ? (
                                <SystemSettings data={localSettings} onChange={handleSettingsChange} isBusinessUnit={true} />
                            ) : (
                                <div>Loading configuration...</div>
                            )}
                        </TabsContent>

                        <TabsContent value="outlet-setup" className="space-y-4">
                            {localSettings ? (
                                <GeneralSettings data={localSettings} onChange={handleSettingsChange} isBusinessUnit={true} />
                            ) : (
                                <div>Select a Business Unit to configure Outlet Settings</div>
                            )}
                        </TabsContent>

                        <TabsContent value="sales" className="space-y-4">
                            {localSettings ? (
                                <SalesSettings data={localSettings} onChange={handleSettingsChange} />
                            ) : (
                                <div>Select a Business Unit to configure Sales Settings</div>
                            )}
                        </TabsContent>

                        <TabsContent value="pos" className="space-y-4">
                            {localSettings ? (
                                <PosSettings data={localSettings} onChange={handleSettingsChange} />
                            ) : (
                                <div>Select a Business Unit to configure POS Settings</div>
                            )}
                        </TabsContent>

                        <TabsContent value="inventory" className="space-y-4">
                            {localSettings ? (
                                <InventorySettings data={localSettings} onChange={handleSettingsChange} />
                            ) : (
                                <div>Select a Business Unit to configure Inventory Settings</div>
                            )}
                        </TabsContent>
                    </>
                )}

                {/* ================= OUTLET CONTENT ================= */}
                {outletId && (
                    <TabsContent value="outlet-setup" className="space-y-4">
                        {localSettings ? (
                            <GeneralSettings data={localSettings} onChange={handleSettingsChange} isBusinessUnit={!!businessUnit} />
                        ) : (
                            <div>Select a Business Unit to configure Outlet Settings</div>
                        )}
                    </TabsContent>
                )}

                {/* ================= SHARED PROFILE CONTENT (Global & BU) ================= */}
                {/* Available if not in outlet mode (assuming outlet managers use same profile tab or it's separated) */}
                {!outletId && (
                    <TabsContent value="profile" className="space-y-4">
                        {/* Profile Settings */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <CardTitle>Profile Settings</CardTitle>
                                    </div>
                                    <CardDescription>Update your profile information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" defaultValue={user?.name?.firstName || "Super Admin"} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" defaultValue={user?.email || "admin@example.com"} />
                                    </div>
                                    <Button className="w-full">Save Changes</Button>
                                </CardContent>
                            </Card>

                            {/* Security Settings */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5" />
                                        <CardTitle>Security</CardTitle>
                                    </div>
                                    <CardDescription>Manage your account security</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" placeholder="••••••••" />
                                    </div>
                                    <Button className="w-full">Update Password</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
