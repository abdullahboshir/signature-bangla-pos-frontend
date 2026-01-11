"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ComplianceSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

export default function ComplianceSettings({ data, onChange }: ComplianceSettingsProps) {

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Compliance & Privacy</CardTitle>
                    <CardDescription>Regulatory compliance and data governance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>GDPR Active</Label>
                            <p className="text-xs text-muted-foreground">Enforce EU GDPR data rights</p>
                        </div>
                        <Switch
                            checked={data?.gdprActive || false}
                            onCheckedChange={(c) => onChange('compliance', 'gdprActive', c)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Cookie Consent Banner</Label>
                            <p className="text-xs text-muted-foreground">Show consent modal on first visit</p>
                        </div>
                        <Switch
                            checked={data?.cookieConsent || false}
                            onCheckedChange={(c) => onChange('compliance', 'cookieConsent', c)}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Data Residency</Label>
                            <Select
                                value={data?.dataResidency || "local"}
                                onValueChange={(v) => onChange('compliance', 'dataResidency', v)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">Local (On-Premise)</SelectItem>
                                    <SelectItem value="cloud">Cloud (Managed)</SelectItem>
                                    <SelectItem value="regional">Regional Sovereign</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Document Retention (Years)</Label>
                            <Input
                                type="number"
                                value={data?.documentRetentionYears || 7}
                                onChange={(e) => onChange('compliance', 'documentRetentionYears', parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-semibold">PII Protection</h4>
                        <div className="flex items-center justify-between">
                            <Label className="font-normal">Mask Email Addresses in Logs</Label>
                            <Switch
                                checked={data?.piiProtection?.maskEmail || false}
                                onCheckedChange={(c) => onChange('compliance', 'piiProtection', 'maskEmail', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="font-normal">Mask Phone Numbers</Label>
                            <Switch
                                checked={data?.piiProtection?.maskPhone || false}
                                onCheckedChange={(c) => onChange('compliance', 'piiProtection', 'maskPhone', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="font-normal">Mask Full Addresses</Label>
                            <Switch
                                checked={data?.piiProtection?.maskAddress || false}
                                onCheckedChange={(c) => onChange('compliance', 'piiProtection', 'maskAddress', c)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Forensic Auditing</CardTitle>
                    <CardDescription>Advanced audit log integrity and retention.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Immutable Hashing</Label>
                            <p className="text-xs text-muted-foreground">Cryptographically chain logs to prevent tampering.</p>
                        </div>
                        <Switch
                            checked={data?.forensicAuditing?.immutableHashing || false}
                            onCheckedChange={(c) => onChange('compliance', 'forensicAuditing', 'immutableHashing', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Digital Signatures</Label>
                            <p className="text-xs text-muted-foreground">Sign audit logs with platform private key.</p>
                        </div>
                        <Switch
                            checked={data?.forensicAuditing?.signAuditLogs || false}
                            onCheckedChange={(c) => onChange('compliance', 'forensicAuditing', 'signAuditLogs', c)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Audit Retention (Years)</Label>
                        <Input
                            type="number"
                            value={data?.forensicAuditing?.retentionYears || 10}
                            onChange={(e) => onChange('compliance', 'forensicAuditing', 'retentionYears', parseInt(e.target.value))}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
