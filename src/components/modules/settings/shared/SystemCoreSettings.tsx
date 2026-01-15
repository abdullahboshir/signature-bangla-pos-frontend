"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SystemCoreSettingsProps {
    data: any;
    onChange: (section: string, key: string, value: any) => void;

    // Helper for nested updates since SystemSettings is structure differently
    onNestedChange: (section: string, subsection: string, key: string, value: any) => void;
}

export default function SystemCoreSettings({ data, onChange, onNestedChange }: SystemCoreSettingsProps) {
    // Helper to tunnel updates into 'core' object
    const handleCoreChange = (key: string, value: any) => {
        onChange('core', key, value);
    };

    const handleCoreNestedChange = (subsection: string, key: string, value: any) => {
        onNestedChange('core', subsection, key, value);
    };

    const coreData = data?.core || {};

    return (
        <div className="space-y-4">
            {/* Platform Governance */}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Governance</CardTitle>
                    <CardDescription>Core licensing and data retention policies.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>License Key</Label>
                            <Input
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={data?.licenseKey || ""}
                                onChange={(e) => onChange('licenseKey', '', e.target.value)} // Root level
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Soft-Delete Retention (Days)</Label>
                            <Input
                                type="number"
                                value={data?.softDeleteRetentionDays || 30}
                                onChange={(e) => onChange('softDeleteRetentionDays', '', parseInt(e.target.value))} // Root level
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Retention Policy Enabled</Label>
                            <p className="text-xs text-muted-foreground">Automated cleanup of soft-deleted records.</p>
                        </div>
                        <Switch
                            checked={data?.isRetentionPolicyEnabled || false}
                            onCheckedChange={(c) => onChange('isRetentionPolicyEnabled', '', c)} // Root level
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Storage Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>System Storage</CardTitle>
                    <CardDescription>File system and driver configuration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Storage Driver</Label>
                            <Select
                                value={coreData.storageDriver || "local"}
                                onValueChange={(v) => handleCoreChange('storageDriver', v)} // core.storageDriver
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">Local Filesystem</SelectItem>
                                    <SelectItem value="s3">AWS S3</SelectItem>
                                    <SelectItem value="cloudinary">Cloudinary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Max Storage Limit (GB)</Label>
                            <Input
                                type="number"
                                value={coreData.maxStorageLimitGB || 0}
                                onChange={(e) => handleCoreChange('maxStorageLimitGB', parseInt(e.target.value))} // core.maxStorageLimitGB
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SMTP Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>SMTP Configuration</CardTitle>
                    <CardDescription>System-wide email delivery settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Host</Label>
                            <Input
                                value={coreData.smtp?.host || ""}
                                onChange={(e) => handleCoreNestedChange('smtp', 'host', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input
                                type="number"
                                value={coreData.smtp?.port || 587}
                                onChange={(e) => handleCoreNestedChange('smtp', 'port', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Input
                                value={coreData.smtp?.user || ""}
                                onChange={(e) => handleCoreNestedChange('smtp', 'user', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>From Email</Label>
                            <Input
                                value={coreData.smtp?.fromEmail || ""}
                                onChange={(e) => handleCoreNestedChange('smtp', 'fromEmail', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>From Name</Label>
                            <Input
                                value={coreData.smtp?.fromName || "System"}
                                onChange={(e) => handleCoreNestedChange('smtp', 'fromName', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <Label>Secure Connection (SSL/TLS)</Label>
                            <Switch
                                checked={coreData.smtp?.secure || false}
                                onCheckedChange={(c) => handleCoreNestedChange('smtp', 'secure', c)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Backup Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Backup Registry</CardTitle>
                    <CardDescription>Automated database backup schedules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Schedule</Label>
                            <Select
                                value={coreData.backup?.schedule || "daily"}
                                onValueChange={(v) => handleCoreNestedChange('backup', 'schedule', v)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Retention Count</Label>
                            <Input
                                type="number"
                                value={coreData.backup?.retentionCount || 7}
                                onChange={(e) => handleCoreNestedChange('backup', 'retentionCount', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Storage Path</Label>
                        <Input
                            value={coreData.backup?.storagePath || "/backups"}
                            onChange={(e) => handleCoreNestedChange('backup', 'storagePath', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label>Encryption Enabled</Label></div>
                        <Switch
                            checked={coreData.backup?.encryptionEnabled || false}
                            onCheckedChange={(c) => handleCoreNestedChange('backup', 'encryptionEnabled', c)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
