"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LegalSettingsProps {
    data: any;
    onChange: (section: string, ...args: any[]) => void;
}

export default function LegalSettings({ data, onChange }: LegalSettingsProps) {


    return (
        <Card>
            <CardHeader>
                <CardTitle>Legal Governance</CardTitle>
                <CardDescription>Links and contacts for legal compliance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Terms & Conditions URL</Label>
                    <Input
                        value={data?.termsUrl || ""}
                        onChange={(e) => onChange('legal', 'termsUrl', e.target.value)}
                        placeholder="/terms"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Privacy Policy URL</Label>
                    <Input
                        value={data?.privacyUrl || ""}
                        onChange={(e) => onChange('legal', 'privacyUrl', e.target.value)}
                        placeholder="/privacy"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Cookie Policy URL</Label>
                    <Input
                        value={data?.cookiePolicyUrl || ""}
                        onChange={(e) => onChange('legal', 'cookiePolicyUrl', e.target.value)}
                        placeholder="/cookies"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Legal Contact Email</Label>
                    <Input
                        type="email"
                        value={data?.legalContactEmail || ""}
                        onChange={(e) => onChange('legal', 'legalContactEmail', e.target.value)}
                        placeholder="legal@example.com"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
