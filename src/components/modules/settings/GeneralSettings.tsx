"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GeneralSettings({ data, onChange, isBusinessUnit = false }: { data: any, onChange: (section: string, ...args: any[]) => void, isBusinessUnit?: boolean }) {
    if (!data) return null;

    const updateDisplay = (key: string, value: any) => {
        onChange('display', key, value);
    }

    const updateSeo = (key: string, value: any) => {
        onChange('seo', key, value);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Control how products are displayed in your Outlet/POS</CardDescription>
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
                    <div className="grid gap-2">
                        <Label>Default Sort Order</Label>
                        <Select
                            value={data.display?.defaultSort || 'newest'}
                            onValueChange={(val) => updateDisplay('defaultSort', val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                                <SelectItem value="rating">Average Rating</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="text-sm font-medium">Storefront Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Enable Product Reviews</Label>
                                <Switch checked={data.display?.showProductReviews} onCheckedChange={(c) => updateDisplay('showProductReviews', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Show Related Products</Label>
                                <Switch checked={data.display?.showRelatedProducts} onCheckedChange={(c) => updateDisplay('showRelatedProducts', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Enable Quick View</Label>
                                <Switch checked={data.display?.enableQuickView} onCheckedChange={(c) => updateDisplay('enableQuickView', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Enable Wishlist</Label>
                                <Switch checked={data.display?.enableWishlist} onCheckedChange={(c) => updateDisplay('enableWishlist', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Enable Compare</Label>
                                <Switch checked={data.display?.enableCompare} onCheckedChange={(c) => updateDisplay('enableCompare', c)} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!isBusinessUnit && (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Generate Sitemap</Label>
                                <Switch
                                    checked={data.seo?.sitemap?.enabled}
                                    onCheckedChange={(c) => onChange('seo', 'sitemap', 'enabled', c)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Canonical URLs</Label>
                                <Switch checked={data.seo?.canonicalUrls} onCheckedChange={(c) => updateSeo('canonicalUrls', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Structured Data (JSON-LD)</Label>
                                <Switch checked={data.seo?.structuredData} onCheckedChange={(c) => updateSeo('structuredData', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Open Graph (Facebook)</Label>
                                <Switch checked={data.seo?.openGraph} onCheckedChange={(c) => updateSeo('openGraph', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Twitter Card</Label>
                                <Switch checked={data.seo?.twitterCard} onCheckedChange={(c) => updateSeo('twitterCard', c)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

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
                            onChange={(e) => onChange('prefixes', 'invoice', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Order Prefix</Label>
                        <Input
                            value={data.prefixes?.order || 'ORD-'}
                            onChange={(e) => onChange('prefixes', 'order', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Purchase Prefix</Label>
                        <Input
                            value={data.prefixes?.purchase || 'PUR-'}
                            onChange={(e) => onChange('prefixes', 'purchase', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>SKU Prefix</Label>
                        <Input
                            value={data.prefixes?.sku || 'SKU-'}
                            onChange={(e) => onChange('prefixes', 'sku', e.target.value)}
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
                            onCheckedChange={(c) => onChange('social', 'shareButtons', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Recent Purchases</Label>
                            <p className="text-sm text-muted-foreground">Social proof popup</p>
                        </div>
                        <Switch
                            checked={data.social?.socialProof?.showPurchaseNotifications}
                            onCheckedChange={(c) => onChange('social', 'socialProof', 'showPurchaseNotifications', c)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
