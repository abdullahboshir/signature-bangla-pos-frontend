"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileBadge, Calendar, Percent, ShieldCheck, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CorporateRegistryData {
    taxIdentificationNumber?: string
    vatNumber?: string
    tradeLicenseNumber?: string
    businessRegistrationNumber?: string
    incorporationDate?: string
    fiscalYearStartMonth?: number
    isVatEnabled?: boolean
    defaultTaxGroup?: string
}

interface CorporateRegistrySettingsProps {
    data: CorporateRegistryData
    onChange: (section: string, ...args: any[]) => void;
}

const MONTHS = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
]

export default function CorporateRegistrySettings({ data, onChange }: CorporateRegistrySettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    Corporate & Legal Registry
                </CardTitle>
                <CardDescription>Legal identification and registration info for government compliance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Business Registration No. (BIN/BRN)</Label>
                        <Input
                            value={data.businessRegistrationNumber || ""}
                            onChange={(e) => onChange("corporateRegistry", "businessRegistrationNumber", e.target.value)}
                            placeholder="e.g. 123456789"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Trade License Number</Label>
                        <Input
                            value={data.tradeLicenseNumber || ""}
                            onChange={(e) => onChange("corporateRegistry", "tradeLicenseNumber", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tax Identification No. (TIN)</Label>
                        <Input
                            value={data.taxIdentificationNumber || ""}
                            onChange={(e) => onChange("corporateRegistry", "taxIdentificationNumber", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>VAT Registration Number</Label>
                        <Input
                            value={data.vatNumber || ""}
                            onChange={(e) => onChange("corporateRegistry", "vatNumber", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Incorporation Date
                        </Label>
                        <Input
                            type="date"
                            value={data.incorporationDate || ""}
                            onChange={(e) => onChange("corporateRegistry", "incorporationDate", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Fiscal Year Start Month
                        </Label>
                        <Select
                            value={data.fiscalYearStartMonth?.toString() || "1"}
                            onValueChange={(val) => onChange("corporateRegistry", "fiscalYearStartMonth", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map(m => (
                                    <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 pt-8">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="vat-enabled"
                                checked={data.isVatEnabled ?? false}
                                onCheckedChange={(val) => onChange("corporateRegistry", "isVatEnabled", val)}
                            />
                            <Label htmlFor="vat-enabled">Is VAT Enabled for this Entity?</Label>
                        </div>
                    </div>
                </div>

                {data.isVatEnabled && (
                    <div className="space-y-2 pt-4 border-t max-w-xs">
                        <Label>Default Tax/VAT Group</Label>
                        <Input
                            value={data.defaultTaxGroup || ""}
                            onChange={(e) => onChange("corporateRegistry", "defaultTaxGroup", e.target.value)}
                            placeholder="e.g. Standard 15%"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
