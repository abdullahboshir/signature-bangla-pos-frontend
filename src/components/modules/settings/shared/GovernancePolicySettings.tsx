"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShieldAlert, BookOpen } from "lucide-react"

interface GovernancePolicyData {
    auditTrailSensitivity?: 'low' | 'medium' | 'high'
    retentionPeriodMonths?: number
}

interface GovernancePolicySettingsProps {
    data: GovernancePolicyData
    onChange: (section: string, key: string, value: any) => void
}

export default function GovernancePolicySettings({ data, onChange }: GovernancePolicySettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                    Internal Governance Policy
                </CardTitle>
                <CardDescription>Configure system behavior regarding audits and internal data controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Audit Trail Sensitivity
                    </Label>
                    <Select
                        value={data.auditTrailSensitivity || "medium"}
                        onValueChange={(val) => onChange("governance", "auditTrailSensitivity", val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low (Core entities only)</SelectItem>
                            <SelectItem value="medium">Medium (Standard industrial logging)</SelectItem>
                            <SelectItem value="high">High (Forensic level, log every change)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Higher sensitivity increases database size but provides deeper traceability.</p>
                </div>

                <div className="space-y-2">
                    <Label>Audit Retention Period (Months)</Label>
                    <Input
                        type="number"
                        value={data.retentionPeriodMonths || 12}
                        onChange={(e) => onChange("governance", "retentionPeriodMonths", parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Duration for which logs are kept in primary searchable storage.</p>
                </div>
            </CardContent>
        </Card>
    )
}
