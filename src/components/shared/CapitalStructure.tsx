"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign } from "lucide-react"

interface CapitalStructureData {
    authorizedCapital?: number
    paidUpCapital?: number
    shareCapital?: number
    currency?: string
}

interface CapitalStructureProps {
    value: CapitalStructureData
    onChange: (capital: CapitalStructureData) => void
}

const CURRENCIES = [
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
]

export function CapitalStructure({ value, onChange }: CapitalStructureProps) {
    const handleChange = (field: keyof CapitalStructureData, val: string | number) => {
        onChange({ ...value, [field]: val })
    }

    const selectedCurrency = CURRENCIES.find(c => c.code === (value.currency || "BDT"))

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Capital Structure
                </CardTitle>
                <CardDescription>
                    Define the organization's capital allocation and structure
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                        value={value.currency || "BDT"}
                        onValueChange={(val) => handleChange("currency", val)}
                    >
                        <SelectTrigger id="currency">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.symbol} {currency.name} ({currency.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="authorized">Authorized Capital</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency?.symbol}
                            </span>
                            <Input
                                id="authorized"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="1000000"
                                className="pl-8"
                                value={value.authorizedCapital || ""}
                                onChange={(e) => handleChange("authorizedCapital", parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Maximum capital the organization is authorized to issue
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paidUp">Paid-Up Capital</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency?.symbol}
                            </span>
                            <Input
                                id="paidUp"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="500000"
                                className="pl-8"
                                value={value.paidUpCapital || ""}
                                onChange={(e) => handleChange("paidUpCapital", parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Amount actually paid by shareholders
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="share">Share Capital</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency?.symbol}
                            </span>
                            <Input
                                id="share"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="500000"
                                className="pl-8"
                                value={value.shareCapital || ""}
                                onChange={(e) => handleChange("shareCapital", parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total value of shares issued
                        </p>
                    </div>
                </div>

                {value.paidUpCapital && value.authorizedCapital && value.paidUpCapital > value.authorizedCapital && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        ⚠️ Paid-up capital cannot exceed authorized capital
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
