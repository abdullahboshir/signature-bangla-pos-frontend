"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tag, Hash, Percent } from "lucide-react"

interface PricingPolicyData {
    isTaxInclusive?: boolean
    priceRounding?: "nearest" | "floor" | "ceiling"
    decimalPlaces?: number
    allowPriceOverride?: boolean
}

interface PricingPolicySettingsProps {
    data: PricingPolicyData
    onChange: (section: string, key: string, value: any) => void
}

export default function PricingPolicySettings({ data, onChange }: PricingPolicySettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-500" />
                    Pricing Policy
                </CardTitle>
                <CardDescription>Define how prices are displayed and handled across the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Tax Inclusive Pricing</Label>
                        <p className="text-sm text-muted-foreground">Product prices entered will already include applicable taxes</p>
                    </div>
                    <Switch
                        checked={data.isTaxInclusive ?? false}
                        onCheckedChange={(val) => onChange("pricingPolicy", "isTaxInclusive", val)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Allow Price Override</Label>
                        <p className="text-sm text-muted-foreground">Permit agents to manually change prices at checkout (requires permission)</p>
                    </div>
                    <Switch
                        checked={data.allowPriceOverride ?? true}
                        onCheckedChange={(val) => onChange("pricingPolicy", "allowPriceOverride", val)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            Decimal Places
                        </Label>
                        <Select
                            value={data.decimalPlaces?.toString() || "2"}
                            onValueChange={(val) => onChange("pricingPolicy", "decimalPlaces", parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0 (e.g. 500)</SelectItem>
                                <SelectItem value="1">1 (e.g. 500.5)</SelectItem>
                                <SelectItem value="2">2 (e.g. 500.50)</SelectItem>
                                <SelectItem value="3">3 (e.g. 500.500)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">How many digits to show after the decimal point.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            Price Rounding
                        </Label>
                        <Select
                            value={data.priceRounding || "nearest"}
                            onValueChange={(val) => onChange("pricingPolicy", "priceRounding", val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nearest">Round to Nearest</SelectItem>
                                <SelectItem value="floor">Always Round Down (Floor)</SelectItem>
                                <SelectItem value="ceiling">Always Round Up (Ceiling)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Logic for handling fractional currency units.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
