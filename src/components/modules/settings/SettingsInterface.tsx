"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, User, Shield, Store, Palette, Globe, ShoppingCart, MonitorSmartphone } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useThemeSettings } from "@/lib/providers/ThemeSettingsProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "@/components/modules/settings/GeneralSettings"
import { SalesSettings } from "@/components/modules/settings/SalesSettings"
import { PosSettings } from "@/components/modules/settings/PosSettings"
import { SystemSettings } from "@/components/modules/settings/SystemSettings"
import { useGetBusinessUnitSettingsQuery, useUpdateBusinessUnitSettingsMutation } from "@/redux/api/settingsApi"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

export function SettingsInterface() {
    const params = useParams()
    // Determine context
    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.some((r: any) => (typeof r === 'string' ? r : r.name) === 'super-admin');

    // For [role] routes, we have these params. For SA route, we might not.
    const paramBusinessUnit = params?.["business-unit"] as string

    // If SA and in SA route (no param), businessUnit might be undefined.
    // Ideally SA should select a BU or manage "Default/Global" settings.
    // User complained about "Theme", which works globally usually.

    const businessUnit = paramBusinessUnit;

    const { theme, isLoading: themeLoading, isSaving, updateTheme, resetTheme, previewTheme } = useThemeSettings()

    // API Hooks
    // If businessUnit is undefined, this query might compile global settings or skip.
    const { data: settingsData, isLoading: settingsLoading } = useGetBusinessUnitSettingsQuery(businessUnit, { skip: !businessUnit && !isSuperAdmin });
    // Note: if SA and no BU, do we get Global settings? Assuming yes or skipping for now.

    const [updateSettings, { isLoading: updateLoading }] = useUpdateBusinessUnitSettingsMutation();

    const [localSettings, setLocalSettings] = useState<any>(null);

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
        if (!businessUnit && !isSuperAdmin) return; // Safety
        try {
            // If SA and no BU, we probably pass something else or nothing? 
            // Assuming update settings endpoint handles global if ID is missing or special.

            await updateSettings({ businessUnitId: businessUnit, body: localSettings }).unwrap();
            toast.success("Store settings updated successfully");
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

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your store configuration and preferences
                    </p>
                </div>
                <Button onClick={saveSettings} disabled={updateLoading || !localSettings}>
                    {updateLoading ? "Saving..." : "Save Store Configuration"}
                </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview" className="flex items-center gap-2"><Store className="h-4 w-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="store-setup" className="flex items-center gap-2"><Globe className="h-4 w-4" /> Store Setup</TabsTrigger>
                    <TabsTrigger value="sales" className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Sales & Finance</TabsTrigger>
                    <TabsTrigger value="pos" className="flex items-center gap-2"><MonitorSmartphone className="h-4 w-4" /> POS & Loyalty</TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center gap-2"><Settings className="h-4 w-4" /> System & Admin</TabsTrigger>
                </TabsList>

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
                                    defaultValue={businessUnit ? businessUnit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Global Config'}
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

                <TabsContent value="store-setup" className="space-y-4">
                    {localSettings ? (
                        <GeneralSettings data={localSettings} onChange={handleSettingsChange} />
                    ) : (
                        <div>Select a Business Unit to configure Store Settings</div>
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

                <TabsContent value="admin" className="space-y-4">
                    {localSettings ? (
                        <SystemSettings data={localSettings} onChange={handleSettingsChange} />
                    ) : (
                        <div className="p-4 border rounded mb-4 text-muted-foreground">System settings loaded from global context.</div>
                    )}

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

                    {/* Theme Settings - ENHANCED UI */}
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
                                    {/* Primary Color */}
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

                                    {/* Font Scale */}
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
                                    <Button onClick={() => handleThemeSave()} disabled={isSaving}>Save Theme</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

            </Tabs>
        </div>
    )
}
