"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export function SystemSettings({ data, onChange, isBusinessUnit = false }: { data: any, onChange: (key: string, value: any) => void, isBusinessUnit?: boolean }) {
    if (!data) return null;

    const updateSecurity = (key: string, value: any) => {
        onChange('security', { ...data.security, [key]: value });
    }

    const updateNotifications = (type: 'email' | 'push' | 'sms', key: string, value: boolean) => {
        onChange('notifications', {
            ...data.notifications,
            [type]: { ...data.notifications?.[type], [key]: value }
        });
    }

    const updateMaintenance = (key: string, value: any) => {
        onChange('maintenance', { ...data.maintenance, [key]: value });
    }

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
                                    checked={data.security?.enableHttps}
                                    onCheckedChange={(c) => updateSecurity('enableHttps', c)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable CAPTCHA on Login</Label>
                                </div>
                                <Switch
                                    checked={data.security?.enableCaptcha}
                                    onCheckedChange={(c) => updateSecurity('enableCaptcha', c)}
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
                                    checked={data.security?.blockFailedLogins}
                                    onCheckedChange={(c) => updateSecurity('blockFailedLogins', c)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Session Timeout (Minutes)</Label>
                                <Input
                                    type="number"
                                    value={data.security?.sessionTimeout || 30}
                                    onChange={(e) => updateSecurity('sessionTimeout', parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure alerts and communication channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="mb-4 text-sm font-medium leading-none">Email Notifications</h4>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label>New Orders</Label>
                                <Switch checked={data.notifications?.email?.newOrders} onCheckedChange={(c) => updateNotifications('email', 'newOrders', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Low Stock Alerts</Label>
                                <Switch checked={data.notifications?.email?.lowStock} onCheckedChange={(c) => updateNotifications('email', 'lowStock', c)} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-medium leading-none">SMS Notifications</h4>
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Order Updates</Label>
                                <Switch checked={data.notifications?.sms?.orderUpdates} onCheckedChange={(c) => updateNotifications('sms', 'orderUpdates', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Security Alerts</Label>
                                <Switch checked={data.notifications?.sms?.securityAlerts} onCheckedChange={(c) => updateNotifications('sms', 'securityAlerts', c)} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance Mode */}
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
                            checked={data.maintenance?.enableMaintenanceMode}
                            onCheckedChange={(c) => updateMaintenance('enableMaintenanceMode', c)}
                        />
                    </div>
                    {data.maintenance?.enableMaintenanceMode && (
                        <>
                            <div className="flex items-center justify-between">
                                <Label>Allow Admin Access</Label>
                                <Switch
                                    checked={data.maintenance?.allowAdmins}
                                    onCheckedChange={(c) => updateMaintenance('allowAdmins', c)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Maintenance Message</Label>
                                <Input
                                    value={data.maintenance?.maintenanceMessage || ''}
                                    onChange={(e) => updateMaintenance('maintenanceMessage', e.target.value)}
                                    placeholder="We are undergoing maintenance..."
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
