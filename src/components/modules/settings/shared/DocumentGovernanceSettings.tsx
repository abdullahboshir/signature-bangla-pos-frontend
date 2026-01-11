"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Printer, PenTool, Layout } from "lucide-react"

interface DocumentGovernanceData {
    printing?: {
        enableWatermark: boolean
        watermarkText: string
        watermarkOpacity: number
    }
    signatures?: {
        digitalSignatureUrl: string
        showOnInvoices: boolean
        authorizedSignatories: string[]
    }
    invoiceLayout?: {
        template: string
        showLogo: boolean
        footerText: string
    }
    invoiceSettings?: {
        prefix: string
        footerText: string
        showTaxSummary: boolean
    }
}

interface DocumentGovernanceSettingsProps {
    data: DocumentGovernanceData
    onChange: (section: string, ...args: any[]) => void
}

export default function DocumentGovernanceSettings({ data, onChange }: DocumentGovernanceSettingsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Printer className="h-5 w-5 text-blue-500" />
                        Printing & Watermarks
                    </CardTitle>
                    <CardDescription>Configure document printing preferences and security marks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable Watermark</Label>
                            <p className="text-sm text-muted-foreground">Show a background text on all printed documents</p>
                        </div>
                        <Switch
                            checked={data.printing?.enableWatermark ?? false}
                            onCheckedChange={(val) => onChange("documentGovernance", "printing", "enableWatermark", val)}
                        />
                    </div>

                    {data.printing?.enableWatermark && (
                        <>
                            <div className="space-y-2">
                                <Label>Watermark Text</Label>
                                <Input
                                    value={data.printing?.watermarkText || ""}
                                    onChange={(e) => onChange("documentGovernance", "printing", "watermarkText", e.target.value)}
                                    placeholder="e.g. OFFICIAL COPY, CONFIDENTIAL"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label>Watermark Opacity ({Math.round((data.printing?.watermarkOpacity || 0.1) * 100)}%)</Label>
                                <input
                                    type="range"
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    min={0.05}
                                    max={0.5}
                                    step={0.05}
                                    value={data.printing?.watermarkOpacity || 0.1}
                                    onChange={(e) => onChange("documentGovernance", "printing", "watermarkOpacity", parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-purple-500" />
                        Signatures & Authorization
                    </CardTitle>
                    <CardDescription>Manage digital signatures and authorized signatories for documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Show Signatures on Invoices</Label>
                            <p className="text-sm text-muted-foreground">Automatically attach digital signature to invoices</p>
                        </div>
                        <Switch
                            checked={data.signatures?.showOnInvoices ?? false}
                            onCheckedChange={(val) => onChange("documentGovernance", "signatures", "showOnInvoices", val)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Digital Signature URL</Label>
                        <Input
                            value={data.signatures?.digitalSignatureUrl || ""}
                            onChange={(e) => onChange("documentGovernance", "signatures", "digitalSignatureUrl", e.target.value)}
                            placeholder="https://storage.com/signature.png"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Authorized Signatories</Label>
                        <Input
                            value={data.signatures?.authorizedSignatories?.join(", ") || ""}
                            onChange={(e) => onChange("documentGovernance", "signatures", "authorizedSignatories", e.target.value.split(",").map(s => s.trim()))}
                            placeholder="John Doe, Jane Smith (Comma separated)"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5 text-orange-500" />
                        Invoice Layout & Details
                    </CardTitle>
                    <CardDescription>Customize the look and feel of your customer-facing invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Invoice Template</Label>
                            <Select
                                value={data.invoiceLayout?.template || "standard"}
                                onValueChange={(val) => onChange("documentGovernance", "invoiceLayout", "template", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard Corporate</SelectItem>
                                    <SelectItem value="compact">Compact POS</SelectItem>
                                    <SelectItem value="modern">Modern Minimal</SelectItem>
                                    <SelectItem value="thermal">Thermal Roll (58/80mm)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between pt-8">
                            <Label>Show Logo</Label>
                            <Switch
                                checked={data.invoiceLayout?.showLogo ?? true}
                                onCheckedChange={(val) => onChange("documentGovernance", "invoiceLayout", "showLogo", val)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Invoice Prefix</Label>
                            <Input
                                value={data.invoiceSettings?.prefix || "INV-"}
                                onChange={(e) => onChange("documentGovernance", "invoiceSettings", "prefix", e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between pt-8">
                            <Label>Show Tax Summary Table</Label>
                            <Switch
                                checked={data.invoiceSettings?.showTaxSummary ?? true}
                                onCheckedChange={(val) => onChange("documentGovernance", "invoiceSettings", "showTaxSummary", val)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Global Footer Text</Label>
                        <Input
                            value={data.invoiceLayout?.footerText || ""}
                            onChange={(e) => {
                                onChange("documentGovernance", "invoiceLayout", "footerText", e.target.value);
                                onChange("documentGovernance", "invoiceSettings", "footerText", e.target.value);
                            }}
                            placeholder="e.g. Thank you for your business!"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
