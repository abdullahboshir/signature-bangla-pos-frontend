"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GeneralSettings({ data, onChange }: { data: any, onChange: (key: string, value: any) => void }) {
    if (!data) return null;

    const updateDisplay = (key: string, value: any) => {
        onChange('display', { ...data.display, [key]: value });
    }

    const updateSeo = (key: string, value: any) => {
        onChange('seo', { ...data.seo, [key]: value });
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Control how products are displayed in your store/POS</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Out of Stock Products</Label>
                            <p className="text-sm text-muted-foreground">Display products that are out of stock</p>
                        </div>
                        <Switch
                            checked={data.display?.showOutOfStock}
                            onCheckedChange={(c) => updateDisplay('showOutOfStock', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Stock Quantity</Label>
                            <p className="text-sm text-muted-foreground">Show exact stock quantity to customers</p>
                        </div>
                        <Switch
                            checked={data.display?.showStockQuantity}
                            onCheckedChange={(c) => updateDisplay('showStockQuantity', c)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Products Per Page</Label>
                        <Input
                            type="number"
                            value={data.display?.productsPerPage || 24}
                            onChange={(e) => updateDisplay('productsPerPage', parseInt(e.target.value))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Search engine optimization configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Meta Robots</Label>
                        <Select
                            value={data.seo?.metaRobots || 'index, follow'}
                            onValueChange={(val) => updateSeo('metaRobots', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="index, follow">Index, Follow</SelectItem>
                                <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                                <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Generate Sitemap</Label>
                        </div>
                        <Switch
                            checked={data.seo?.sitemap?.enabled}
                            onCheckedChange={(c) => onChange('seo', { ...data.seo, sitemap: { ...data.seo?.sitemap, enabled: c } })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Prefixes Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>System Prefixes</CardTitle>
                    <CardDescription>Customize the prefixes for various system generated IDs</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Invoice Prefix</Label>
                        <Input
                            value={data.prefixes?.invoice || 'INV-'}
                            onChange={(e) => onChange('prefixes', { ...data.prefixes, invoice: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Order Prefix</Label>
                        <Input
                            value={data.prefixes?.order || 'ORD-'}
                            onChange={(e) => onChange('prefixes', { ...data.prefixes, order: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Purchase Prefix</Label>
                        <Input
                            value={data.prefixes?.purchase || 'PUR-'}
                            onChange={(e) => onChange('prefixes', { ...data.prefixes, purchase: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>SKU Prefix</Label>
                        <Input
                            value={data.prefixes?.sku || 'SKU-'}
                            onChange={(e) => onChange('prefixes', { ...data.prefixes, sku: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
                <CardHeader>
                    <CardTitle>Social Media & Proof</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Social Share Buttons</Label>
                        </div>
                        <Switch
                            checked={data.social?.shareButtons}
                            onCheckedChange={(c) => onChange('social', { ...data.social, shareButtons: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Recent Purchases</Label>
                            <p className="text-sm text-muted-foreground">Social proof popup</p>
                        </div>
                        <Switch
                            checked={data.social?.socialProof?.showPurchaseNotifications}
                            onCheckedChange={(c) => onChange('social', { ...data.social, socialProof: { ...data.social?.socialProof, showPurchaseNotifications: c } })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
