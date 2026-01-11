"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Hash } from "lucide-react"

interface PrefixPolicyData {
    invoice?: string
    order?: string
    purchase?: string
    sku?: string
    customer?: string
    supplier?: string
    vendor?: string
    product?: string
    expense?: string
    category?: string
}

interface PrefixPolicySettingsProps {
    data: PrefixPolicyData
    onChange: (section: string, key: string, value: any) => void
}

const PREFIX_FIELDS = [
    { key: "invoice", label: "Invoice Prefix", placeholder: "INV-" },
    { key: "order", label: "Order Prefix", placeholder: "ORD-" },
    { key: "purchase", label: "Purchase Prefix", placeholder: "PUR-" },
    { key: "sku", label: "SKU Prefix", placeholder: "SKU-" },
    { key: "customer", label: "Customer Prefix", placeholder: "CUST-" },
    { key: "supplier", label: "Supplier Prefix", placeholder: "SUPP-" },
    { key: "vendor", label: "Vendor Prefix", placeholder: "VEND-" },
    { key: "product", label: "Product Prefix", placeholder: "PROD-" },
    { key: "expense", label: "Expense Prefix", placeholder: "EXP-" },
    { key: "category", label: "Category Prefix", placeholder: "CAT-" }
]

export default function PrefixPolicySettings({ data, onChange }: PrefixPolicySettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-500" />
                    Global Prefix Policy
                </CardTitle>
                <CardDescription>Customizable prefixes for various system entity identifiers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PREFIX_FIELDS.map(field => (
                        <div key={field.key} className="space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">{field.label}</Label>
                            <Input
                                value={data[field.key as keyof PrefixPolicyData] || ""}
                                onChange={(e) => onChange("prefixes", field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="font-mono text-sm"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
