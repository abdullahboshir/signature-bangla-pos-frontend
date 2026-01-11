"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Percent, Globe, Receipt, Plus, Trash2 } from "lucide-react"

interface TaxClass {
    name: string
    rate: number
    countries?: string[]
    states?: string[]
    effectiveDate?: string
}

interface TaxIntelligenceData {
    enabled?: boolean
    pricesIncludeTax?: boolean
    taxType?: "vat" | "gst" | "sales_tax" | "none"
    taxIdLabel?: string
    taxBasedOn?: "shipping" | "billing" | "businessUnit"
    defaultTaxRate?: number
    jurisdiction?: string
    taxClasses?: TaxClass[]
    reporting?: {
        enabled: boolean
        frequency: "monthly" | "quarterly" | "annually"
        format: "pdf" | "excel" | "csv"
    }
}

interface TaxIntelligenceSettingsProps {
    data: TaxIntelligenceData
    onChange: (section: string, ...args: any[]) => void
}

export default function TaxIntelligenceSettings({ data, onChange }: TaxIntelligenceSettingsProps) {
    const handleAddTaxClass = () => {
        const newClasses = [...(data.taxClasses || []), {
            name: "",
            rate: 0,
            countries: [],
            states: []
        }]
        onChange("taxIntelligence", "taxClasses", newClasses)
    }

    const handleRemoveTaxClass = (index: number) => {
        const newClasses = (data.taxClasses || []).filter((_, i) => i !== index)
        onChange("taxIntelligence", "taxClasses", newClasses)
    }

    const handleClassChange = (index: number, field: keyof TaxClass, value: any) => {
        const newClasses = [...(data.taxClasses || [])]
        newClasses[index] = { ...newClasses[index], [field]: value }
        onChange("taxIntelligence", "taxClasses", newClasses)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-blue-500" />
                        Tax Configuration
                    </CardTitle>
                    <CardDescription>Enable tax calculation and define global tax behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable Tax Calculation</Label>
                            <p className="text-sm text-muted-foreground">Automatically calculate taxes on all transactions</p>
                        </div>
                        <Switch
                            checked={data.enabled ?? true}
                            onCheckedChange={(val) => onChange("taxIntelligence", "enabled", val)}
                        />
                    </div>

                    {data.enabled && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tax System Type</Label>
                                    <Select
                                        value={data.taxType || "none"}
                                        onValueChange={(val) => onChange("taxIntelligence", "taxType", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Tax</SelectItem>
                                            <SelectItem value="vat">VAT (Value Added Tax)</SelectItem>
                                            <SelectItem value="gst">GST (Goods & Services Tax)</SelectItem>
                                            <SelectItem value="sales_tax">Sales Tax</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax ID Label</Label>
                                    <Input
                                        value={data.taxIdLabel || "Tax ID"}
                                        onChange={(e) => onChange("taxIntelligence", "taxIdLabel", e.target.value)}
                                        placeholder="e.g. BIN, TIN, GSTIN"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        value={data.defaultTaxRate || 0}
                                        onChange={(e) => onChange("taxIntelligence", "defaultTaxRate", parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Calculate Tax Based On</Label>
                                    <Select
                                        value={data.taxBasedOn || "businessUnit"}
                                        onValueChange={(val) => onChange("taxIntelligence", "taxBasedOn", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="businessUnit">Business Unit Address</SelectItem>
                                            <SelectItem value="shipping">Shipping Address</SelectItem>
                                            <SelectItem value="billing">Billing Address</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Reporting section removed as it does not exist in backend schema for ISharedTaxIntelligence */}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Prices Include Tax</Label>
                                    <p className="text-sm text-muted-foreground">Product prices displayed already contain tax</p>
                                </div>
                                <Switch
                                    checked={data.pricesIncludeTax ?? false}
                                    onCheckedChange={(val) => onChange("taxIntelligence", "pricesIncludeTax", val)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tax Jurisdiction</Label>
                                <Input
                                    value={data.jurisdiction || ""}
                                    onChange={(e) => onChange("taxIntelligence", "jurisdiction", e.target.value)}
                                    placeholder="e.g. Bangladesh, California, UK"
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {data.enabled && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Percent className="h-5 w-5 text-orange-500" />
                                Advanced Tax Classes
                            </CardTitle>
                            <CardDescription>Define specific tax rates for different regions or categories.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAddTaxClass}>
                            <Plus className="h-4 w-4 mr-2" /> Add Tax Class
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(!data.taxClasses || data.taxClasses.length === 0) ? (
                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                No specific tax classes defined. Default rate will apply.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.taxClasses.map((item, index) => (
                                    <div key={index} className="p-4 border rounded-lg space-y-4 bg-muted/30 relative">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive"
                                            onClick={() => handleRemoveTaxClass(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Class Name</Label>
                                                <Input
                                                    value={item.name}
                                                    onChange={(e) => handleClassChange(index, "name", e.target.value)}
                                                    placeholder="e.g. Reduced Rate, Zero Rated"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tax Rate (%)</Label>
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleClassChange(index, "rate", parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Applicable Countries</Label>
                                                <Input
                                                    value={item.countries?.join(", ")}
                                                    onChange={(e) => handleClassChange(index, "countries", e.target.value.split(",").map(c => c.trim()))}
                                                    placeholder="US, CA, GB (Comma separated)"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Effective Date</Label>
                                                <Input
                                                    type="date"
                                                    value={item.effectiveDate || ""}
                                                    onChange={(e) => handleClassChange(index, "effectiveDate", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
