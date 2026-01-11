"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"

export function PosSettings({ data, onChange }: { data: any, onChange: (section: string, ...args: any[]) => void }) {
    if (!data) return null;

    const updatePos = (key: string, value: any) => {
        onChange('pos', key, value);
    }

    const updateRewards = (key: string, value: any) => {
        onChange('rewardPoints', key, value);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>POS Configuration</CardTitle>
                    <CardDescription>Point of Sale specific settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Receipt Layout</Label>
                        <Select
                            value={data.pos?.receiptLayout || 'thermal'}
                            onValueChange={(val) => updatePos('receiptLayout', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="thermal">Thermal (Standard)</SelectItem>
                                <SelectItem value="simple">Simple Text</SelectItem>
                                <SelectItem value="detailed">Detailed (A4/Letter)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Sound Effects</Label>
                        </div>
                        <Switch
                            checked={data.pos?.soundEffects}
                            onCheckedChange={(c) => updatePos('soundEffects', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Disable Suspend/Hold</Label>
                        </div>
                        <Switch
                            checked={data.pos?.disableSuspend}
                            onCheckedChange={(c) => updatePos('disableSuspend', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hardware Configuration</CardTitle>
                    <CardDescription>Manage printers and customer facing displays</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Printer Connection</Label>
                            <Select
                                value={data.pos?.printer?.connectionType || 'wifi'}
                                onValueChange={(val) => onChange('pos', 'printer', 'connectionType', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wifi">WiFi / Network</SelectItem>
                                    <SelectItem value="usb">USB</SelectItem>
                                    <SelectItem value="bluetooth">Bluetooth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Paper Size</Label>
                            <Select
                                value={data.pos?.printer?.paperSize || '80mm'}
                                onValueChange={(val) => onChange('pos', 'printer', 'paperSize', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="80mm">80mm (Standard)</SelectItem>
                                    <SelectItem value="58mm">58mm (Small)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Printer Port / IP</Label>
                            <Input
                                value={data.pos?.printer?.port || 9100}
                                onChange={(e) => onChange('pos', 'printer', 'port', parseInt(e.target.value))}
                                placeholder="e.g. 9100 or 192.168.1.50"
                            />
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="grid gap-2">
                        <Label>Customer Facing Display</Label>
                        <Select
                            value={data.pos?.display?.type || 'none'}
                            onValueChange={(val) => onChange('pos', 'display', 'type', val)}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="lcd">LCD (2-line)</SelectItem>
                                <SelectItem value="tablet">Secondary Tablet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loyalty & Rewards</CardTitle>
                    <CardDescription>Configure customer reward points system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Reward Points</Label>
                        </div>
                        <Switch
                            checked={data.rewardPoints?.enabled}
                            onCheckedChange={(c) => updateRewards('enabled', c)}
                        />
                    </div>
                    {data.rewardPoints?.enabled && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Points Per Currency Unit</Label>
                                    <Input
                                        type="number"
                                        value={data.rewardPoints?.pointsPerCurrency || 1}
                                        onChange={(e) => updateRewards('pointsPerCurrency', parseFloat(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">E.g., Earn 1 point for every $1 spent</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Redemption Value (per point)</Label>
                                    <Input
                                        type="number"
                                        value={data.rewardPoints?.currencyPerPoint || 0.01}
                                        onChange={(e) => updateRewards('currencyPerPoint', parseFloat(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">E.g., 1 point = $0.01 discount</p>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Points Expiry (Months)</Label>
                                <Input
                                    type="number"
                                    value={data.rewardPoints?.expiryPeriod || 12}
                                    onChange={(e) => updateRewards('expiryPeriod', parseFloat(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Receipt Customization</CardTitle>
                    <CardDescription>Customize the look and feel of printed receipts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Show Store Logo</Label>
                        </div>
                        <Switch
                            checked={data.pos?.showLogo}
                            onCheckedChange={(c) => updatePos('showLogo', c)}
                        />
                    </div>
                    {data.pos?.showLogo && (
                        <div className="grid gap-2">
                            <Label>Logo Position</Label>
                            <Select
                                value={data.pos?.logoPosition || 'top'}
                                onValueChange={(val) => updatePos('logoPosition', val)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="top">Top (Header)</SelectItem>
                                    <SelectItem value="bottom">Bottom (Footer)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label>Receipt Header Text</Label>
                        <Input
                            value={data.pos?.receiptHeader || ''}
                            onChange={(e) => updatePos('receiptHeader', e.target.value)}
                            placeholder="e.g. Welcome to Signature Bangla"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Receipt Footer Text</Label>
                        <Input
                            value={data.pos?.receiptFooter || ''}
                            onChange={(e) => updatePos('receiptFooter', e.target.value)}
                            placeholder="e.g. Thank you for shopping with us!"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Cashier & Registry
                    </CardTitle>
                    <CardDescription>Configure operational flows for your cashiers and registers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Maximum Float Limit</Label>
                            <Input
                                type="number"
                                value={data.cashier?.maxFloatLimit || 5000}
                                onChange={(e) => onChange('cashier', 'maxFloatLimit', parseFloat(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">Alert when cash in drawer exceeds this amount</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Default Register ID</Label>
                            <Input
                                value={data.cashier?.defaultCashRegisterId || ""}
                                onChange={(e) => onChange('cashier', 'defaultCashRegisterId', e.target.value)}
                                placeholder="REG-001"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Allow Sale Suspension</Label>
                                <p className="text-xs text-muted-foreground">Let cashiers put regular sales on hold</p>
                            </div>
                            <Switch
                                checked={data.cashier?.allowSuspension ?? true}
                                onCheckedChange={(c) => onChange('cashier', 'allowSuspension', c)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Require Manager Approval for Void</Label>
                                <p className="text-xs text-muted-foreground">Manager PIN/Approval required to void a line item or sale</p>
                            </div>
                            <Switch
                                checked={data.cashier?.requireManagerApprovalForVoid ?? false}
                                onCheckedChange={(c) => onChange('cashier', 'requireManagerApprovalForVoid', c)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
