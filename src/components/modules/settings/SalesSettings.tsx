"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SalesSettings({ data, onChange }: { data: any, onChange: (key: string, value: any) => void }) {
    if (!data) return null;

    const updateCheckout = (key: string, value: any) => {
        onChange('checkout', { ...data.checkout, [key]: value });
    }

    const updateTax = (key: string, value: any) => {
        onChange('tax', { ...data.tax, [key]: value });
    }

    const updateShipping = (key: string, value: any) => {
        onChange('shipping', { ...data.shipping, [key]: value });
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
                            onChange={(e) => onChange('payment', { ...data.payment, paymentInstructions: e.target.value })}
                            placeholder="Instructions for Bank Transfer / Offline payments"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
