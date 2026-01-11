"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalesSettings({ data, onChange }: { data: any, onChange: (section: string, ...args: any[]) => void }) {
    if (!data) return null;

    const updateCheckout = (key: string, value: any) => {
        onChange('checkout', key, value);
    }

    const updateTax = (key: string, value: any) => {
        onChange('tax', key, value);
    }

    const updateShipping = (key: string, value: any) => {
        onChange('shipping', key, value);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Checkout Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Guest Checkout</Label>
                            <Switch
                                checked={data.checkout?.guestCheckout}
                                onCheckedChange={(c) => updateCheckout('guestCheckout', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Require Account Creation</Label>
                            <Switch
                                checked={data.checkout?.requireAccount}
                                onCheckedChange={(c) => updateCheckout('requireAccount', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Enable Coupons</Label>
                            <Switch
                                checked={data.checkout?.enableCoupons}
                                onCheckedChange={(c) => updateCheckout('enableCoupons', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Enable Gift Cards</Label>
                            <Switch
                                checked={data.checkout?.enableGiftCards}
                                onCheckedChange={(c) => updateCheckout('enableGiftCards', c)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Minimum Order Amount</Label>
                        <Input
                            type="number"
                            value={data.checkout?.minimumOrderAmount || 0}
                            onChange={(e) => updateCheckout('minimumOrderAmount', parseFloat(e.target.value))}
                        />
                    </div>
                    {/* Placeholder for Terms and Privacy Policy Text Areas if needed */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Display & Catalog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                            <Label>Show Out of Stock</Label>
                            <Switch
                                checked={data.display?.showOutOfStock}
                                onCheckedChange={(c) => onChange('display', 'showOutOfStock', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Reviews</Label>
                            <Switch
                                checked={data.display?.showProductReviews}
                                onCheckedChange={(c) => onChange('display', 'showProductReviews', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Show Related Products</Label>
                            <Switch
                                checked={data.display?.showRelatedProducts}
                                onCheckedChange={(c) => onChange('display', 'showRelatedProducts', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Enable Quick View</Label>
                            <Switch
                                checked={data.display?.enableQuickView}
                                onCheckedChange={(c) => onChange('display', 'enableQuickView', c)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Products Per Page</Label>
                            <Input
                                type="number"
                                value={data.display?.productsPerPage || 24}
                                onChange={(e) => onChange('display', 'productsPerPage', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Default Sort</Label>
                            <Select
                                value={data.display?.defaultSort || 'newest'}
                                onValueChange={(val) => onChange('display', 'defaultSort', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    <SelectItem value="popularity">Popularity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tax Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Enable Tax Calculation</Label>
                        <Switch
                            checked={data.tax?.enabled}
                            onCheckedChange={(c) => updateTax('enabled', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>Prices Include Tax</Label>
                        <Switch
                            checked={data.tax?.pricesIncludeTax}
                            onCheckedChange={(c) => updateTax('pricesIncludeTax', c)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Tax Calculation Based On</Label>
                        <Select
                            value={data.tax?.taxBasedOn || 'shipping'}
                            onValueChange={(val) => updateTax('taxBasedOn', val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shipping">Customer Shipping Address</SelectItem>
                                <SelectItem value="billing">Customer Billing Address</SelectItem>
                                <SelectItem value="businessUnit">Business Unit Address</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Shipping Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Enable Shipping</Label>
                        <Switch
                            checked={data.shipping?.enabled}
                            onCheckedChange={(c) => updateShipping('enabled', c)}
                        />
                    </div>

                    {data.shipping?.enabled && (
                        <>
                            <div className="flex items-center justify-between">
                                <Label>Enable Free Shipping</Label>
                                <Switch
                                    checked={data.shipping?.freeShippingEnabled}
                                    onCheckedChange={(c) => updateShipping('freeShippingEnabled', c)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Default Shipping Rate</Label>
                                    <Input
                                        type="number"
                                        value={data.shipping?.defaultRate || 0}
                                        onChange={(e) => updateShipping('defaultRate', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Handling Fee</Label>
                                    <Input
                                        type="number"
                                        value={data.shipping?.handlingFee || 0}
                                        onChange={(e) => updateShipping('handlingFee', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Payment Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Cash On Delivery</Label>
                        </div>
                        <Switch
                            checked={data.payment?.cashOnDelivery}
                            onCheckedChange={(c) => onChange('payment', { ...data.payment, cashOnDelivery: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Bank Transfer</Label>
                        </div>
                        <Switch
                            checked={data.payment?.bankTransfer}
                            onCheckedChange={(c) => onChange('payment', { ...data.payment, bankTransfer: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Mobile Banking</Label>
                        </div>
                        <Switch
                            checked={data.payment?.mobileBanking}
                            onCheckedChange={(c) => onChange('payment', { ...data.payment, mobileBanking: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto Capture Payments</Label>
                            <p className="text-xs text-muted-foreground">Automatically capture funds when order is placed</p>
                        </div>
                        <Switch
                            checked={data.payment?.autoCapture}
                            onCheckedChange={(c) => onChange('payment', { ...data.payment, autoCapture: c })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Payment Instructions</Label>
                        <Input
                            value={data.payment?.paymentInstructions || ''}
                            onChange={(e) => onChange('payment', 'paymentInstructions', e.target.value)}
                            placeholder="Instructions for Bank Transfer / Offline payments"
                        />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <Label className="text-base">Transaction Guardrails</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Max Transaction Value</Label>
                                <Input
                                    type="number"
                                    value={data.payment?.transactionGuardrails?.maxTransactionValue || 100000}
                                    onChange={(e) => onChange('payment', 'transactionGuardrails', 'maxTransactionValue', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Max Daily Volume</Label>
                                <Input
                                    type="number"
                                    value={data.payment?.transactionGuardrails?.maxDailyVolume || 500000}
                                    onChange={(e) => onChange('payment', 'transactionGuardrails', 'maxDailyVolume', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="flex items-center justify-between md:col-span-2">
                                <div className="space-y-0.5">
                                    <Label>Velocity Check Enabled</Label>
                                    <p className="text-xs text-muted-foreground">Flag unusual burst of transactions</p>
                                </div>
                                <Switch
                                    checked={data.payment?.transactionGuardrails?.velocityCheckEnabled}
                                    onCheckedChange={(c) => onChange('payment', 'transactionGuardrails', 'velocityCheckEnabled', c)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
