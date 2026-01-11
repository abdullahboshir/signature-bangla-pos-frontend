"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { IPlatformSettings, IBusinessUnitSettings, ICompanySettings } from "@/types/settings"

interface SystemSettingsProps {
    data: IPlatformSettings | IBusinessUnitSettings | ICompanySettings;
    onChange: (section: string, value: any) => void;
    isBusinessUnit?: boolean;
}

export function SystemSettings({ data, onChange, isBusinessUnit = false }: SystemSettingsProps) {
    if (!data) return null;

    // Type guard or safe access for maintenance
    const hasMaintenance = 'maintenance' in data && !!data.maintenance;

    const updateSecurity = (key: string, value: any) => {
        onChange('securityHardening', {
            ...data.securityHardening,
            networkPolicy: {
                ...data.securityHardening?.networkPolicy,
                [key]: value
            },
            // Handle root level fields if any, or nested policies
            // The UI seems to mix network policy and session policy
        });
    }

    // Helper for nested security updates
    const updateSecurityPolicy = (policy: 'networkPolicy' | 'sessionPolicy', key: string, value: any) => {
        onChange('securityHardening', {
            ...data.securityHardening,
            [policy]: {
                ...data.securityHardening?.[policy],
                [key]: value
            }
        });
    }

    const updateMaintenance = (key: string, value: any) => {
        if (hasMaintenance) {
            onChange('maintenance', { ...(data as any).maintenance, [key]: value });
        }
    }

    // Notifications usually not in Platform/BU settings directly in the same way. 
    // Assuming 'communication' channel settings for BU, or maybe strictly UI state for now if not backend backed yet.
    // For now we will hide Notification section if it doesn't map to `communication` or strict backend type.

    return (
        <div className="space-y-6">
            {/* Security Settings - Global Only for certain fields */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage security protocols and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isBusinessUnit && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable HTTPS Redirection</Label>
                                </div>
                                <Switch
                                    checked={data.securityHardening?.networkPolicy?.enableHttps}
                                    onCheckedChange={(c) => updateSecurityPolicy('networkPolicy', 'enableHttps', c)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable CAPTCHA on Login</Label>
                                </div>
                                <Switch
                                    checked={data.securityHardening?.networkPolicy?.enableCaptcha}
                                    onCheckedChange={(c) => updateSecurityPolicy('networkPolicy', 'enableCaptcha', c)}
                                />
                            </div>
                        </>
                    )}

                    {!isBusinessUnit && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Block Failed Login Attempts</Label>
                                </div>
                                <Switch
                                    checked={data.securityHardening?.networkPolicy?.blockFailedLogins}
                                    onCheckedChange={(c) => updateSecurityPolicy('networkPolicy', 'blockFailedLogins', c)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Session Timeout (Minutes)</Label>
                                <Input
                                    type="number"
                                    value={data.securityHardening?.sessionPolicy?.inactivityTimeoutMinutes || 30}
                                    onChange={(e) => updateSecurityPolicy('sessionPolicy', 'inactivityTimeoutMinutes', parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Maintenance Mode - Conditional */}
            {hasMaintenance && (
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance Mode</CardTitle>
                        <CardDescription>Temporarily disable the storefront</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Maintenance Mode</Label>
                                <p className="text-xs text-muted-foreground">Store will be inaccessible to customers</p>
                            </div>
                            <Switch
                                checked={(data as any).maintenance?.enableMaintenanceMode}
                                onCheckedChange={(c) => updateMaintenance('enableMaintenanceMode', c)}
                            />
                        </div>
                        {(data as any).maintenance?.enableMaintenanceMode && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label>Allow Admin Access</Label>
                                    <Switch
                                        checked={(data as any).maintenance?.allowAdmins}
                                        onCheckedChange={(c) => updateMaintenance('allowAdmins', c)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Maintenance Message</Label>
                                    <Input
                                        value={(data as any).maintenance?.maintenanceMessage || ''}
                                        onChange={(e) => updateMaintenance('maintenanceMessage', e.target.value)}
                                        placeholder="We are undergoing maintenance..."
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
