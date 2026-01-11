"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SecuritySettingsProps {
    data: any;
    onChange: (section: string, subsection: string, key: string, value: any) => void;
}

export default function SecuritySettings({ data, onChange }: SecuritySettingsProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Authentication Security</CardTitle>
                    <CardDescription>Password complexity and login safeguards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Min Password Length</Label>
                            <Input
                                type="number"
                                value={data?.passwordPolicy?.minLength || 8}
                                onChange={(e) => onChange('securityHardening', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password Expiry (Days)</Label>
                            <Input
                                type="number"
                                value={data?.passwordPolicy?.expiryDays || 90}
                                onChange={(e) => onChange('securityHardening', 'passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label>Require Special Characters</Label></div>
                        <Switch
                            checked={data?.passwordPolicy?.requireSpecialChar || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'passwordPolicy', 'requireSpecialChar', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label>Require Numbers</Label></div>
                        <Switch
                            checked={data?.passwordPolicy?.requireNumber || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'passwordPolicy', 'requireNumber', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Network & Access Control</CardTitle>
                    <CardDescription>Secure connection and IP filtering.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enforce HTTPS</Label>
                            <p className="text-xs text-muted-foreground">Redirect all HTTP traffic to HTTPS.</p>
                        </div>
                        <Switch
                            checked={data?.networkPolicy?.enableHttps || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'networkPolicy', 'enableHttps', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label>Block Failed Logins</Label><p className="text-xs text-muted-foreground">Temporarily lock account after repeated failures</p></div>
                        <Switch
                            checked={data?.networkPolicy?.blockFailedLogins || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'networkPolicy', 'blockFailedLogins', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5"><Label>Enable CAPTCHA</Label><p className="text-xs text-muted-foreground">Require CAPTCHA on risky logins</p></div>
                        <Switch
                            checked={data?.networkPolicy?.enableCaptcha || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'networkPolicy', 'enableCaptcha', c)}
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>IP Whitelist</Label>
                            <Input
                                placeholder="Comma separated IPs"
                                value={data?.networkPolicy?.ipWhitelist?.join(', ') || ""}
                                onChange={(e) => onChange('securityHardening', 'networkPolicy', 'ipWhitelist', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>IP Blacklist</Label>
                            <Input
                                placeholder="Comma separated IPs"
                                value={data?.networkPolicy?.ipBlacklist?.join(', ') || ""}
                                onChange={(e) => onChange('securityHardening', 'networkPolicy', 'ipBlacklist', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Session Policy</CardTitle>
                    <CardDescription>Session timeouts and concurrency limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Inactivity Timeout (Minutes)</Label>
                            <Input
                                type="number"
                                value={data?.sessionPolicy?.inactivityTimeoutMinutes || 30}
                                onChange={(e) => onChange('securityHardening', 'sessionPolicy', 'inactivityTimeoutMinutes', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Concurrent Sessions (User)</Label>
                            <Input
                                type="number"
                                value={data?.sessionPolicy?.maxConcurrentSessions || 3}
                                onChange={(e) => onChange('securityHardening', 'sessionPolicy', 'maxConcurrentSessions', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>MFA & Identity</CardTitle>
                    <CardDescription>Multi-factor authentication enforcement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label>MFA Requirement</Label>
                        <Select
                            value={data?.mfa?.requirement || "none"}
                            onValueChange={(v) => onChange('securityHardening', 'mfa', 'requirement', v)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (Optional)</SelectItem>
                                <SelectItem value="optional">User Opt-in</SelectItem>
                                <SelectItem value="mandatory">Mandatory for All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Allowed MFA Methods</Label>
                        <Input
                            placeholder="e.g. email, totp, sms"
                            value={data?.mfa?.methods?.join(', ') || "email"}
                            onChange={(e) => onChange('securityHardening', 'mfa', 'methods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Enforcement Roles</Label>
                        <Input
                            placeholder="e.g. ADMIN, MANAGER"
                            value={data?.mfa?.enforcementRoles?.join(', ') || ""}
                            onChange={(e) => onChange('securityHardening', 'mfa', 'enforcementRoles', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        />
                        <p className="text-xs text-muted-foreground">List of roles that MUST use MFA if requirement is set.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Session Isolation</CardTitle>
                    <CardDescription>Advanced session binding and fingerprinting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>IP Lock</Label>
                            <p className="text-xs text-muted-foreground">Bind session to the original login IP address.</p>
                        </div>
                        <Switch
                            checked={data?.sessionIsolation?.ipLock || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'sessionIsolation', 'ipLock', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Device Fingerprinting</Label>
                            <p className="text-xs text-muted-foreground">Use browser fingerprinting to prevent session hijacking.</p>
                        </div>
                        <Switch
                            checked={data?.sessionIsolation?.deviceFingerprinting || false}
                            onCheckedChange={(c) => onChange('securityHardening', 'sessionIsolation', 'deviceFingerprinting', c)}
                        />
                    </div>
                    <div className="space-y-2 mt-4">
                        <Label>Max Concurrent Sessions (Isolation Limit)</Label>
                        <Input
                            type="number"
                            value={data?.sessionIsolation?.maxConcurrentSessions || 3}
                            onChange={(e) => onChange('securityHardening', 'sessionIsolation', 'maxConcurrentSessions', parseInt(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">Strict hard limit for sessions under isolation mode.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
